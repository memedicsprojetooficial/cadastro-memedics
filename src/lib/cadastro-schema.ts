import { z } from 'zod';
import { isValidCpfOrCnpj, onlyDigits } from '@/lib/document';

// Rede e/ou ClavaConsult pedem o nome; os demais dados só são pedidos quando há ClavaConsult.
export const showNomeCompleto = (tipoLogin: string[]) =>
  tipoLogin.includes('rede') || tipoLogin.includes('clavaconsult');

export const showCamposCompletos = (tipoLogin: string[]) =>
  tipoLogin.includes('clavaconsult');

export const cadastroSchema = z
  .object({
    localidade: z.string().min(1, 'Selecione a localidade'),
    tipoLogin: z.array(z.string()).min(1, 'Selecione ao menos um tipo de login'),
    nomeCompleto: z.string().trim(),
    email: z.string().trim(),
    document: z.string(),
    numeroConselho: z.string().trim(),
    tipoConselho: z.string(),
    especialidade: z.string(),
  })
  .superRefine((data, ctx) => {
    const requireField = (path: keyof typeof data, message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });

    if (showNomeCompleto(data.tipoLogin) && data.nomeCompleto.length < 3) {
      requireField('nomeCompleto', 'Informe o nome completo');
    }

    if (!showCamposCompletos(data.tipoLogin)) return;

    if (!z.string().email().safeParse(data.email).success) {
      requireField('email', 'Informe um e-mail válido');
    }
    if (!isValidCpfOrCnpj(data.document)) {
      requireField('document', 'Informe um CPF ou CNPJ válido');
    }
    if (!data.numeroConselho) {
      requireField('numeroConselho', 'Informe o número do conselho');
    }
    if (!data.tipoConselho) {
      requireField('tipoConselho', 'Selecione o tipo do conselho');
    }
    if (!data.especialidade) {
      requireField('especialidade', 'Selecione a especialidade');
    }
  });

export type CadastroFormValues = z.infer<typeof cadastroSchema>;

export const cadastroDefaultValues: CadastroFormValues = {
  localidade: '',
  tipoLogin: [],
  nomeCompleto: '',
  email: '',
  document: '',
  numeroConselho: '',
  tipoConselho: '',
  especialidade: '',
};

// Mantém o mesmo formato de payload para o webhook, mas zera os campos que não estão visíveis
// para não enviar valores preenchidos antes de o usuário trocar o tipo de login.
export const buildCadastroPayload = (values: CadastroFormValues): CadastroFormValues => {
  const completos = showCamposCompletos(values.tipoLogin);

  return {
    localidade: values.localidade,
    tipoLogin: values.tipoLogin,
    nomeCompleto: showNomeCompleto(values.tipoLogin) ? values.nomeCompleto : '',
    email: completos ? values.email : '',
    document: completos ? onlyDigits(values.document) : '',
    numeroConselho: completos ? values.numeroConselho : '',
    tipoConselho: completos ? values.tipoConselho : '',
    especialidade: completos ? values.especialidade : '',
  };
};
