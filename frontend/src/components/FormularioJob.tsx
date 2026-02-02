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
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Campos específicos por tipo
  const [destinatario, setDestinatario] = useState("");
  const [assunto, setAssunto] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");

  const tiposDisponiveis = [
    { value: "enviar-email", label: "📧 Enviar Email" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    try {
      setLoading(true);

      // Monta dados conforme o tipo
      let dadosJob: any = {};

      switch (tipo) {
        case "enviar-email":
          if (!destinatario || !assunto) {
            setErro(
              "Destinatário e Assunto são obrigatórios para envio de email",
            );
            setLoading(false);
            return;
          }
          dadosJob = {
            destinatario,
            assunto,
          };
          break;

        case "gerar-relatorio":
          if (!periodo) {
            setErro("Período é obrigatório para gerar relatório");
            setLoading(false);
            return;
          }
          dadosJob = {
            periodo,
            formato: "PDF",
          };
          break;

        case "sincronizar-dados":
          dadosJob = {
            fonte: "sistema-externo",
            timestamp: new Date().toISOString(),
          };
          break;

        case "processar-pagamento":
          if (!valor) {
            setErro("Valor é obrigatório para processar pagamento");
            setLoading(false);
            return;
          }
          dadosJob = {
            valor: parseFloat(valor),
            moeda: "BRL",
          };
          break;

        case "backup":
          dadosJob = {
            tipo_backup: "completo",
            timestamp: new Date().toISOString(),
          };
          break;

        case "outro":
          if (!descricao) {
            setErro("Descrição é obrigatória");
            setLoading(false);
            return;
          }
          dadosJob = {
            descricao,
          };
          break;
      }

      const jobData: AddJobDTO = {
        tipo,
        dados: dadosJob,
      };

      await QueueService.adicionarJob(empresaId, jobData);

      setSucesso("Job adicionado na fila com sucesso!");

      // Limpar campos
      setDestinatario("");
      setAssunto("");
      setPeriodo("");
      setValor("");
      setDescricao("");

      onJobAdicionado();

      setTimeout(() => setSucesso(null), 3000);
    } catch (error: any) {
      setErro(
        error.response?.data?.error || error.message || "Erro ao adicionar job",
      );
    } finally {
      setLoading(false);
    }
  };

  // Renderizar campos específicos por tipo
  const renderCamposEspecificos = () => {
    switch (tipo) {
      case "enviar-email":
        return (
          <>
            <div className="form-group">
              <label htmlFor="destinatario">Destinatário *</label>
              <input
                type="email"
                id="destinatario"
                value={destinatario}
                onChange={(e) => setDestinatario(e.target.value)}
                placeholder="contato@empresa.com"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="assunto">Assunto *</label>
              <input
                type="text"
                id="assunto"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                placeholder="Assunto do email"
                disabled={loading}
                required
              />
            </div>
          </>
        );

      case "gerar-relatorio":
        return (
          <div className="form-group">
            <label htmlFor="periodo">Período *</label>
            <select
              id="periodo"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Selecione o período</option>
              <option value="mensal">Mensal</option>
              <option value="trimestral">Trimestral</option>
              <option value="semestral">Semestral</option>
              <option value="anual">Anual</option>
            </select>
          </div>
        );

      case "processar-pagamento":
        return (
          <div className="form-group">
            <label htmlFor="valor">Valor (R$) *</label>
            <input
              type="number"
              id="valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              disabled={loading}
              required
            />
          </div>
        );

      case "outro":
        return (
          <div className="form-group">
            <label htmlFor="descricao">Descrição *</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o que o job deve fazer..."
              rows={3}
              disabled={loading}
              required
            />
          </div>
        );

      case "sincronizar-dados":
      case "backup":
        return (
          <div className="info-message">
            Este tipo de job não requer dados adicionais
          </div>
        );

      default:
        return null;
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
            onChange={(e) => {
              setTipo(e.target.value);
              // Limpar campos ao trocar tipo
              setDestinatario("");
              setAssunto("");
              setPeriodo("");
              setValor("");
              setDescricao("");
            }}
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

        {renderCamposEspecificos()}

        {erro && <div className="alert alert-error">{erro}</div>}
        {sucesso && <div className="alert alert-success">{sucesso}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adicionando..." : "➕ Adicionar Job"}
        </button>
      </form>
    </div>
  );
};
