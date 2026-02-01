import { db, EMPRESAS_COLLECTION } from "../config/firebase";
import {
  CreateEmpresaDTO,
  Empresa,
  UpdateEmpresaDTO,
} from "../types/empresa.types";
import { Formatters } from "../utils/formatters";
import { Validators } from "../utils/validators";

export class EmpresaService {
  static async criarEmpresa(data: CreateEmpresaDTO): Promise<Empresa> {
    // Validações
    if (!Validators.validarRazaoSocial(data.razaoSocial)) {
      throw new Error(
        "Razão social inválida. Deve ter no mínimo 3 caracteres.",
      );
    }

    const cnpjLimpo = Formatters.limparCNPJ(data.cnpj);
    if (!Validators.validarCNPJ(cnpjLimpo)) {
      throw new Error("CNPJ inválido.");
    }

    if (!Validators.validarDataISO(data.dataInicio)) {
      throw new Error("Data de início inválida. Use formato ISO 8601.");
    }

    if (!Validators.validarDataISO(data.dataFim)) {
      throw new Error("Data de fim inválida. Use formato ISO 8601.");
    }

    if (!Validators.validarPeriodo(data.dataInicio, data.dataFim)) {
      throw new Error("Data de fim deve ser posterior à data de início.");
    }

    // Verificar se CNPJ já existe
    const empresaExistente = await this.buscarPorCNPJ(cnpjLimpo);
    if (empresaExistente) {
      throw new Error("Já existe uma empresa cadastrada com este CNPJ.");
    }

    // Criar empresa
    const empresa: Omit<Empresa, "id"> = {
      razaoSocial: data.razaoSocial.trim(),
      cnpj: cnpjLimpo,
      dataInicio: data.dataInicio,
      dataFim: data.dataFim,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Salvar no Firestore
    const docRef = await db.collection(EMPRESAS_COLLECTION).add(empresa);

    return {
      id: docRef.id,
      ...empresa,
    };
  }

  static async listarEmpresas(): Promise<Empresa[]> {
    const snapshot = await db.collection(EMPRESAS_COLLECTION).get();

    const empresas: Empresa[] = [];
    snapshot.forEach((doc) => {
      empresas.push({
        id: doc.id,
        ...doc.data(),
      } as Empresa);
    });

    return empresas;
  }

  static async buscarPorId(id: string): Promise<Empresa | null> {
    const doc = await db.collection(EMPRESAS_COLLECTION).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Empresa;
  }

  static async buscarPorCNPJ(cnpj: string): Promise<Empresa | null> {
    const cnpjLimpo = Formatters.limparCNPJ(cnpj);

    const snapshot = await db
      .collection(EMPRESAS_COLLECTION)
      .where("cnpj", "==", cnpjLimpo)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    if (!doc) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Empresa;
  }

  static async atualizarEmpresa(
    id: string,
    data: UpdateEmpresaDTO,
  ): Promise<Empresa> {
    // Verificar se empresa existe
    const empresaExistente = await this.buscarPorId(id);
    if (!empresaExistente) {
      throw new Error("Empresa não encontrada.");
    }

    // Validações
    if (data.razaoSocial && !Validators.validarRazaoSocial(data.razaoSocial)) {
      throw new Error(
        "Razão social inválida. Deve ter no mínimo 3 caracteres.",
      );
    }

    if (data.cnpj) {
      const cnpjLimpo = Formatters.limparCNPJ(data.cnpj);
      if (!Validators.validarCNPJ(cnpjLimpo)) {
        throw new Error("CNPJ inválido.");
      }

      // Verificar se CNPJ já existe em outra empresa
      const outraEmpresa = await this.buscarPorCNPJ(cnpjLimpo);
      if (outraEmpresa && outraEmpresa.id !== id) {
        throw new Error("Já existe outra empresa cadastrada com este CNPJ.");
      }

      data.cnpj = cnpjLimpo;
    }

    if (data.dataInicio && !Validators.validarDataISO(data.dataInicio)) {
      throw new Error("Data de início inválida. Use formato ISO 8601.");
    }

    if (data.dataFim && !Validators.validarDataISO(data.dataFim)) {
      throw new Error("Data de fim inválida. Use formato ISO 8601.");
    }

    // Validar período
    const dataInicio = data.dataInicio || empresaExistente.dataInicio;
    const dataFim = data.dataFim || empresaExistente.dataFim;

    if (!Validators.validarPeriodo(dataInicio, dataFim)) {
      throw new Error("Data de fim deve ser posterior à data de início.");
    }

    // Atualizar
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await db.collection(EMPRESAS_COLLECTION).doc(id).update(updateData);

    // Retornar empresa atualizada
    return this.buscarPorId(id) as Promise<Empresa>;
  }

  static async deletarEmpresa(id: string): Promise<void> {
    const empresa = await this.buscarPorId(id);
    if (!empresa) {
      throw new Error("Empresa não encontrada.");
    }

    await db.collection(EMPRESAS_COLLECTION).doc(id).delete();
  }
}
