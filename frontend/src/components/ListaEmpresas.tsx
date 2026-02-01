import React, { useEffect, useState } from "react";
import { EmpresaService } from "../services/empresaService";
import { Empresa } from "../types/empresa.types";
import { CardEmpresa } from "./CardEmpresa";
import "./ListaEmpresas.css";

interface ListaEmpresasProps {
  atualizar: number;
  onAbrirDetalhes: (empresa: Empresa) => void;
}

export const ListaEmpresas: React.FC<ListaEmpresasProps> = ({
  atualizar,
  onAbrirDetalhes,
}) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarEmpresas = async () => {
    try {
      setLoading(true);
      setErro(null);
      const dados = await EmpresaService.listarEmpresas();
      setEmpresas(dados);
    } catch (error: any) {
      setErro(
        error.response?.data?.error ||
          error.message ||
          "Erro ao carregar empresas",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEmpresas();
  }, [atualizar]);

  if (loading) {
    return (
      <div className="lista-container">
        <div className="loading">Carregando empresas...</div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="lista-container">
        <div className="alert alert-error">{erro}</div>
        <button className="btn btn-primary" onClick={carregarEmpresas}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (empresas.length === 0) {
    return (
      <div className="lista-container">
        <div className="empty-state">
          <p>📋 Nenhuma empresa cadastrada ainda.</p>
          <p>Use o formulário acima para cadastrar a primeira empresa!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-container">
      <div className="lista-header">
        <h2>Empresas Cadastradas</h2>
        <span className="contador">{empresas.length} empresa(s)</span>
      </div>

      <div className="lista-grid">
        {empresas.map((empresa) => (
          <CardEmpresa
            key={empresa.id}
            empresa={empresa}
            onEmpresaDeletada={carregarEmpresas}
            onAbrirDetalhes={onAbrirDetalhes}
          />
        ))}
      </div>
    </div>
  );
};
