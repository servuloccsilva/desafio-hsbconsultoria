export interface JobData {
  empresaId: string;
  empresaNome: string;
  tipo: string;
  dados: any;
  timestamp: string;
}

export interface QueueInfo {
  empresaId: string;
  empresaNome: string;
  queueName: string;
  jobsAtivos: number;
  jobsConcluidos: number;
  jobsFalhados: number;
}

export interface AddJobDTO {
  tipo: string;
  dados: any;
}

export interface JobResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}
