import dotenv from "dotenv";
import { configureExpress } from "./config/express";
import { QueueManager } from "./queues/queueManager";
import routes from "./routes";

// Carregar variáveis de ambiente
dotenv.config();

const PORT = process.env.PORT || 3001;

// Criar aplicação Express
const app = configureExpress();

// Registrar rotas
app.use("/api", routes);

// Rota 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Rota não encontrada",
  });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log("=================================");
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log("=================================");
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM recebido. Fechando servidor...");

  // Fechar todas as filas
  await QueueManager.closeAll();

  // Fechar servidor
  server.close(() => {
    console.log("Servidor fechado com sucesso.");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT recebido. Fechando servidor...");

  // Fechar todas as filas
  await QueueManager.closeAll();

  // Fechar servidor
  server.close(() => {
    console.log("Servidor fechado com sucesso.");
    process.exit(0);
  });
});

export default app;
