import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Download, Building2, User, Calendar, FileDown, 
  Upload, Search, ChevronDown, GripVertical, X, Plus,
  Moon, Sun, Save, FileUp, Eye, CheckCircle2, AlertCircle,
  Menu
} from 'lucide-react';
import { generatePDF } from './utils/pdfGenerator';
import { generateWord } from './utils/wordGenerator';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'motion/react';
import Fuse from 'fuse.js';

const validateCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  let sum = 0;
  for (let i = 1; i <= 9; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cleanCPF.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cleanCPF.substring(10, 11))) return false;
  return true;
};

const validateCNPJ = (cnpj: string) => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  if (cleanCNPJ.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
  let size = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, size);
  const digits = cleanCNPJ.substring(size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  size = size + 1;
  numbers = cleanCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  return true;
};

export default function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showPreview, setShowPreview] = useState(false);
  const [additionalClauses, setAdditionalClauses] = useState<{ id: string; title: string; text: string }[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newClauseTitle, setNewClauseTitle] = useState('');
  const [newClauseText, setNewClauseText] = useState('');
  
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
    
    if (!formData.cnpjCondominio) {
      newErrors.cnpjCondominio = 'CNPJ é obrigatório';
    } else if (!validateCNPJ(formData.cnpjCondominio)) {
      newErrors.cnpjCondominio = 'CNPJ inválido';
    }

    if (!formData.nomeSindico) newErrors.nomeSindico = 'Nome do síndico é obrigatório';
    
    if (!formData.cpfSindico) {
      newErrors.cpfSindico = 'CPF é obrigatório';
    } else if (formData.cpfSindico.replace(/\D/g, '').length <= 11 && !validateCPF(formData.cpfSindico)) {
      newErrors.cpfSindico = 'CPF inválido';
    } else if (formData.cpfSindico.replace(/\D/g, '').length > 11 && !validateCNPJ(formData.cpfSindico)) {
      newErrors.cpfSindico = 'CNPJ do síndico inválido';
    }

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
  const draftInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-save logic
  useEffect(() => {
    const savedData = localStorage.getItem('contractDraft');
    if (savedData) {
      try {
        const { formData: savedForm, table41Data: savedTable, additionalClauses: savedClauses } = JSON.parse(savedData);
        if (savedForm) setFormData(prev => ({ ...prev, ...savedForm }));
        if (savedTable) setTable41Data(savedTable);
        if (savedClauses) setAdditionalClauses(savedClauses);
      } catch (e) {
        console.error('Error loading draft from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = JSON.stringify({ formData, table41Data, additionalClauses });
    localStorage.setItem('contractDraft', dataToSave);
  }, [formData, table41Data, additionalClauses]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const handleExportDraft = () => {
    const data = JSON.stringify({ formData, table41Data, additionalClauses }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rascunho_Contrato_${formData.nomeCondominio || 'Sem_Nome'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportDraft = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const { formData: importedForm, table41Data: importedTable, additionalClauses: importedClauses } = JSON.parse(content);
        if (importedForm) setFormData(importedForm);
        if (importedTable) setTable41Data(importedTable);
        if (importedClauses) setAdditionalClauses(importedClauses);
        alert('Rascunho importado com sucesso!');
      } catch (e) {
        alert('Erro ao importar rascunho. Arquivo inválido.');
      }
    };
    reader.readAsText(file);
  };

  const addAdditionalClause = () => {
    if (!newClauseTitle.trim() || !newClauseText.trim()) return;
    const newClause = {
      id: Math.random().toString(36).substr(2, 9),
      title: newClauseTitle,
      text: newClauseText
    };
    setAdditionalClauses([...additionalClauses, newClause]);
    setNewClauseTitle('');
    setNewClauseText('');
  };

  const removeAdditionalClause = (id: string) => {
    setAdditionalClauses(additionalClauses.filter(c => c.id !== id));
  };

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

  const filteredCondominios = React.useMemo(() => {
    if (!searchTerm) return sortedCondominios;

    const fuse = new Fuse(sortedCondominios, {
      keys: [
        { name: 'ID', weight: 0.3 },
        { name: 'Nome', weight: 0.7 }
      ],
      threshold: 0.3,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 1,
      shouldSort: true
    });

    // Also allow exact ID matching if it's a number
    const exactIdMatch = sortedCondominios.find(c => String(c.ID).padStart(4, '0') === searchTerm.padStart(4, '0'));
    
    const results = fuse.search(searchTerm).map(r => r.item);
    
    if (exactIdMatch && !results.find(r => r.ID === exactIdMatch.ID)) {
      return [exactIdMatch, ...results];
    }
    
    return results;
  }, [searchTerm, sortedCondominios]);

  const loadDefaultCondominios = async () => {
    setIsLoadingDefault(true);
    setFetchError(null);
    try {
      // Use a safer way to get the base path
      const path = 'condominios.xlsx';
      
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Column */}
        <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all ${showPreview ? '' : 'lg:col-span-2 max-w-3xl mx-auto'}`}>
          <div className="bg-slate-900 dark:bg-black px-8 py-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 -ml-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                title="Menu de Opções"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-emerald-400" />
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Gerador de Contratos</h1>
                  <p className="text-slate-400 text-sm">Sell Administradora de Condomínios</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="h-6 w-px bg-slate-700 mx-1" />
              <button
                onClick={handleExportDraft}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                title="Exportar Rascunho"
              >
                <Save className="w-5 h-5" />
              </button>
              <button
                onClick={() => draftInputRef.current?.click()}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                title="Importar Rascunho"
              >
                <FileUp className="w-5 h-5" />
              </button>
              <input
                type="file"
                accept=".json"
                className="hidden"
                ref={draftInputRef}
                onChange={handleImportDraft}
              />
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`p-2 rounded-lg transition-colors ${showPreview ? 'bg-emerald-500 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
                title="Visualização em Tempo Real"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Dados do Condomínio */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-slate-500 dark:text-slate-400" />
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

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
              <label className="text-sm font-medium text-slate-900 dark:text-white block mb-2">
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
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{indice}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="text-sm font-medium text-slate-900 dark:text-white block mb-2">
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
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{opcao}</span>
                  </label>
                ))}
              </div>

              {formData.tipoPrazo === 'B) Outro prazo determinado' && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Quantidade de meses
                  </label>
                  <input
                    type="text"
                    name="mesesOutroPrazo"
                    value={formData.mesesOutroPrazo}
                    onChange={handleInputChange}
                    className="w-full md:w-1/2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                    placeholder="ex: 24 (vinte e quatro)"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
              <label className="text-sm font-medium text-slate-900 dark:text-white block mb-2">
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
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{opcao}</span>
                  </label>
                ))}
              </div>

              {formData.tipoAvisoPrevio === 'Previsão de dias' && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
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
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{dias} dias</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
              <label className="text-sm font-medium text-slate-900 dark:text-white block mb-2">
                Condições de Cobrança - Advocacia (Cláusula 3.5)
              </label>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
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
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{dias} dias</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Biblioteca de Cláusulas Opcionais Removida */}
            
            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Cláusula LGPD e Compliance (Cláusula 4.2) */}
            <section>
              <label className="text-sm font-medium text-slate-900 dark:text-white block mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                5. LGPD e Compliance (Cláusula 4.2)
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
            </section>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
              <label className="text-sm font-medium text-slate-900 dark:text-white block mb-2">
                Foro (Cláusula 4.6)
              </label>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
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
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Padrão (São Paulo)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tipoForo"
                      value="Personalizado"
                      checked={formData.tipoForo === 'Personalizado'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Personalizado</span>
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
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white"
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

            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mt-6">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                Pré-visualização das Cláusulas (Editável)
              </h3>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Texto da Cláusula 2.1</label>
                <textarea
                  name="clausula21"
                  value={formData.clausula21}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Texto da Cláusula 2.2</label>
                <textarea
                  name="clausula22"
                  value={formData.clausula22}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                  Tabela de Serviços Especiais (Cláusula 4.1)
                </h3>
                <button
                  onClick={() => setIsTableVisible(!isTableVisible)}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                >
                  {isTableVisible ? 'Minimizar' : 'Editar Tabela'}
                </button>
              </div>
              
              {isTableVisible && (
                <div className="overflow-x-auto space-y-3">
                  <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400 border-collapse">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-200 dark:bg-slate-700">
                      <tr>
                        <th className="px-2 py-2 border border-slate-300 dark:border-slate-600 w-8"></th>
                        <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">
                          <input 
                            type="text" 
                            value={table41Headers.servico} 
                            onChange={(e) => handleHeaderChange('servico', e.target.value)} 
                            className="w-full bg-transparent border-none outline-none font-bold uppercase text-xs placeholder:text-slate-400 focus:bg-white/50 dark:focus:bg-black/50 px-1 rounded dark:text-white" 
                            placeholder="Título da Coluna"
                          />
                        </th>
                        <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">
                          <input 
                            type="text" 
                            value={table41Headers.valor} 
                            onChange={(e) => handleHeaderChange('valor', e.target.value)} 
                            className="w-full bg-transparent border-none outline-none font-bold uppercase text-xs placeholder:text-slate-400 focus:bg-white/50 dark:focus:bg-black/50 px-1 rounded dark:text-white" 
                            placeholder="Título da Coluna"
                          />
                        </th>
                        <th className="px-2 py-2 border border-slate-300 dark:border-slate-600 w-20 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table41Data.map((row, index) => (
                        <tr 
                          key={index} 
                          className={`bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors ${draggedRowIndex === index ? 'opacity-50 bg-slate-100 dark:bg-slate-700' : ''}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <td className="px-1 py-1 border border-slate-300 dark:border-slate-600 text-center cursor-move text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <GripVertical className="w-4 h-4 mx-auto" />
                          </td>
                          <td className="px-2 py-1 border border-slate-300 dark:border-slate-600">
                            <input
                              type="text"
                              value={row.servico}
                              onChange={(e) => handleTableChange(index, 'servico', e.target.value)}
                              className="w-full px-2 py-1 bg-transparent border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white"
                            />
                          </td>
                          <td className="px-2 py-1 border border-slate-300 dark:border-slate-600">
                            <select
                              value={row.tipo}
                              onChange={(e) => handleTableChange(index, 'tipo', e.target.value)}
                              className="w-full px-2 py-1 bg-transparent border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white dark:bg-slate-800"
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
                                className="w-full px-2 py-1 bg-transparent border-t border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white"
                              />
                            )}
                          </td>
                          <td className="px-2 py-1 border border-slate-300 dark:border-slate-600 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => insertRow(index)} 
                                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 p-1"
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
                  generatePDF(formData, table41Data, table41Headers, additionalClauses);
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
                  generateWord(formData, table41Data, table41Headers, additionalClauses);
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

      {/* Preview Column */}
      {showPreview && (
          <div className="hidden lg:block sticky top-8 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-all duration-300">
            <div className="bg-slate-100 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-500" />
                Visualização em Tempo Real
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">A4 PREVIEW</span>
            </div>
            <div className="flex-1 overflow-auto p-8 bg-slate-50 dark:bg-slate-950">
              <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-12 min-h-full mx-auto max-w-[21cm] text-slate-900 dark:text-slate-100 font-serif text-[10pt] leading-relaxed">
                <div className="text-center mb-8">
                  <h1 className="text-lg font-bold uppercase underline decoration-slate-300 underline-offset-4">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
                </div>

                <div className="space-y-4 text-justify">
                  <p>
                    Pelo presente instrumento particular, de um lado <strong>SELL ADMINISTRADORA DE CONDOMÍNIOS LTDA</strong>, com sede na Av. Pompéia, 723, São Paulo/SP, inscrita no CNPJ sob o nº 14.804.150/0001-62, doravante denominada <strong>CONTRATADA</strong>, e de outro lado o <strong>{formData.nomeCondominio || '____________________'}</strong>, inscrito no CNPJ sob o nº <strong>{formData.cnpjCondominio || '____________________'}</strong>, situado em <strong>{formData.enderecoCondominio || '____________________'}</strong>, representado por seu síndico(a) <strong>{formData.nomeSindico || '____________________'}</strong>, doravante denominado <strong>CONTRATANTE</strong>, têm entre si justo e contratado o seguinte:
                  </p>

                  <section>
                    <h3 className="font-bold uppercase mb-1">CLÁUSULA PRIMEIRA - DO OBJETO</h3>
                    <p>O presente contrato tem por objeto a prestação de serviços de administração condominial pela CONTRATADA ao CONTRATANTE...</p>
                  </section>

                  <section>
                    <h3 className="font-bold uppercase mb-1">CLÁUSULA SEGUNDA - DO PRAZO E RESCISÃO</h3>
                    <p><strong>2.1.</strong> {formData.clausula21}</p>
                    <p><strong>2.2.</strong> {formData.clausula22}</p>
                  </section>

                  <section>
                    <h3 className="font-bold uppercase mb-1">CLÁUSULA TERCEIRA - DOS HONORÁRIOS</h3>
                    <p>Pela prestação dos serviços ora contratados, o CONTRATANTE pagará à CONTRATADA a importância mensal de <strong>{formData.valorPrestacao || 'R$ 0,00'}</strong>...</p>
                  </section>

                  {additionalClauses.length > 0 && (
                    <section className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                      <h3 className="font-bold uppercase mb-2 text-emerald-600 dark:text-emerald-400">CLÁUSULAS ADICIONAIS</h3>
                      <div className="space-y-3">
                        {additionalClauses.map((clause, index) => (
                          <div key={clause.id} className="text-sm italic text-slate-600 dark:text-slate-400">
                            <strong>{index + 5}. {clause.title}:</strong> {clause.text}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-8 text-center text-[8pt]">
                    <div>
                      <div className="border-t border-slate-900 dark:border-slate-100 pt-1 mt-8"></div>
                      <p className="font-bold uppercase">CONTRATADA</p>
                      <p>SELL ADMINISTRADORA</p>
                    </div>
                    <div>
                      <div className="border-t border-slate-900 dark:border-slate-100 pt-1 mt-8"></div>
                      <p className="font-bold uppercase">CONTRATANTE</p>
                      <p>{formData.nomeCondominio || 'CONDOMÍNIO'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Menu className="w-6 h-6 text-emerald-500" />
                  Menu de Opções
                </h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              {/* Tabs Header */}
              <div className="flex border-b border-slate-200 dark:border-slate-800">
                <button className="flex-1 py-3 text-sm font-semibold text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/30 dark:bg-emerald-900/10">
                  Cláusulas Adicionais
                </button>
                <button className="flex-1 py-3 text-sm font-semibold text-slate-400 cursor-not-allowed" disabled>
                  Configurações
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Add New Clause Form */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Nova Cláusula Personalizada</h3>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Título da Cláusula</label>
                    <input
                      type="text"
                      value={newClauseTitle}
                      onChange={(e) => setNewClauseTitle(e.target.value)}
                      placeholder="Ex: Multa por Atraso"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Texto da Cláusula</label>
                    <textarea
                      value={newClauseText}
                      onChange={(e) => setNewClauseText(e.target.value)}
                      placeholder="Descreva o texto da cláusula aqui..."
                      rows={4}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
                    />
                  </div>
                  <button
                    onClick={addAdditionalClause}
                    disabled={!newClauseTitle.trim() || !newClauseText.trim()}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar ao Contrato
                  </button>
                </div>

                {/* List of Additional Clauses */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Cláusulas no Contrato ({additionalClauses.length})</h3>
                  {additionalClauses.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Nenhuma cláusula personalizada.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {additionalClauses.map((clause) => (
                        <div
                          key={clause.id}
                          className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm group relative"
                        >
                          <button
                            onClick={() => removeAdditionalClause(clause.id)}
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 transition-colors"
                            title="Remover Cláusula"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <h4 className="font-bold text-slate-900 dark:text-white mb-1 pr-6">{clause.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{clause.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
