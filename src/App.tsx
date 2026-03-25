import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Building2, User, Calendar, FileDown, Upload, Search, ChevronDown, GripVertical, X, Plus } from 'lucide-react';
import { generatePDF } from './utils/pdfGenerator';
import { generateWord } from './utils/wordGenerator';
import * as XLSX from 'xlsx';

export default function App() {
  const [formData, setFormData] = useState({
    nomeCondominio: '',
    cnpjCondominio: '',
    enderecoCondominio: '',
    nomeSindico: '',
    cpfSindico: '',
    representanteSindico: '',
    telefoneSindico: '',
    emailSindico: '',
    dataBase: '',
    valorPrestacao: '',
    indiceReajuste: 'IPCA',
    tipoPrazo: 'A) Padrão (12 meses)',
    mesesOutroPrazo: '',
    tipoAvisoPrevio: 'Padrão',
    diasAvisoPrevio: '30 (trinta)',
    diasCobrancaAdvocacia: '30',
    tipoLgpd: 'Padrão',
    tipoForo: 'Padrão',
    cidadeForo: '',
    clausula21: '',
    clausula22: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nomeCondominio) newErrors.nomeCondominio = 'Nome do condomínio é obrigatório';
    if (!formData.cnpjCondominio) newErrors.cnpjCondominio = 'CNPJ é obrigatório';
    if (!formData.nomeSindico) newErrors.nomeSindico = 'Nome do síndico é obrigatório';
    if (!formData.cpfSindico) newErrors.cpfSindico = 'CPF é obrigatório';
    if (!formData.emailSindico || !/\S+@\S+\.\S+/.test(formData.emailSindico)) newErrors.emailSindico = 'E-mail inválido';
    if (!formData.dataBase) newErrors.dataBase = 'Data-base é obrigatória';
    if (!formData.valorPrestacao) newErrors.valorPrestacao = 'Valor da prestação é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [table41Data, setTable41Data] = useState([
    { servico: 'Participação em Assembleia (Período de 3 horas / Hora adicional)', tipo: 'ultima', valor: '950,00 / 220,00' },
    { servico: 'Apoio de Assistente / Locação de equipamentos de projeção', tipo: 'ultima', valor: '15% do valor / Reembolso de Despesas' },
    { servico: 'Outros Custos Eletrônica (Operador até 100 Logins/+100 / Uso de Plataforma)', tipo: 'ultima', valor: '280,00 / 545,00 / 270,00' },
    { servico: 'Assessoria em Reuniões do Corpo Diretivo Fora de Horario Comercial (período de 3 horas / Hora adicional)', tipo: 'ultima', valor: '500,00 / 120,00' },
    { servico: 'Participação em Assembléias Extraordinárias', tipo: 'ultima', valor: 'R$ 650,00 por evento' },
    { servico: 'Participação em Assembleias Extraordinárias (final de semana)', tipo: 'ultima', valor: 'R$ 900,00 por evento' },
    { servico: 'Participação em Reuniões fora do expediente', tipo: 'ultima', valor: 'R$ 400,00 por evento' },
    { servico: 'Representação em Audiências Judiciais, como Preposto', tipo: 'ultima', valor: 'R$ 870,00' },
    { servico: 'Homologação e rescisão de funcionários', tipo: 'ultima', valor: 'R$ 370,00' },
    { servico: 'Hospedagem, gerenciamento e manutenção de dados na Internet', tipo: 'ultima', valor: 'R$ 162,00' },
    { servico: 'Certidão do Registro de Imóveis', tipo: 'ultima', valor: 'R$ 195,00' },
    { servico: 'Despesas com viagens e conduções, gestão de arquivos, custódia, etc.', tipo: 'ultima', valor: 'Reembolso de Despesas' },
    { servico: 'Preparação e Assessoria no desmembramento do IPTU', tipo: 'ultima', valor: 'Repasse do custo' },
    { servico: 'Serviços de cópia e correios', tipo: 'ultima', valor: 'Somente repasse de custo' },
    { servico: 'Ficha criminal', tipo: 'ultima', valor: 'Somente repasse de custo' },
    { servico: 'Material de expediente', tipo: 'ultima', valor: 'Tarifas unificadas' },
    { servico: 'Cadastramento SABESP, Inscrição INSS/SRF/FGTS/Prefeitura, Certificação Digital', tipo: 'ultima', valor: 'R$ 930,00' },
    { servico: 'Atualização junto ao DET e Gestão do E-consignado mensal', tipo: 'ultima', valor: 'R$ 465,00' },
    { servico: 'Diligências junto a concessionárias / órgãos públicos (presencial ou digital)', tipo: 'ultima', valor: '450,00 + custos' },
    { servico: 'Protesto de cotas condominiais', tipo: 'ultima', valor: 'R$ 230,00' },
    { servico: 'Regularização ou Parcelamento (INSS/FGTS/Prefeitura/Concessionárias)', tipo: 'ultima', valor: 'A combinar' },
    { servico: 'Gestão de Créditos de Notas Fiscais Eletrônicas', tipo: 'ultima', valor: '10% do valor' },
    { servico: 'Gestão eSocial / Reinf mensal (Por CNPJ)', tipo: 'ultima', valor: 'R$ 192,00' },
    { servico: 'Gestão eSocial mensal (Por CPF / Funcionários e prestadores)', tipo: 'ultima', valor: 'R$ 40,00' },
    { servico: 'Elaboração e entrega anual da DIRF/SRF', tipo: 'ultima', valor: 'R$ 900,00' },
    { servico: 'Entrega anual de Informe de Rendimentos', tipo: 'ultima', valor: 'R$ 70,00' },
    { servico: 'Consulta e Acompanhamento Anual ao FAP', tipo: 'ultima', valor: 'R$ 280,00' },
    { servico: 'Controle de NFTS (Opção 1: Envio/Controle mensal)', tipo: 'ultima', valor: 'R$ 1.090,00' },
    { servico: 'Controle de NFTS (Opção 2: Envio, controle e cobrança mensal)', tipo: 'ultima', valor: 'R$ 130,60' },
    { servico: 'Retenções de Tributos de Pagamentos (Opção 1: Por faixas de retenção)', tipo: 'ultima', valor: 'De 220,00 a 470,00' },
    { servico: 'Retenções de Tributos de Pagamentos (Opção 2: Por retenção/cada)', tipo: 'ultima', valor: 'R$ 31,70' },
    { servico: 'Assessoria LGPD: Termo Aditivo', tipo: 'ultima', valor: 'R$ 34,00' },
    { servico: 'Assessoria LGPD: Política de Privacidade', tipo: 'ultima', valor: 'R$ 425,00' },
    { servico: 'Assessoria LGPD: Adequação de cláusulas', tipo: 'ultima', valor: 'R$ 235,00' },
    { servico: 'Malote Digital', tipo: 'ultima', valor: 'ISENTO (SEMPRE)' },
    { servico: 'Pasta Digitalizada', tipo: 'ultima', valor: 'ISENTO (SEMPRE)' },
    { servico: 'Conta Bancaria (Banco Homologado)', tipo: 'ultima', valor: 'REPASSE DE TARIFAS E TAXAS' }
  ]);
  const [table41Headers, setTable41Headers] = useState({ servico: 'Serviço', valor: 'Última Referência' });
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    setDraggedRowIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    if (draggedRowIndex === null) return;
    if (draggedRowIndex === index) return;

    const newData = [...table41Data];
    const [draggedItem] = newData.splice(draggedRowIndex, 1);
    newData.splice(index, 0, draggedItem);
    
    setTable41Data(newData);
    setDraggedRowIndex(null);
  };

  const handleTableChange = (index: number, field: 'servico' | 'valor' | 'tipo', newValue: string) => {
    const newData = [...table41Data];
    newData[index][field] = newValue;
    setTable41Data(newData);
  };

  const handleHeaderChange = (field: 'servico' | 'valor', newValue: string) => {
    setTable41Headers(prev => ({ ...prev, [field]: newValue }));
  };

  const addRow = () => {
    setTable41Data([...table41Data, { servico: '', tipo: 'valor', valor: '' }]);
  };

  const insertRow = (index: number) => {
    const newData = [...table41Data];
    newData.splice(index + 1, 0, { servico: '', tipo: 'valor', valor: '' });
    setTable41Data(newData);
  };

  const deleteRow = (index: number) => {
    setTable41Data(table41Data.filter((_, i) => i !== index));
  };

  const [condominiosList, setCondominiosList] = useState<any[]>([]);
  const [isLoadingDefault, setIsLoadingDefault] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedCondominioId, setSelectedCondominioId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const arrayBuffer = evt.target?.result as ArrayBuffer;
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];
        
        if (data && data.length > 0) {
          setCondominiosList(prev => [...prev, ...data]);
          console.log('Importação manual concluída:', data.length, 'novos itens adicionados.');
          alert(`Sucesso! ${data.length} condomínios foram adicionados à lista.`);
        } else {
          alert('O arquivo selecionado parece estar vazio ou não contém dados válidos.');
        }
      } catch (err) {
        console.error('Erro na importação manual:', err);
        alert('Erro ao ler o arquivo. Certifique-se de que é um arquivo Excel (.xlsx) válido.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSelectCondominio = (condominio: any) => {
    setSelectedCondominioId(condominio.ID);
    setSearchTerm(`${String(condominio.ID).padStart(4, '0')} - ${condominio.Nome}`);
    setIsDropdownOpen(false);
    
    setFormData(prev => ({
      ...prev,
      nomeCondominio: condominio.Nome || '',
      cnpjCondominio: condominio.CNPJ || '',
      enderecoCondominio: `${condominio['Endereço'] || ''} - CEP: ${condominio.CEP || ''}`,
    }));
  };

  const handleClearCondominio = () => {
    setSelectedCondominioId('');
    setSearchTerm('');
    setFormData(prev => ({
      ...prev,
      nomeCondominio: '',
      cnpjCondominio: '',
      enderecoCondominio: '',
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortedCondominios = [...condominiosList].sort((a, b) => {
    const idA = String(a.ID).padStart(4, '0');
    const idB = String(b.ID).padStart(4, '0');
    return idA.localeCompare(idB);
  });

  const filteredCondominios = sortedCondominios.filter(c => {
    const searchStr = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const idStr = c.ID ? String(c.ID).padStart(4, '0') : '';
    const nomeStr = c.Nome ? String(c.Nome).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
    return idStr.includes(searchStr) || nomeStr.includes(searchStr);
  });

  const loadDefaultCondominios = async () => {
    setIsLoadingDefault(true);
    setFetchError(null);
    try {
      // Use BASE_URL which is the most robust way in Vite
      const baseUrl = import.meta.env.BASE_URL || '/';
      const path = baseUrl.endsWith('/') ? `${baseUrl}condominios.xlsx` : `${baseUrl}/condominios.xlsx`;
      
      console.log('Tentando carregar base de condomínios padrão de:', path);
      
      const res = await fetch(path);
      if (!res.ok) {
        throw new Error(`Arquivo não encontrado (Status: ${res.status}). Verifique se 'public/condominios.xlsx' existe no seu repositório e se o build foi concluído.`);
      }
      
      const arrayBuffer = await res.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: 'array' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      if (data && data.length > 0) {
        setCondominiosList(data);
        console.log('Base de condomínios carregada com sucesso:', data.length, 'itens');
      } else {
        throw new Error('O arquivo condominios.xlsx foi encontrado, mas parece estar vazio ou com formato inválido.');
      }
    } catch (err) {
      console.error('Erro detalhado ao carregar base padrão:', err);
      setFetchError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoadingDefault(false);
    }
  };

  useEffect(() => {
    loadDefaultCondominios();
  }, []);

  useEffect(() => {
    console.log('Lista de condomínios atualizada. Total:', condominiosList.length);
  }, [condominiosList]);

  useEffect(() => {
    const paragrafoMulta =
      ' No caso de a parte desejar rescindir o presente contrato antes do término de sua vigência inicial, deverá respeitar o mesmo trâmite anteriormente previsto neste parágrafo, sem prejuízo do pagamento de uma indenização de 50% (cinquenta por cento) do valor restante da vigência do contrato, valor este nunca inferior a duas prestações de serviços vigentes.';

    let baseAviso = '';
    if (formData.tipoAvisoPrevio === 'Padrão') {
      baseAviso =
        '2.2. Rescisão Contratual – Caso alguma das partes queira rescindir o contrato, deverá formalizar por escrito à outra, sendo que a prestação de serviços se encerrará no último dia do mês subsequente ao recebimento da carta de rescisão. Prazo necessário para que a transição de documentos e informações seja feita com a máxima segurança. Caso a parte queira dispensar o aviso prévio e requerer rescisão contratual imediata, deverá formalizar este requerimento na carta de rescisão e indenizar a outra parte pelo valor proporcional da prestação de serviços, sem prejuízo de um honorário de prestações de serviços vigentes.';
    } else {
      baseAviso =
        `2.2. Rescisão Contratual – Caso alguma das partes queira rescindir o contrato, deverá formalizar por escrito à outra, sendo que a prestação de serviços se encerrará nos ${formData.diasAvisoPrevio} dias ao recebimento da carta de rescisão. Prazo necessário para que a transição de documentos e informações seja feita com a máxima segurança. Caso a parte queira dispensar o aviso prévio e requerer rescisão contratual imediata, deverá formalizar este requerimento na carta de rescisão e indenizar a outra parte pelo valor proporcional da prestação de serviços, sem prejuízo de um honorário de prestações de serviços vigentes.`;
    }

    let c21 = '';
    let c22 = '';

    if (formData.tipoPrazo === 'A) Padrão (12 meses)') {
      c21 =
        '2.1. Prazo - O prazo de vigência inicial do presente contrato é de 12 (doze) meses a partir da data-base, que consta no quadro resumo deste. Após ter transcorrido o prazo aqui estipulado, o contrato vigorará por tempo indeterminado, sem prejuízo de todas as suas cláusulas.';
      c22 = baseAviso + paragrafoMulta;
    } else if (formData.tipoPrazo === 'B) Outro prazo determinado') {
      const meses = formData.mesesOutroPrazo.trim() ? formData.mesesOutroPrazo : '___';
      c21 = `2.1. Prazo - O prazo de vigência inicial do presente contrato é de ${meses} meses a partir da data-base, que consta no quadro resumo deste. Após ter transcorrido o prazo aqui estipulado, o contrato vigorará por tempo indeterminado, sem prejuízo de todas as suas cláusulas.`;
      c22 = baseAviso + paragrafoMulta;
    } else {
      c21 =
        '2.1. Prazo - O contrato vigorará por tempo indeterminado, sem prejuízo de todas as suas cláusulas.';
      c22 = baseAviso;
    }

    setFormData((prev) => ({ ...prev, clausula21: c21, clausula22: c22 }));
  }, [formData.tipoPrazo, formData.mesesOutroPrazo, formData.tipoAvisoPrevio, formData.diasAvisoPrevio]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-8 py-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-semibold tracking-tight">Gerador de Contratos</h1>
          </div>
          <p className="text-slate-400">APP PARA CAIO CONTRATOS</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Dados do Condomínio */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-500" />
                1. Dados do Condomínio
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Importar Planilha
                </button>
              </div>
            </div>

            {isLoadingDefault ? (
              <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                Carregando base de condomínios padrão...
              </div>
            ) : fetchError ? (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <p className="font-semibold mb-1">Erro ao carregar base automática:</p>
                <p className="mb-2">{fetchError}</p>
                <button 
                  onClick={loadDefaultCondominios}
                  className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded transition-colors font-medium"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : condominiosList.length > 0 ? (
              <div className="mb-4 relative" ref={dropdownRef}>
                <label className="text-sm font-medium text-slate-700 block mb-1">Pesquisar Condomínio da Planilha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Digite o código ou nome..."
                    className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearCondominio}
                      className="absolute inset-y-0 right-8 flex items-center pr-2 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Limpar seleção"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredCondominios.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-500">Nenhum condomínio encontrado.</div>
                    ) : (
                      <ul className="py-1">
                        {filteredCondominios.map((c: any, index: number) => (
                          <li
                            key={index}
                            onClick={() => handleSelectCondominio(c)}
                            className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors"
                          >
                            <span className="font-medium">{String(c.ID).padStart(4, '0')}</span> - {c.Nome}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                Nenhuma base de condomínios carregada. Importe uma planilha para começar.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nome do Condomínio</label>
                <input
                  type="text"
                  name="nomeCondominio"
                  value={formData.nomeCondominio}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all ${errors.nomeCondominio ? 'border-red-500' : 'border-slate-300'}`}
                  placeholder="Ex: Condomínio Terrazo"
                />
                {errors.nomeCondominio && <p className="text-red-500 text-xs">{errors.nomeCondominio}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">CNPJ</label>
                <input
                  type="text"
                  name="cnpjCondominio"
                  value={formData.cnpjCondominio}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all ${errors.cnpjCondominio ? 'border-red-500' : 'border-slate-300'}`}
                  placeholder="00.000.000/0000-00"
                />
                {errors.cnpjCondominio && <p className="text-red-500 text-xs">{errors.cnpjCondominio}</p>}
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Endereço Completo</label>
                <input
                  type="text"
                  name="enderecoCondominio"
                  value={formData.enderecoCondominio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                />
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Dados do Síndico */}
          <section>
            <h2 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-500" />
              2. Dados do Síndico(a)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nome Completo</label>
                <input
                  type="text"
                  name="nomeSindico"
                  value={formData.nomeSindico}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all ${errors.nomeSindico ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.nomeSindico && <p className="text-red-500 text-xs">{errors.nomeSindico}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">CPF/CNPJ do Síndico</label>
                <input
                  type="text"
                  name="cpfSindico"
                  value={formData.cpfSindico}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all ${errors.cpfSindico ? 'border-red-500' : 'border-slate-300'}`}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                />
                {errors.cpfSindico && <p className="text-red-500 text-xs">{errors.cpfSindico}</p>}
              </div>
              {formData.cpfSindico.replace(/\D/g, '').length > 11 && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Representante da Empresa</label>
                  <input
                    type="text"
                    name="representanteSindico"
                    value={formData.representanteSindico}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Nome do representante legal"
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Telefone</label>
                <input
                  type="text"
                  name="telefoneSindico"
                  value={formData.telefoneSindico}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="(11) 90000-0000"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">E-mail</label>
                <input
                  type="email"
                  name="emailSindico"
                  value={formData.emailSindico}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all ${errors.emailSindico ? 'border-red-500' : 'border-slate-300'}`}
                  placeholder="sindico@email.com"
                />
                {errors.emailSindico && <p className="text-red-500 text-xs">{errors.emailSindico}</p>}
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Dados do Contrato */}
          <section>
            <h2 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-500" />
              3. Dados do Contrato
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Data-base</label>
                <input
                  type="text"
                  name="dataBase"
                  value={formData.dataBase}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all ${errors.dataBase ? 'border-red-500' : 'border-slate-300'}`}
                  placeholder="ex: 01/04/2026"
                />
                {errors.dataBase && <p className="text-red-500 text-xs">{errors.dataBase}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Valor da Prestação</label>
                <input
                  type="text"
                  name="valorPrestacao"
                  value={formData.valorPrestacao}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all ${errors.valorPrestacao ? 'border-red-500' : 'border-slate-300'}`}
                  placeholder="ex: R$ 2.700,00"
                />
                {errors.valorPrestacao && <p className="text-red-500 text-xs">{errors.valorPrestacao}</p>}
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
              <label className="text-sm font-medium text-slate-900 block mb-2">
                Índice de Reajuste
              </label>
              <div className="flex flex-wrap gap-6">
                {['IPCA', 'IGPM', 'INPC', 'SELIC'].map((indice) => (
                  <label key={indice} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="indiceReajuste"
                      value={indice}
                      checked={formData.indiceReajuste === indice}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="text-sm text-slate-700">{indice}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <label className="text-sm font-medium text-slate-900 block mb-2">
                Condições de Prazo (Cláusula 2.1)
              </label>
              
              <div className="space-y-2">
                {['A) Padrão (12 meses)', 'B) Outro prazo determinado', 'C) Prazo Indeterminado'].map((opcao) => (
                  <label key={opcao} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="tipoPrazo"
                      value={opcao}
                      checked={formData.tipoPrazo === opcao}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="text-sm text-slate-700">{opcao}</span>
                  </label>
                ))}
              </div>

              {formData.tipoPrazo === 'B) Outro prazo determinado' && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Quantidade de meses
                  </label>
                  <input
                    type="text"
                    name="mesesOutroPrazo"
                    value={formData.mesesOutroPrazo}
                    onChange={handleInputChange}
                    className="w-full md:w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="ex: 24 (vinte e quatro)"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200 mt-4">
              <label className="text-sm font-medium text-slate-900 block mb-2">
                Condições de Aviso Prévio (Cláusula 2.2)
              </label>
              
              <div className="space-y-2">
                {['Padrão', 'Previsão de dias'].map((opcao) => (
                  <label key={opcao} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="tipoAvisoPrevio"
                      value={opcao}
                      checked={formData.tipoAvisoPrevio === opcao}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="text-sm text-slate-700">{opcao}</span>
                  </label>
                ))}
              </div>

              {formData.tipoAvisoPrevio === 'Previsão de dias' && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Quantidade de dias
                  </label>
                  <div className="flex gap-4">
                    {['30 (trinta)', '60 (sessenta)'].map((dias) => (
                      <label key={dias} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="diasAvisoPrevio"
                          value={dias}
                          checked={formData.diasAvisoPrevio === dias}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                        />
                        <span className="text-sm text-slate-700">{dias} dias</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200 mt-4">
              <label className="text-sm font-medium text-slate-900 block mb-2">
                Condições de Cobrança - Advocacia (Cláusula 3.5)
              </label>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Após quantos dias de atraso a cobrança será direcionada a um escritório de advocacia?
                </label>
                <div className="flex gap-4">
                  {['30', '60', '90'].map((dias) => (
                    <label key={dias} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="diasCobrancaAdvocacia"
                        value={dias}
                        checked={formData.diasCobrancaAdvocacia === dias}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                      />
                      <span className="text-sm text-slate-700">{dias} dias</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200 mt-4">
              <label className="text-sm font-medium text-slate-900 block mb-2">
                Cláusula LGPD e Compliance (Cláusula 4.2)
              </label>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Qual versão da cláusula LGPD deseja utilizar?
                </label>
                <div className="flex flex-col gap-3">
                  {['Padrão', 'Completa'].map((tipo) => (
                    <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tipoLgpd"
                        value={tipo}
                        checked={formData.tipoLgpd === tipo}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                      />
                      <span className="text-sm text-slate-700 font-medium">{tipo}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200 mt-4">
              <label className="text-sm font-medium text-slate-900 block mb-2">
                Foro (Cláusula 4.6)
              </label>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Qual cidade será eleita como foro?
                </label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tipoForo"
                      value="Padrão"
                      checked={formData.tipoForo === 'Padrão'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="text-sm text-slate-700 font-medium">Padrão (São Paulo)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tipoForo"
                      value="Personalizado"
                      checked={formData.tipoForo === 'Personalizado'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="text-sm text-slate-700 font-medium">Personalizado</span>
                  </label>
                </div>

                {formData.tipoForo === 'Personalizado' && (
                  <div className="mt-3 pl-6">
                    <input
                      type="text"
                      name="cidadeForo"
                      value={formData.cidadeForo}
                      onChange={handleInputChange}
                      placeholder="Digite ou selecione a cidade"
                      list="cidades-sp"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <datalist id="cidades-sp">
                      <option value="Guarulhos" />
                      <option value="Osasco" />
                      <option value="Santo André" />
                      <option value="São Bernardo do Campo" />
                      <option value="São Caetano do Sul" />
                      <option value="Diadema" />
                      <option value="Mauá" />
                      <option value="Mogi das Cruzes" />
                      <option value="Barueri" />
                      <option value="Santos" />
                      <option value="São Vicente" />
                      <option value="Guarujá" />
                      <option value="Praia Grande" />
                      <option value="Bertioga" />
                      <option value="São Sebastião" />
                      <option value="Caraguatatuba" />
                      <option value="Ubatuba" />
                    </datalist>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200 mt-6">
              <h3 className="text-sm font-medium text-slate-900 mb-2">
                Pré-visualização das Cláusulas (Editável)
              </h3>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Texto da Cláusula 2.1</label>
                <textarea
                  name="clausula21"
                  value={formData.clausula21}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Texto da Cláusula 2.2</label>
                <textarea
                  name="clausula22"
                  value={formData.clausula22}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-900">
                  Tabela de Serviços Especiais (Cláusula 4.1)
                </h3>
                <button
                  onClick={() => setIsTableVisible(!isTableVisible)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {isTableVisible ? 'Minimizar' : 'Editar Tabela'}
                </button>
              </div>
              
              {isTableVisible && (
                <div className="overflow-x-auto space-y-3">
                  <table className="w-full text-sm text-left text-slate-600 border-collapse">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-200">
                      <tr>
                        <th className="px-2 py-2 border border-slate-300 w-8"></th>
                        <th className="px-4 py-2 border border-slate-300">
                          <input 
                            type="text" 
                            value={table41Headers.servico} 
                            onChange={(e) => handleHeaderChange('servico', e.target.value)} 
                            className="w-full bg-transparent border-none outline-none font-bold uppercase text-xs placeholder:text-slate-400 focus:bg-white/50 px-1 rounded" 
                            placeholder="Título da Coluna"
                          />
                        </th>
                        <th className="px-4 py-2 border border-slate-300">
                          <input 
                            type="text" 
                            value={table41Headers.valor} 
                            onChange={(e) => handleHeaderChange('valor', e.target.value)} 
                            className="w-full bg-transparent border-none outline-none font-bold uppercase text-xs placeholder:text-slate-400 focus:bg-white/50 px-1 rounded" 
                            placeholder="Título da Coluna"
                          />
                        </th>
                        <th className="px-2 py-2 border border-slate-300 w-20 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table41Data.map((row, index) => (
                        <tr 
                          key={index} 
                          className={`bg-white border-b border-slate-200 transition-colors ${draggedRowIndex === index ? 'opacity-50 bg-slate-100' : ''}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <td className="px-1 py-1 border border-slate-300 text-center cursor-move text-slate-400 hover:text-slate-600">
                            <GripVertical className="w-4 h-4 mx-auto" />
                          </td>
                          <td className="px-2 py-1 border border-slate-300">
                            <input
                              type="text"
                              value={row.servico}
                              onChange={(e) => handleTableChange(index, 'servico', e.target.value)}
                              className="w-full px-2 py-1 border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            />
                          </td>
                          <td className="px-2 py-1 border border-slate-300">
                            <select
                              value={row.tipo}
                              onChange={(e) => handleTableChange(index, 'tipo', e.target.value)}
                              className="w-full px-2 py-1 border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            >
                              <option value="valor">Valor</option>
                              <option value="isento">Isento</option>
                              <option value="ultima">Última Referência</option>
                            </select>
                            {row.tipo === 'valor' && (
                              <input
                                type="text"
                                value={row.valor}
                                onChange={(e) => handleTableChange(index, 'valor', e.target.value)}
                                placeholder="Digite o valor"
                                className="w-full px-2 py-1 border-t border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                              />
                            )}
                          </td>
                          <td className="px-2 py-1 border border-slate-300 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => insertRow(index)} 
                                className="text-emerald-600 hover:text-emerald-800 p-1"
                                title="Adicionar linha abaixo"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => deleteRow(index)} 
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Excluir linha"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={addRow} className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                    Adicionar Linha
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Submit Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                if (validateForm()) {
                  generatePDF(formData, table41Data, table41Headers);
                } else {
                  alert('Por favor, preencha todos os campos obrigatórios corretamente.');
                }
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors focus:ring-4 focus:ring-emerald-200"
            >
              <Download className="w-5 h-5" />
              Gerar Contrato em PDF
            </button>
            <button
              onClick={() => {
                if (validateForm()) {
                  generateWord(formData, table41Data, table41Headers);
                } else {
                  alert('Por favor, preencha todos os campos obrigatórios corretamente.');
                }
              }}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors focus:ring-4 focus:ring-slate-100"
            >
              <FileDown className="w-5 h-5" />
              Baixar em Word (.docx)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
