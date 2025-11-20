const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface Tarifa {
  tarifa_id: number;
  tarifa_valor: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTarifaRequest {
  tarifa_valor: number;
}

class TarifaService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    console.log("Tarifa - Token disponível:", token ? `${token.substring(0, 20)}...` : "NENHUM TOKEN");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async create(tarifa_valor: number): Promise<Tarifa> {
    try {
      console.log("Criando tarifa com valor:", tarifa_valor);
      
      const response = await fetch(`${API_URL}/tarifas`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ tarifa_valor }),
      });

      console.log("Tarifa - Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Tarifa - Erro da API:", errorText);
        
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || response.statusText;
        } catch {
          errorMessage = errorText || response.statusText;
        }
        
        throw new Error(`Erro ao criar tarifa: ${errorMessage}`);
      }

      const result = await response.json();
      console.log("Tarifa criada com sucesso:", result);
      return result;
    } catch (error) {
      console.error("Tarifa - Erro ao fazer requisição:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro desconhecido ao criar tarifa");
    }
  }

  async getAll(): Promise<Tarifa[]> {
    const response = await fetch(`${API_URL}/tarifas`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar tarifas: ${response.statusText}`);
    }

    return response.json();
  }
}

export const tarifaService = new TarifaService();
