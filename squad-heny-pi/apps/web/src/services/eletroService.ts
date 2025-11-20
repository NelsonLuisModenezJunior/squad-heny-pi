const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface Eletro {
  eletro_id: number;
  local_id: number;
  comodo_id: number;
  categoria_id: number;
  eletro_nome: string;
  eletro_potencia: number;
  eletro_hrs_uso_dia: number;
  eletro_mensal_kwh?: number;
  eletro_anual_kwh?: number;
  eletro_custo_mensal?: number;
  eletro_custo_anual?: number;
  eletro_emissao_co2_anual?: number;
  classificacao_eficiencia?: string;
  created_at?: string;
  updated_at?: string;
  categoria?: { categoria_id: number; categoria_nome: string };
  comodo?: { comodo_id: number; comodo_nome: string };
  local?: { id: number; local_nome?: string; tarifa?: { tarifa_id: number; tarifa_valor: number } };
}

export interface CreateEletroRequest {
  categoria_id: number;
  comodo_id: number;
  local_id: number;
  eletro_nome: string;
  eletro_potencia: number;
  eletro_hrs_uso_dia: number;
  // optional computed fields can be omitted and will be calculated server-side
  eletro_mensal_kwh?: number;
  eletro_anual_kwh?: number;
  eletro_custo_mensal?: number;
  eletro_custo_anual?: number;
  eletro_emissao_co2_anual?: number;
}

export interface UpdateEletroRequest {
  categoria_id?: number;
  comodo_id?: number;
  local_id?: number | null;
  eletro_nome?: string;
  eletro_potencia?: number;
  eletro_hrs_uso_dia?: number;
  eletro_mensal_kwh?: number;
  eletro_anual_kwh?: number;
  eletro_custo_mensal?: number;
  eletro_custo_anual?: number;
  eletro_emissao_co2_anual?: number;
}

class EletroService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    console.log("Eletro - Token disponível:", token ? `${token.substring(0, 20)}...` : "NENHUM TOKEN");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getAll(): Promise<Eletro[]> {
    const response = await fetch(`${API_URL}/eletros`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar eletrodomésticos: ${response.statusText}`);
    }

    return response.json();
  }

  async getById(id: number | string): Promise<Eletro> {
    const response = await fetch(`${API_URL}/eletros/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar eletrodoméstico: ${response.statusText}`);
    }

    return response.json();
  }

  // dá uma mão pro backend caso ele não tenha esse endpoint
  async getByLocal(localId: number | string): Promise<Eletro[]> {
    const all = await this.getAll();
    return all.filter((e) => Number(e.local?.id) === Number(localId));
  }

  async create(data: CreateEletroRequest): Promise<Eletro> {
    try {
      console.log("Criando eletro com dados:", data);

      const response = await fetch(`${API_URL}/eletros`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      console.log("Eletro - Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Eletro - Erro da API:", errorText);

        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || response.statusText;
        } catch {
          errorMessage = errorText || response.statusText;
        }

        throw new Error(`Erro ao criar eletro: ${errorMessage}`);
      }

      const result = await response.json();
      console.log("Eletro criado com sucesso:", result);
      return result;
    } catch (error) {
      console.error("Eletro - Erro ao fazer requisição:", error);
      if (error instanceof Error) throw error;
      throw new Error("Erro desconhecido ao criar eletro");
    }
  }

  async update(id: number | string, data: UpdateEletroRequest): Promise<Eletro> {
    const response = await fetch(`${API_URL}/eletros/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errJson = JSON.parse(errorText);
        throw new Error(errJson.message || response.statusText);
      } catch {
        throw new Error(errorText || `Erro ao atualizar eletro: ${response.statusText}`);
      }
    }

    return response.json();
  }

  async delete(id: number | string): Promise<void> {
    const response = await fetch(`${API_URL}/eletros/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar eletro: ${response.statusText}`);
    }
  }
}

export const eletroService = new EletroService();
