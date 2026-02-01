import cors from "cors";
import express, { Application } from "express";

export function configureExpress(): Application {
  const app = express();

  // Middlewares
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rota de health check
  app.get("/health", (req, res) => {
    if (req) {
      console.log(req);
    }
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "Desafio Empresas API",
    });
  });

  return app;
}
