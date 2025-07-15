
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import MultiSelect from '@/components/MultiSelect';

const Index = () => {
  const [formData, setFormData] = useState({
    localidade: '',
    tipoLogin: [] as string[],
    nomeCompleto: '',
    email: '',
    cpf: '',
    numeroConselho: '',
    tipoConselho: '',
    especialidade: ''
  });

  const localidadeOptions = [
    { value: 'global-office', label: 'Global Office' },
    { value: 'plaza-office', label: 'Plaza Office' }
  ];

  const tipoLoginOptions = [
    { value: 'rede', label: 'Rede' },
    { value: 'clavaconsult', label: 'ClavaConsult' }
  ];

  const especialidadeOptions = [
    { value: 'cardiologia', label: 'Cardiologia' },
    { value: 'dermatologia', label: 'Dermatologia' },
    { value: 'pediatria', label: 'Pediatria' },
    { value: 'ortopedia', label: 'Ortopedia' },
    { value: 'neurologia', label: 'Neurologia' },
    { value: 'ginecologia', label: 'Ginecologia e Obstetrícia' },
    { value: 'urologia', label: 'Urologia' },
    { value: 'oftalmologia', label: 'Oftalmologia' },
    { value: 'otorrinolaringologia', label: 'Otorrinolaringologia' },
    { value: 'psiquiatria', label: 'Psiquiatria' },
    { value: 'anestesiologia', label: 'Anestesiologia' },
    { value: 'radiologia', label: 'Radiologia' },
    { value: 'patologia', label: 'Patologia' },
    { value: 'medicina-interna', label: 'Medicina Interna' },
    { value: 'cirurgia-geral', label: 'Cirurgia Geral' },
    { value: 'oncologia', label: 'Oncologia' },
    { value: 'endocrinologia', label: 'Endocrinologia' },
    { value: 'reumatologia', label: 'Reumatologia' },
    { value: 'pneumologia', label: 'Pneumologia' },
    { value: 'gastroenterologia', label: 'Gastroenterologia' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    toast({
      title: "Formulário enviado!",
      description: "Os dados foram enviados com sucesso.",
    });
  };

  const showNomeCompleto = formData.tipoLogin.includes('rede') || formData.tipoLogin.includes('clavaconsult');
  const showCamposCompletos = formData.tipoLogin.includes('rede') && formData.tipoLogin.includes('clavaconsult');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/25ea1f7e-cc95-4a16-8d57-081933b730a9.png" 
                alt="ME.MEDICS - Consultórios Compartilhados" 
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Formulário de Cadastro
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Preencha os dados para criar sua conta
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
                    {localidadeOptions.map(option => (
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
                  options={tipoLoginOptions}
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
                      placeholder="Digite seu nome completo"
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
                          placeholder="Digite seu e-mail"
                          className="w-full"
                        />
                      </div>

                      {/* CPF */}
                      <div className="space-y-2">
                        <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                          CPF *
                        </Label>
                        <Input
                          id="cpf"
                          type="text"
                          value={formData.cpf}
                          onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                          placeholder="Digite seu CPF"
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
                        <Input
                          id="tipoConselho"
                          type="text"
                          value={formData.tipoConselho}
                          onChange={(e) => setFormData(prev => ({ ...prev, tipoConselho: e.target.value }))}
                          placeholder="Ex: CRM, CRO, etc."
                          className="w-full"
                        />
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
                            {especialidadeOptions.map(option => (
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
                  disabled={!formData.localidade || formData.tipoLogin.length === 0}
                >
                  Enviar Formulário
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
