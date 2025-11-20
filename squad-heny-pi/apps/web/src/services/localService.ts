const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface Local {
  id: number;
  local_nome: string;
  local_cidade: string;
  local_endereco: string;
  local_numero: string;
  estado_id: number;
  tarifa_id: number;
  created_at?: string;
  updated_at?: string;
  estado?: {
    id: number;
    estado_nome: string;
    estado_uf: string;
  };
  tarifa?: {
    tarifa_id: number;
    tarifa_valor: number;
  };
}

export interface CreateLocalRequest {
  local_nome: string;
  local_cidade: string;
  local_endereco: string;
  local_numero: string;
  estado_id: number;
  tarifa_id: number;
}

export interface UpdateLocalRequest {
  local_nome?: string;
  local_cidade?: string;
  local_endereco?: string;
  local_numero?: string;
  estado_id?: number;
  tarifa_id?: number;
}

class LocalService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    console.log("Token disponível:", token ? `${token.substring(0, 20)}...` : "NENHUM TOKEN");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getAll(): Promise<Local[]> {
    const response = await fetch(`${API_URL}/locais`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar locais: ${response.statusText}`);
    }

    return response.json();
  }

  async getById(id: number): Promise<Local> {
    const response = await fetch(`${API_URL}/locais/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar local: ${response.statusText}`);
    }

    return response.json();
  }

  async create(data: CreateLocalRequest): Promise<Local> {
    try {
      console.log("Criando local com dados:", data);
      console.log("API URL:", `${API_URL}/locais`);
      console.log("Headers:", this.getAuthHeaders());
      
      const response = await fetch(`${API_URL}/locais`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro da API:", errorText);
        
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || response.statusText;
        } catch {
          errorMessage = errorText || response.statusText;
        }
        
        throw new Error(`Erro ao criar local: ${errorMessage}`);
      }

      const result = await response.json();
      console.log("Local criado com sucesso:", result);
      return result;
    } catch (error) {
      console.error("Erro ao fazer requisição:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro desconhecido ao criar local");
    }
  }

  async update(id: number, data: UpdateLocalRequest): Promise<Local> {
    const response = await fetch(`${API_URL}/locais/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `Erro ao atualizar local: ${response.statusText}`
      );
    }

    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/locais/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar local: ${response.statusText}`);
    }
  }
}

export const localService = new LocalService();
