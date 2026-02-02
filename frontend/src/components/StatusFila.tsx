import React, { useEffect, useState } from "react";
import { QueueService } from "../services/queueService";
import { QueueStatus } from "../types/queue.types";
import "./StatusFila.css";

interface StatusFilaProps {
  empresaId: string;
  atualizar: number;
}

export const StatusFila: React.FC<StatusFilaProps> = ({
  empresaId,
  atualizar,
}) => {
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarStatus = async () => {
    try {
      setLoading(true);
      setErro(null);
      const dados = await QueueService.obterStatus(empresaId);
      setStatus(dados);
    } catch (error: any) {
      setErro(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarStatus();

    // ✅ Intervalo que ajusta baseado no status
    let interval: NodeJS.Timeout;

    // Se tem jobs aguardando ou processando, atualiza rápido
    if (status && (status.waiting > 0 || status.active > 0)) {
      interval = setInterval(() => {
        carregarStatus();
      }, 2000); // 2 segundos (rápido)
    } else {
      // Se não tem nada, atualiza devagar
      interval = setInterval(() => {
        carregarStatus();
      }, 10000); // 10 segundos (devagar)
    }

    return () => clearInterval(interval);
  }, [empresaId, atualizar, status?.waiting, status?.active]);

  if (loading && !status) {
    return <div className="status-loading">Carregando status...</div>;
  }

  if (erro) {
    return (
      <div className="status-erro">
        <p>⚠️ {erro}</p>
        <button className="btn btn-small" onClick={carregarStatus}>
          Recarregar
        </button>
      </div>
    );
  }

  if (!status) {
    return <div className="status-vazio">Fila ainda não criada</div>;
  }

  // Indicador de atividade
  const temAtividade = status.waiting > 0 || status.active > 0;

  return (
    <div className="status-fila-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>📊 Status da Fila</h3>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {temAtividade && (
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                backgroundColor: "#4caf50",
                borderRadius: "50%",
                animation: "pulse 1.5s infinite",
              }}
            />
          )}
          <small style={{ color: "#666" }}>
            {temAtividade ? "Atualizando a cada 2s" : "Atualizando a cada 10s"}
          </small>
        </div>
      </div>

      <div className="status-grid">
        <div className="status-item waiting">
          <span className="status-label">Aguardando</span>
          <span className="status-value">{status.waiting}</span>
        </div>

        <div className="status-item active">
          <span className="status-label">Em Processamento</span>
          <span className="status-value">{status.active}</span>
        </div>

        <div className="status-item completed">
          <span className="status-label">Concluídos</span>
          <span className="status-value">{status.completed}</span>
        </div>

        <div className="status-item failed">
          <span className="status-label">Falhados</span>
          <span className="status-value">{status.failed}</span>
        </div>
      </div>

      <div className="status-footer">
        <small>Nome da fila: {status.queueName}</small>
      </div>
    </div>
  );
};
