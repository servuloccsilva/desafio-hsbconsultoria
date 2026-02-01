import { Router } from "express";
import { EmpresaController } from "../controllers/empresaController";

const router = Router();

/**
 * @route   POST /empresas
 * @desc    Criar nova empresa
 * @access  Public
 */
router.post("/", EmpresaController.criar);

/**
 * @route   GET /empresas
 * @desc    Listar todas as empresas
 * @access  Public
 */
router.get("/", EmpresaController.listar);

/**
 * @route   GET /empresas/:id
 * @desc    Buscar empresa por ID
 * @access  Public
 */
router.get("/:id", EmpresaController.buscarPorId);

/**
 * @route   PUT /empresas/:id
 * @desc    Atualizar empresa
 * @access  Public
 */
router.put("/:id", EmpresaController.atualizar);

/**
 * @route   DELETE /empresas/:id
 * @desc    Deletar empresa
 * @access  Public
 */
router.delete("/:id", EmpresaController.deletar);

export default router;
