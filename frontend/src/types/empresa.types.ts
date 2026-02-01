export interface Empresa {
  id?: string;
  razaoSocial: string;
  cnpj: string;
  dataInicio: string;
  dataFim: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmpresaDTO {
  razaoSocial: string;
  cnpj: string;
  dataInicio: string;
  dataFim: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
}
