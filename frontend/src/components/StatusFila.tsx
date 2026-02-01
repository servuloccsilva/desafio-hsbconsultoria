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
  }, [empresaId, atualizar]);

  if (loading) {
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

  return (
    <div className="status-fila-container">
      <h3>📊 Status da Fila</h3>

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
