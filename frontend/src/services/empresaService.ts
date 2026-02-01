import { ApiResponse, CreateEmpresaDTO, Empresa } from "../types/empresa.types";
import api from "./api";

export class EmpresaService {
  static async criarEmpresa(data: CreateEmpresaDTO): Promise<Empresa> {
    const response = await api.post<ApiResponse<Empresa>>("/empresas", data);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Erro ao criar empresa");
    }

    return response.data.data;
  }

  static async listarEmpresas(): Promise<Empresa[]> {
    const response = await api.get<ApiResponse<Empresa[]>>("/empresas");

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Erro ao listar empresas");
    }

    return response.data.data;
  }

  static async buscarEmpresa(id: string): Promise<Empresa> {
    const response = await api.get<ApiResponse<Empresa>>(`/empresas/${id}`);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Erro ao buscar empresa");
    }

    return response.data.data;
  }

  static async atualizarEmpresa(
    id: string,
    data: Partial<CreateEmpresaDTO>,
  ): Promise<Empresa> {
    const response = await api.put<ApiResponse<Empresa>>(
      `/empresas/${id}`,
      data,
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Erro ao atualizar empresa");
    }

    return response.data.data;
  }

  static async deletarEmpresa(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/empresas/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.error || "Erro ao deletar empresa");
    }
  }
}
