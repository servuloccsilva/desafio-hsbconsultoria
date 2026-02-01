import React, { useState } from "react";
import { EmpresaService } from "../services/empresaService";
import { Empresa } from "../types/empresa.types";
import { formatarCNPJ, formatarData } from "../utils/formatters";
import "./CardEmpresa.css";

interface CardEmpresaProps {
  empresa: Empresa;
  onEmpresaDeletada: () => void;
  onAbrirDetalhes: (empresa: Empresa) => void;
}

export const CardEmpresa: React.FC<CardEmpresaProps> = ({
  empresa,
  onEmpresaDeletada,
  onAbrirDetalhes,
}) => {
  const [deletando, setDeletando] = useState(false);

  const handleDeletar = async () => {
    const confirmacao = window.confirm(
      `Tem certeza que deseja deletar a empresa "${empresa.razaoSocial}"?`,
    );

    if (!confirmacao) return;

    try {
      setDeletando(true);
      await EmpresaService.deletarEmpresa(empresa.id!);
      onEmpresaDeletada();
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao deletar empresa");
    } finally {
      setDeletando(false);
    }
  };

  return (
    <div className="card-empresa">
      <div className="card-header">
        <h3>{empresa.razaoSocial}</h3>
        <span className="badge">ID: {empresa.id?.substring(0, 8)}...</span>
      </div>

      <div className="card-body">
        <div className="card-info">
          <label>CNPJ:</label>
          <span>{formatarCNPJ(empresa.cnpj)}</span>
        </div>

        <div className="card-info">
          <label>Período:</label>
          <span>
            {formatarData(empresa.dataInicio)} até{" "}
            {formatarData(empresa.dataFim)}
          </span>
        </div>

        {empresa.createdAt && (
          <div className="card-info">
            <label>Cadastrado em:</label>
            <span>{formatarData(empresa.createdAt)}</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button
          className="btn btn-info"
          onClick={() => onAbrirDetalhes(empresa)}
        >
          Ver Detalhes / Fila
        </button>
        <button
          className="btn btn-danger"
          onClick={handleDeletar}
          disabled={deletando}
        >
          {deletando ? "Deletando..." : "Deletar"}
        </button>
      </div>
    </div>
  );
};
