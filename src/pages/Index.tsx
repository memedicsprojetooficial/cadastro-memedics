
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import MultiSelect from '@/components/MultiSelect';
import LocalidadeOptions from "@/data/LocalidadeOptions.tsx";
import TipoLoginOptions from "@/data/TipoLoginOptions.tsx";
import EspecialidadeOptions from "@/data/EspecialidadeOptions.tsx";
import TipoConselhoOptions from "@/data/TipoConselhoOptions.tsx";

const Index = () => {
  const [formData, setFormData] = useState({
    localidade: '',
    tipoLogin: [] as string[],
    nomeCompleto: '',
    email: '',
    document: '',
    numeroConselho: '',
    tipoConselho: '',
    especialidade: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Enviando dados:', formData);
      
      const response = await fetch(import.meta.env.VITE_N8N_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Resposta do servidor:', result);
        
        toast({
          title: "Sucesso!",
          description: "Formulário enviado com sucesso.",
        });
        
        // Limpar o formulário após envio bem-sucedido
        setFormData({
          localidade: '',
          tipoLogin: [],
          nomeCompleto: '',
          email: '',
          document: '',
          numeroConselho: '',
          tipoConselho: '',
          especialidade: ''
        });
      } else {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      toast({
        title: "Erro!",
        description: "Falha ao enviar o formulário. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showNomeCompleto = formData.tipoLogin.includes('rede') || formData.tipoLogin.includes('clavaconsult');
  const showCamposCompletos = (formData.tipoLogin.includes('rede') && formData.tipoLogin.includes('clavaconsult')) || 
                               (formData.tipoLogin.includes('clavaconsult') && formData.tipoLogin.length === 1);

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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Localidade */}
              <div className="space-y-2">
                <Label htmlFor="localidade" className="text-sm font-medium text-gray-700">
                  Localidade *
                </Label>
                <Select 
                  value={formData.localidade} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, localidade: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a localidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {LocalidadeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de Login */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Tipo de Login *
                </Label>
                <MultiSelect
                  options={TipoLoginOptions}
                  value={formData.tipoLogin}
                  onChange={(values) => setFormData(prev => ({ ...prev, tipoLogin: values }))}
                  placeholder="Selecione os tipos de login"
                />
              </div>

              {/* Campos condicionais */}
              {showNomeCompleto && (
                <div className="space-y-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Dados Pessoais
                  </h3>
                  
                  {/* Nome Completo */}
                  <div className="space-y-2">
                    <Label htmlFor="nomeCompleto" className="text-sm font-medium text-gray-700">
                      Nome Completo *
                    </Label>
                    <Input
                      id="nomeCompleto"
                      type="text"
                      value={formData.nomeCompleto}
                      onChange={(e) => setFormData(prev => ({ ...prev, nomeCompleto: e.target.value }))}
                      placeholder="Digite o nome completo"
                      className="w-full"
                    />
                  </div>

                  {/* Campos adicionais para ambos os tipos */}
                  {showCamposCompletos && (
                    <>
                      {/* E-mail */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          E-mail *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Digite o e-mail"
                          className="w-full"
                        />
                      </div>

                      {/* CPF */}
                      <div className="space-y-2">
                        <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                          CPF ou CPNJ *
                        </Label>
                        <Input
                          id="cpf"
                          type="text"
                          value={formData.document}
                          onChange={(e) => setFormData(prev => ({ ...prev, document: e.target.value }))}
                          placeholder="Digite o CPF ou CNPJ"
                          className="w-full"
                        />
                      </div>

                      {/* Número do Conselho */}
                      <div className="space-y-2">
                        <Label htmlFor="numeroConselho" className="text-sm font-medium text-gray-700">
                          Número do Conselho *
                        </Label>
                        <Input
                          id="numeroConselho"
                          type="text"
                          value={formData.numeroConselho}
                          onChange={(e) => setFormData(prev => ({ ...prev, numeroConselho: e.target.value }))}
                          placeholder="Digite o número do conselho"
                          className="w-full"
                        />
                      </div>

                      {/* Tipo do Conselho */}
                      <div className="space-y-2">
                        <Label htmlFor="tipoConselho" className="text-sm font-medium text-gray-700">
                          Tipo do Conselho *
                        </Label>
                        <Select
                            value={formData.tipoConselho}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, tipoConselho: value }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o conselho" />
                          </SelectTrigger>
                          <SelectContent>
                            {TipoConselhoOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Especialidade */}
                      <div className="space-y-2">
                        <Label htmlFor="especialidade" className="text-sm font-medium text-gray-700">
                          Especialidade *
                        </Label>
                        <Select 
                          value={formData.especialidade} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, especialidade: value }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione sua especialidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {EspecialidadeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Botão de envio */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                  disabled={!formData.localidade || formData.tipoLogin.length === 0 || isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Formulário"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
