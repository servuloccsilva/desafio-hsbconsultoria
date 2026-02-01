import { Request, Response } from "express";
import { QueueManager } from "../queues/queueManager";
import { EmpresaService } from "../services/empresaService";

export class QueueController {
  static async adicionarJob(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (typeof id !== "string") {
        res.status(400).json({
          success: false,
          error: 'Parâmetro "id" inválido.',
        });
        return;
      }
      const { tipo, dados } = req.body;

      // Validar tipo
      if (!tipo) {
        res.status(400).json({
          success: false,
          error: 'O campo "tipo" é obrigatório.',
        });
        return;
      }

      // Buscar empresa
      const empresa = await EmpresaService.buscarPorId(id);
      if (!empresa) {
        res.status(404).json({
          success: false,
          error: "Empresa não encontrada.",
        });
        return;
      }

      // Adicionar job
      const job = await QueueManager.adicionarJob(
        empresa.id!,
        empresa.razaoSocial,
        tipo,
        dados || {},
      );

      res.status(201).json({
        success: true,
        data: {
          jobId: job.id,
          jobName: job.name,
          empresaId: empresa.id,
          empresaNome: empresa.razaoSocial,
          tipo,
        },
        message: "Job adicionado na fila com sucesso!",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async listarJobs(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (typeof id !== "string") {
        res.status(400).json({
          success: false,
          error: 'Parâmetro "id" inválido.',
        });
        return;
      }
      const status = (req.query.status as any) || "waiting";

      // Validar status
      if (!["waiting", "active", "completed", "failed"].includes(status)) {
        res.status(400).json({
          success: false,
          error: "Status inválido. Use: waiting, active, completed ou failed.",
        });
        return;
      }

      // Buscar empresa
      const empresa = await EmpresaService.buscarPorId(id);
      if (!empresa) {
        res.status(404).json({
          success: false,
          error: "Empresa não encontrada.",
        });
        return;
      }

      // Listar jobs
      const jobs = await QueueManager.listarJobs(id, status);

      res.status(200).json({
        success: true,
        data: jobs,
        total: jobs.length,
        status,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async statusFila(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (typeof id !== "string") {
        res.status(400).json({
          success: false,
          error: 'Parâmetro "id" inválido.',
        });
        return;
      }

      // Buscar empresa
      const empresa = await EmpresaService.buscarPorId(id);
      if (!empresa) {
        res.status(404).json({
          success: false,
          error: "Empresa não encontrada.",
        });
        return;
      }

      // Obter status
      const status = await QueueManager.getQueueStatus(id);

      if (!status) {
        res.status(404).json({
          success: false,
          error: "Fila não encontrada. Crie um job primeiro.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          empresaId: id,
          empresaNome: empresa.razaoSocial,
          ...status,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
