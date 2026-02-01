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

export interface UpdateEmpresaDTO {
  razaoSocial?: string;
  cnpj?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface EmpresaResponse {
  success: boolean;
  data?: Empresa | Empresa[];
  message?: string;
  error?: string;
}
