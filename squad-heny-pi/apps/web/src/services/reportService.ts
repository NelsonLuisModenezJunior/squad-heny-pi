const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface ReportStats {
  monthlyConsumption: number;
  monthlyCost: number;
  avgEfficiency: number;
  monthlyCO2Emissions: number;
  consumptionByRoom: Record<string, number>;
  efficiencyDistribution: {
    "A+": number;
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
  };
  annualCO2Emissions: number;
}

export interface MonthlyHistory {
  mes: string;
  consumo: number;
  custo: number;
  co2: number;
  mes_numero?: number;
  ano?: number;
  is_mes_atual?: boolean;
}

class ReportService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getLocationStats(locationId: string): Promise<ReportStats> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_URL}/reports/consumption/${locationId}`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erro ao buscar estatísticas: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw error;
    }
  }

  async getMonthlyHistory(locationId: string): Promise<MonthlyHistory[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_URL}/locais/${locationId}/historico-mensal`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erro ao buscar histórico mensal: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar histórico mensal:", error);
      throw error;
    }
  }

  async consolidateHistory(locationId: string): Promise<{ message: string; meses_consolidados: number }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_URL}/locais/${locationId}/consolidar-historico`,
        {
          method: "POST",
          headers,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erro ao consolidar histórico: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao consolidar histórico:", error);
      throw error;
    }
  }
}

export const reportService = new ReportService();
