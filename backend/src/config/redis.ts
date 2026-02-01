import { Redis } from "ioredis";

const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = parseInt(process.env.REDIS_PORT || "6379");

// Criar conexão com Redis
export const redisConnection = new Redis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null,
});

// Testar conexão
redisConnection.on("connect", () => {
  console.log("Redis conectado com sucesso!");
});

redisConnection.on("error", (err) => {
  console.error("Erro ao conectar com Redis:", err);
});

export default redisConnection;
