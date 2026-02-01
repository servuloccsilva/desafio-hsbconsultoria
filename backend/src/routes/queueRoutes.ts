import { Router } from "express";
import { QueueController } from "../controllers/queueController";

const router = Router();

/**
 * @route   POST /empresas/:id/jobs
 * @desc    Adicionar job na fila da empresa
 * @access  Public
 */
router.post("/:id/jobs", QueueController.adicionarJob);

/**
 * @route   GET /empresas/:id/jobs
 * @desc    Listar jobs da fila da empresa
 * @query   status (waiting|active|completed|failed)
 * @access  Public
 */
router.get("/:id/jobs", QueueController.listarJobs);

/**
 * @route   GET /empresas/:id/queue-status
 * @desc    Obter status da fila da empresa
 * @access  Public
 */
router.get("/:id/queue-status", QueueController.statusFila);

export default router;
