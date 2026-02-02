import { Job, Queue, Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { JobData } from "../types/queue.types";
import { Formatters } from "../utils/formatters";

// Armazenar as filas criadas
const queues = new Map<string, Queue>();
const workers = new Map<string, Worker>();

export class QueueManager {
  static getQueue(empresaId: string, empresaNome: string): Queue {
    const queueName = Formatters.gerarNomeFila(empresaId);

    // Se a fila já existe, retornar
    if (queues.has(queueName)) {
      return queues.get(queueName)!;
    }

    // Criar nova fila
    const queue = new Queue(queueName, {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3, // Tentar 3 vezes em caso de falha
        backoff: {
          type: "exponential",
          delay: 2000, // 2 segundos
        },
        removeOnComplete: {
          count: 100, // Manter últimos 100 jobs completos
        },
        removeOnFail: {
          count: 50, // Manter últimos 50 jobs falhados
        },
      },
    });

    // Armazenar a fila
    queues.set(queueName, queue);

    // Criar worker para processar jobs desta fila
    this.createWorker(queueName, empresaNome);

    console.log(`Fila criada para empresa: ${empresaNome} (${queueName})`);

    return queue;
  }

  /**
   * Criar worker para processar jobs de uma fila
   */
  private static createWorker(queueName: string, empresaNome: string): void {
    // Se o worker já existe, não criar novamente
    if (workers.has(queueName)) {
      return;
    }

    const worker = new Worker(
      queueName,
      async (job: Job<JobData>) => {
        console.log(`Processando job ${job.id} da empresa ${empresaNome}`);
        console.log("Dados do job:", job.data);

        // Simular processamento (aqui você faria o processamento real)
        await this.processarJob(job);

        console.log(`Job ${job.id} processado com sucesso!`);

        return { success: true, processedAt: new Date().toISOString() };
      },
      {
        connection: redisConnection,
        concurrency: 5, // Processar até 5 jobs simultaneamente
      },
    );

    // Eventos do worker
    worker.on("completed", (job) => {
      console.log(`Job ${job.id} completado!`);
    });

    worker.on("failed", (job, err) => {
      console.error(`Job ${job?.id} falhou:`, err.message);
    });

    // Armazenar o worker
    workers.set(queueName, worker);

    console.log(`Worker criado para fila: ${queueName}`);
  }

  private static async processarJob(job: Job<JobData>): Promise<void> {
    const { tipo, dados } = job.data;

    if (dados) {
      console.log(`Processando dados do job:`, dados);
    }

    // Aqui você implementaria a lógica específica de cada tipo de job
    switch (tipo) {
      case "enviar-email":
        console.log(`Enviando email para empresa ${job.data.empresaNome}`);
        // Lógica de envio de email
        await this.simularProcessamento(2000);
        break;

      case "gerar-relatorio":
        console.log(`Gerando relatório para empresa ${job.data.empresaNome}`);
        // Lógica de geração de relatório
        await this.simularProcessamento(3000);
        break;

      case "sincronizar-dados":
        console.log(`Sincronizando dados da empresa ${job.data.empresaNome}`);
        // Lógica de sincronização
        await this.simularProcessamento(2500);
        break;

      default:
        console.log(`Processando job tipo: ${tipo}`);
        await this.simularProcessamento(1000);
    }
  }

  private static simularProcessamento(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async adicionarJob(
    empresaId: string,
    empresaNome: string,
    tipo: string,
    dados: any,
  ): Promise<Job<JobData>> {
    const queue = this.getQueue(empresaId, empresaNome);

    const jobData: JobData = {
      empresaId,
      empresaNome,
      tipo,
      dados,
      timestamp: new Date().toISOString(),
    };

    const job = await queue.add(`${tipo}-${Date.now()}`, jobData);

    console.log(`Job adicionado na fila da empresa ${empresaNome}: ${job.id}`);

    return job;
  }

  static async getQueueStatus(empresaId: string, empresaNome?: string) {
    const queueName = Formatters.gerarNomeFila(empresaId);

    // ✅ SE NÃO EXISTE, CRIA AGORA
    let queue = queues.get(queueName);

    if (!queue) {
      // Tenta recriar a fila
      console.log(`⚠️ Fila ${queueName} não encontrada no Map, recriando...`);

      // Se temos o nome, cria a fila
      if (empresaNome) {
        queue = this.getQueue(empresaId, empresaNome);
      } else {
        // Se não temos o nome, cria mesmo assim (worker será criado depois)
        queue = new Queue(queueName, {
          connection: redisConnection,
        });
        queues.set(queueName, queue);
      }
    }

    const [waiting, active, completed, failed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
    ]);

    return {
      queueName,
      waiting,
      active,
      completed,
      failed,
    };
  }

  static async listarJobs(
    empresaId: string,
    status: "waiting" | "active" | "completed" | "failed" = "waiting",
  ) {
    const queueName = Formatters.gerarNomeFila(empresaId);
    const queue = queues.get(queueName);

    if (!queue) {
      return [];
    }

    let jobs;
    switch (status) {
      case "waiting":
        jobs = await queue.getWaiting();
        break;
      case "active":
        jobs = await queue.getActive();
        break;
      case "completed":
        jobs = await queue.getCompleted();
        break;
      case "failed":
        jobs = await queue.getFailed();
        break;
      default:
        jobs = await queue.getWaiting();
    }

    return jobs.map((job) => ({
      id: job.id,
      name: job.name,
      data: job.data,
      progress: job.progress,
      attemptsMade: job.attemptsMade,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      failedReason: job.failedReason,
    }));
  }

  static async closeAll(): Promise<void> {
    console.log("Fechando todas as filas e workers...");

    // Fechar workers
    for (const [name, worker] of workers.entries()) {
      await worker.close();
      console.log(`Worker ${name} fechado`);
    }

    // Fechar filas
    for (const [name, queue] of queues.entries()) {
      await queue.close();
      console.log(`Fila ${name} fechada`);
    }

    workers.clear();
    queues.clear();

    console.log("Todas as filas e workers foram fechados");
  }
}
