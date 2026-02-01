import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormularioJob } from "../components/FormularioJob";
import { StatusFila } from "../components/StatusFila";
import { EmpresaService } from "../services/empresaService";
import { Empresa } from "../types/empresa.types";
import { formatarCNPJ, formatarData } from "../utils/formatters";
import "./DetalheEmpresa.css";

export const DetalheEmpresa: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizarStatus, setAtualizarStatus] = useState(0);

  const carregarEmpresa = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setErro(null);
      const dados = await EmpresaService.buscarEmpresa(id);
      setEmpresa(dados);
    } catch (error: any) {
      setErro(
        error.response?.data?.error ||
          error.message ||
          "Erro ao carregar empresa",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEmpresa();
  }, [id]);

  const handleJobAdicionado = () => {
    setAtualizarStatus((prev) => prev + 1);
  };

  const handleVoltar = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="detalhe-container">
        <div className="loading">Carregando detalhes...</div>
      </div>
    );
  }

  if (erro || !empresa) {
    return (
      <div className="detalhe-container">
        <div className="alert alert-error">
          {erro || "Empresa não encontrada"}
        </div>
        <button className="btn btn-primary" onClick={handleVoltar}>
          Voltar para Home
        </button>
      </div>
    );
  }

  return (
    <div className="detalhe-container">
      <header className="detalhe-header">
        <button className="btn-voltar" onClick={handleVoltar}>
          ← Voltar
        </button>
        <h1>Detalhes da Empresa</h1>
      </header>

      <div className="detalhe-content">
        <section className="empresa-info-card">
          <h2>{empresa.razaoSocial}</h2>

          <div className="info-grid">
            <div className="info-item">
              <label>CNPJ:</label>
              <span>{formatarCNPJ(empresa.cnpj)}</span>
            </div>

            <div className="info-item">
              <label>ID:</label>
              <span>{empresa.id}</span>
            </div>

            <div className="info-item">
              <label>Data de Início:</label>
              <span>{formatarData(empresa.dataInicio)}</span>
            </div>

            <div className="info-item">
              <label>Data de Fim:</label>
              <span>{formatarData(empresa.dataFim)}</span>
            </div>

            {empresa.createdAt && (
              <div className="info-item">
                <label>Cadastrado em:</label>
                <span>{formatarData(empresa.createdAt)}</span>
              </div>
            )}

            {empresa.updatedAt && (
              <div className="info-item">
                <label>Última atualização:</label>
                <span>{formatarData(empresa.updatedAt)}</span>
              </div>
            )}
          </div>
        </section>

        <section className="fila-section">
          <StatusFila empresaId={empresa.id!} atualizar={atualizarStatus} />
        </section>

        <section className="job-section">
          <FormularioJob
            empresaId={empresa.id!}
            empresaNome={empresa.razaoSocial}
            onJobAdicionado={handleJobAdicionado}
          />
        </section>
      </div>
    </div>
  );
};
