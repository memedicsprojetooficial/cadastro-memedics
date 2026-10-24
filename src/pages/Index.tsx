
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import MultiSelect from '@/components/MultiSelect';
import LocalidadeOptions from "@/data/LocalidadeOptions.tsx";
import TipoLoginOptions from "@/data/TipoLoginOptions.tsx";
import EspecialidadeOptions from "@/data/EspecialidadeOptions.tsx";
import TipoConselhoOptions from "@/data/TipoConselhoOptions.tsx";
import { formatCpfOrCnpj } from '@/lib/document';
import {
  buildCadastroPayload,
  cadastroDefaultValues,
  cadastroSchema,
  CadastroFormValues,
  showCamposCompletos,
  showNomeCompleto,
} from '@/lib/cadastro-schema';

const labelClassName = "text-sm font-medium text-gray-700";

const Index = () => {
  const form = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: cadastroDefaultValues,
  });

  const tipoLogin = form.watch('tipoLogin');
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: CadastroFormValues) => {
    try {
      const response = await fetch(import.meta.env.VITE_N8N_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildCadastroPayload(values))
      });

      // O corpo da resposta do webhook não é usado; não depende dele ser JSON para considerar sucesso.
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      toast({
        title: "Sucesso!",
        description: "Formulário enviado com sucesso.",
      });

      form.reset(cadastroDefaultValues);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error instanceof Error ? error.message : error);
      toast({
        title: "Erro!",
        description: "Falha ao enviar o formulário. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/lovable-uploads/25ea1f7e-cc95-4a16-8d57-081933b730a9.png"
                alt="ME.MEDICS - Consultórios Compartilhados"
                className="h-24 w-auto"
              />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Solicitação de Cadastro
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Preencha os dados para solicitar a criação da conta
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
                {/* Localidade */}
                <FormField
                  control={form.control}
                  name="localidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>Localidade *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a localidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LocalidadeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tipo de Login */}
                <FormField
                  control={form.control}
                  name="tipoLogin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>Tipo de Login *</FormLabel>
                      <MultiSelect
                        options={TipoLoginOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecione os tipos de login"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campos condicionais */}
                {showNomeCompleto(tipoLogin) && (
                  <div className="space-y-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Dados Pessoais
                    </h3>

                    {/* Nome Completo */}
                    <FormField
                      control={form.control}
                      name="nomeCompleto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClassName}>Nome Completo *</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Digite o nome completo" className="w-full" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Campos adicionais para ClavaConsult */}
                    {showCamposCompletos(tipoLogin) && (
                      <>
                        {/* E-mail */}
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClassName}>E-mail *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Digite o e-mail" className="w-full" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* CPF ou CNPJ */}
                        <FormField
                          control={form.control}
                          name="document"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClassName}>CPF ou CNPJ *</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="Digite o CPF ou CNPJ"
                                  className="w-full"
                                  {...field}
                                  onChange={(e) => field.onChange(formatCpfOrCnpj(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Número do Conselho */}
                        <FormField
                          control={form.control}
                          name="numeroConselho"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClassName}>Número do Conselho *</FormLabel>
                              <FormControl>
                                <Input type="text" placeholder="Digite o número do conselho" className="w-full" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Tipo do Conselho */}
                        <FormField
                          control={form.control}
                          name="tipoConselho"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClassName}>Tipo do Conselho *</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o conselho" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {TipoConselhoOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Especialidade */}
                        <FormField
                          control={form.control}
                          name="especialidade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClassName}>Especialidade *</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione sua especialidade" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {EspecialidadeOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                )}

                {/* Botão de envio */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Formulário"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
