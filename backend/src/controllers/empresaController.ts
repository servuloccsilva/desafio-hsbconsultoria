import { Request, Response } from "express";
import { QueueManager } from "../queues/queueManager";
import { EmpresaService } from "../services/empresaService";

export class EmpresaController {
  static async criar(req: Request, res: Response): Promise<void> {
    try {
      const empresa = await EmpresaService.criarEmpresa(req.body);

      // Criar fila para a empresa automaticamente
      QueueManager.getQueue(empresa.id!, empresa.razaoSocial);

      res.status(201).json({
        success: true,
        data: empresa,
        message: "Empresa criada com sucesso!",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async listar(req: Request, res: Response): Promise<void> {
    try {
      const empresas = await EmpresaService.listarEmpresas();

      res.status(200).json({
        success: true,
        data: empresas,
        total: empresas.length,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (typeof id !== "string") {
        res.status(400).json({
          success: false,
          error: "ID inválido.",
        });
        return;
      }
      const empresa = await EmpresaService.buscarPorId(id);

      if (!empresa) {
        res.status(404).json({
          success: false,
          error: "Empresa não encontrada.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: empresa,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (typeof id !== "string") {
        res.status(400).json({
          success: false,
          error: "ID inválido.",
        });
        return;
      }
      const empresa = await EmpresaService.atualizarEmpresa(id, req.body);

      res.status(200).json({
        success: true,
        data: empresa,
        message: "Empresa atualizada com sucesso!",
      });
    } catch (error: any) {
      const statusCode = error.message.includes("não encontrada") ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (typeof id !== "string") {
        res.status(400).json({
          success: false,
          error: "ID inválido.",
        });
        return;
      }
      await EmpresaService.deletarEmpresa(id);

      res.status(200).json({
        success: true,
        message: "Empresa deletada com sucesso!",
      });
    } catch (error: any) {
      const statusCode = error.message.includes("não encontrada") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message,
      });
    }
  }
}
