export interface Job {
  id: string;
  name: string;
  data: JobData;
  progress: number;
  attemptsMade: number;
  processedOn?: number;
  finishedOn?: number;
  failedReason?: string;
}

export interface JobData {
  empresaId: string;
  empresaNome: string;
  tipo: string;
  dados: any;
  timestamp: string;
}

export interface QueueStatus {
  empresaId: string;
  empresaNome: string;
  queueName: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

export interface AddJobDTO {
  tipo: string;
  dados?: any;
}
