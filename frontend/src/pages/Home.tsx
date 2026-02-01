import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormularioEmpresa } from "../components/FormularioEmpresa";
import { ListaEmpresas } from "../components/ListaEmpresas";
import { Empresa } from "../types/empresa.types";
import "./Home.css";

export const Home: React.FC = () => {
  const [atualizar, setAtualizar] = useState(0);
  const navigate = useNavigate();

  const handleEmpresaCriada = () => {
    setAtualizar((prev) => prev + 1);
  };

  const handleAbrirDetalhes = (empresa: Empresa) => {
    navigate(`/empresa/${empresa.id}`);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>🏢 Sistema de Cadastro de Empresas</h1>
        <p>Gerencie empresas e processamento de filas</p>
      </header>

      <main className="home-main">
        <FormularioEmpresa onEmpresaCriada={handleEmpresaCriada} />
        <ListaEmpresas
          atualizar={atualizar}
          onAbrirDetalhes={handleAbrirDetalhes}
        />
      </main>
    </div>
  );
};
