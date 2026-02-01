import { AddJobDTO, ApiResponse, Job, QueueStatus } from "../types/queue.types";
import api from "./api";

export class QueueService {
  static async adicionarJob(empresaId: string, data: AddJobDTO): Promise<any> {
    const response = await api.post<ApiResponse<any>>(
      `/empresas/${empresaId}/jobs`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "Erro ao adicionar job");
    }

    return response.data.data;
  }

  static async listarJobs(
    empresaId: string,
    status: "waiting" | "active" | "completed" | "failed" = "waiting",
  ): Promise<Job[]> {
    const response = await api.get<ApiResponse<Job[]>>(
      `/empresas/${empresaId}/jobs?status=${status}`,
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Erro ao listar jobs");
    }

    return response.data.data;
  }

  static async obterStatus(empresaId: string): Promise<QueueStatus> {
    const response = await api.get<ApiResponse<QueueStatus>>(
      `/empresas/${empresaId}/queue-status`,
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Erro ao obter status da fila");
    }

    return response.data.data;
  }
}
