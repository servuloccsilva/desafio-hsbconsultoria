export class Formatters {
  static formatarCNPJ(cnpj: string): string {
    cnpj = cnpj.replace(/[^\d]/g, "");
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    );
  }

  static limparCNPJ(cnpj: string): string {
    return cnpj.replace(/[^\d]/g, "");
  }

  static gerarNomeFila(empresaId: string): string {
    return `empresa-${empresaId}-queue`;
  }

  static formatarDataBR(data: string): string {
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, "0");
    const minuto = String(d.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  }
}
