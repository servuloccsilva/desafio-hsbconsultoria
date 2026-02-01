import { Request, Response, Router } from "express";
import empresaRoutes from "./empresaRoutes";
import queueRoutes from "./queueRoutes";

const router = Router();

// Rota raiz da API
router.get("/", (req: Request, res: Response) => {
  if (req) {
    console.log(req);
  }
  res.json({
    message: "API Desafio Empresas",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      empresas: "/api/empresas",
      jobs: "/api/empresas/:id/jobs",
      queueStatus: "/api/empresas/:id/queue-status",
    },
  });
});

// Rotas de empresas
router.use("/empresas", empresaRoutes);

// Rotas de filas (usa o mesmo prefixo /empresas)
router.use("/empresas", queueRoutes);

export default router;
