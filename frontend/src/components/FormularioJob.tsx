import React, { useState } from "react";
import { QueueService } from "../services/queueService";
import { AddJobDTO } from "../types/queue.types";
import "./FormularioJob.css";

interface FormularioJobProps {
  empresaId: string;
  empresaNome: string;
  onJobAdicionado: () => void;
}

export const FormularioJob: React.FC<FormularioJobProps> = ({
  empresaId,
  empresaNome,
  onJobAdicionado,
}) => {
  const [tipo, setTipo] = useState("enviar-email");
  const [dados, setDados] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const tiposDisponiveis = [
    { value: "enviar-email", label: "📧 Enviar Email" },
    { value: "gerar-relatorio", label: "📊 Gerar Relatório" },
    { value: "sincronizar-dados", label: "🔄 Sincronizar Dados" },
    { value: "processar-pagamento", label: "💳 Processar Pagamento" },
    { value: "backup", label: "💾 Fazer Backup" },
    { value: "outro", label: "⚙️ Outro" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    try {
      setLoading(true);

      const jobData: AddJobDTO = {
        tipo,
        dados: dados ? JSON.parse(dados) : {},
      };

      await QueueService.adicionarJob(empresaId, jobData);

      setSucesso("Job adicionado na fila com sucesso!");
      setDados("");

      onJobAdicionado();

      setTimeout(() => setSucesso(null), 3000);
    } catch (error: any) {
      if (error.message.includes("JSON")) {
        setErro("Dados inválidos. Use formato JSON válido.");
      } else {
        setErro(
          error.response?.data?.error ||
            error.message ||
            "Erro ao adicionar job",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-job-container">
      <h3>Adicionar Job na Fila</h3>
      <p className="empresa-info">
        Empresa: <strong>{empresaNome}</strong>
      </p>

      <form onSubmit={handleSubmit} className="formulario-job">
        <div className="form-group">
          <label htmlFor="tipo">Tipo de Job *</label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            disabled={loading}
            required
          >
            {tiposDisponiveis.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dados">Dados (JSON) - Opcional</label>
          <textarea
            id="dados"
            value={dados}
            onChange={(e) => setDados(e.target.value)}
            placeholder='{"destinatario": "contato@empresa.com", "assunto": "Teste"}'
            rows={4}
            disabled={loading}
          />
          <small>Deixe vazio para usar dados padrão</small>
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}
        {sucesso && <div className="alert alert-success">{sucesso}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adicionando..." : "➕ Adicionar Job"}
        </button>
      </form>
    </div>
  );
};
