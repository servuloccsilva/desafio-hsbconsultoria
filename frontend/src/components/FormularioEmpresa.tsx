import React, { useState } from "react";
import { EmpresaService } from "../services/empresaService";
import { CreateEmpresaDTO } from "../types/empresa.types";
import { mascaraCNPJ } from "../utils/formatters";
import { validarCNPJ } from "../utils/validators";
import "./FormularioEmpresa.css";

interface FormularioEmpresaProps {
  onEmpresaCriada: () => void;
}

export const FormularioEmpresa: React.FC<FormularioEmpresaProps> = ({
  onEmpresaCriada,
}) => {
  const [formData, setFormData] = useState<CreateEmpresaDTO>({
    razaoSocial: "",
    cnpj: "",
    dataInicio: "",
    dataFim: "",
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Aplicar máscara de CNPJ
    if (name === "cnpj") {
      setFormData({ ...formData, [name]: mascaraCNPJ(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    // Validações
    if (!formData.razaoSocial.trim()) {
      setErro("Razão Social é obrigatória");
      return;
    }

    if (!validarCNPJ(formData.cnpj)) {
      setErro("CNPJ inválido");
      return;
    }

    if (!formData.dataInicio) {
      setErro("Data de Início é obrigatória");
      return;
    }

    if (!formData.dataFim) {
      setErro("Data de Fim é obrigatória");
      return;
    }

    const inicio = new Date(formData.dataInicio);
    const fim = new Date(formData.dataFim);

    if (fim <= inicio) {
      setErro("Data de Fim deve ser posterior à Data de Início");
      return;
    }

    try {
      setLoading(true);

      // Converter datas para ISO 8601
      const dados: CreateEmpresaDTO = {
        razaoSocial: formData.razaoSocial.trim(),
        cnpj: formData.cnpj,
        dataInicio: new Date(formData.dataInicio).toISOString(),
        dataFim: new Date(formData.dataFim).toISOString(),
      };

      await EmpresaService.criarEmpresa(dados);

      setSucesso("Empresa cadastrada com sucesso!");
      setFormData({
        razaoSocial: "",
        cnpj: "",
        dataInicio: "",
        dataFim: "",
      });

      // Chamar callback para atualizar lista
      onEmpresaCriada();

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSucesso(null), 3000);
    } catch (error: any) {
      setErro(
        error.response?.data?.error ||
          error.message ||
          "Erro ao cadastrar empresa",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <h2>Cadastrar Nova Empresa</h2>

      <form onSubmit={handleSubmit} className="formulario">
        <div className="form-group">
          <label htmlFor="razaoSocial">Razão Social *</label>
          <input
            type="text"
            id="razaoSocial"
            name="razaoSocial"
            value={formData.razaoSocial}
            onChange={handleChange}
            placeholder="Ex: Tech Solutions LTDA"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cnpj">CNPJ *</label>
          <input
            type="text"
            id="cnpj"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            placeholder="00.000.000/0000-00"
            maxLength={18}
            disabled={loading}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dataInicio">Data de Início *</label>
            <input
              type="date"
              id="dataInicio"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dataFim">Data de Fim *</label>
            <input
              type="date"
              id="dataFim"
              name="dataFim"
              value={formData.dataFim}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}
        {sucesso && <div className="alert alert-success">{sucesso}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar Empresa"}
        </button>
      </form>
    </div>
  );
};
