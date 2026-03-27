import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { logoBase64 } from './logoBase64';
import { iconBase64 } from './iconBase64';

const pdfMakeInstance = (pdfMake as any).createPdf ? pdfMake : (pdfMake as any).default || pdfMake;

if (typeof pdfMakeInstance.addVirtualFileSystem === 'function') {
  pdfMakeInstance.addVirtualFileSystem(pdfFonts);
} else {
  pdfMakeInstance.vfs = (pdfFonts as any).pdfMake ? (pdfFonts as any).pdfMake.vfs : (pdfFonts as any).vfs || pdfFonts;
}

export const generatePDF = (formData: any, table41Data: any[], table41Headers: any, additionalClauses: { id: string; title: string; text: string }[] = []): Promise<{ base64: string, fileName: string }> => {
  return new Promise((resolve, reject) => {
    const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 90, 40, 60],
    header: function() {
      return {
        columns: [
          {
            image: logoBase64,
            width: 120,
            margin: [40, 30, 0, 0]
          },
          {
            text: 'A GENTE CUIDA\nDO SEU CONDOMÍNIO',
            color: '#2b82c9',
            bold: true,
            alignment: 'right',
            margin: [0, 35, 40, 0],
            fontSize: 10
          }
        ]
      };
    },
    footer: function() {
      return {
        margin: [40, 10, 40, 0],
        stack: [
          {
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#001f3f' }]
          },
          {
            columns: [
              {
                columns: [
                  { image: iconBase64, width: 15, margin: [0, 2, 0, 0] },
                  { text: 'selladm.com.br', margin: [5, 4, 0, 0], fontSize: 9, color: '#001f3f' }
                ],
                width: 'auto'
              },
              {
                text: 'atendimento@selladm.com.br',
                alignment: 'center',
                fontSize: 9,
                color: '#001f3f',
                margin: [0, 4, 0, 0]
              },
              {
                text: '(11) 3796-0203',
                alignment: 'right',
                fontSize: 9,
                color: '#001f3f',
                margin: [0, 4, 0, 0]
              }
            ],
            margin: [0, 5, 0, 0]
          }
        ]
      };
    },
    content: [
      { text: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS - QUADRO RESUMO', style: 'header' },
      { text: 'ADMINISTRAÇÃO DE CONDOMÍNIOS/ASSOCIAÇÕES E OUTRAS AVENÇAS\n\n', style: 'header' },
      
      { text: 'A partir de agora denominado como CONDOMÍNIO:', style: 'boldText' },
      {
        style: 'tableExample',
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: [
                  { text: `${formData.nomeCondominio ? `CONDOMÍNIO ${formData.nomeCondominio.toUpperCase()}` : 'CONDOMÍNIO'} – CNPJ/MF: ${formData.cnpjCondominio || '____________________'}\n`, bold: true },
                  { text: `Endereço: `, bold: true }, `${formData.enderecoCondominio || '____________________________________________________'}\n`,
                  { text: `Representada Síndico (a): `, bold: true }, `${formData.nomeSindico || '____________________'} `, { text: `– CPF/CNPJ: `, bold: true }, `${formData.cpfSindico || '____________________'}`,
                  ...(formData.cpfSindico.replace(/\\D/g, '').length > 11 ? [{ text: ` – Representante: `, bold: true }, `${formData.representanteSindico || '____________________'}`] : []),
                  '\n',
                  { text: `Telefone: `, bold: true }, `${formData.telefoneSindico || '____________________'} `, { text: `E-mail: `, bold: true }, `${formData.emailSindico || '____________________'}`
                ],
                margin: [5, 5, 5, 5]
              }
            ]
          ]
        }
      },

      { text: '\nA partir de agora denominada como ADMINISTRADORA:', style: 'boldText' },
      {
        style: 'tableExample',
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: [
                  { text: 'SELL ADMINISTRADORA DE CONDOMÍNIOS LTDA - CNPJ: 14.804.150/0001-62\n', bold: true },
                  { text: 'Endereço: ', bold: true }, 'Av. Pompéia, 723, São Paulo/SP, 05023-000\n',
                  { text: 'Representada por seu sócio: ', bold: true }, 'Roberto Silva, inscrito no CPF 940.314.958-20\n',
                  { text: 'Telefone: ', bold: true }, '(11) 3796-0203 - ', { text: 'E-mail: ', bold: true }, 'atendimento@selladm.com.br'
                ],
                margin: [5, 5, 5, 5]
              }
            ]
          ]
        }
      },

      { text: '\nPRAZOS E VALORES:', style: 'boldText' },
      {
        style: 'tableExample',
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: [
                  { text: 'Data-base: ', bold: true }, `${formData.dataBase || '___/___/____'}\n`,
                  { text: 'Índice de reajuste: ', bold: true }, `${formData.indiceReajuste} `, { text: '– Periodicidade: ', bold: true }, 'Anual\n',
                  { text: 'Data de pagamento: ', bold: true }, 'Até o dia 10 do mês da prestação de serviços\n',
                  { text: 'Valor da Prestação de serviço: ', bold: true }, `${formData.valorPrestacao || 'R$ ___________'}`
                ],
                margin: [5, 5, 5, 5]
              }
            ]
          ]
        }
      },

      { text: '\nPelo presente instrumento, as partes acima qualificadas têm entre si justo e contratado as seguintes cláusulas:\n\n' },

      {
        style: 'tableExample',
        table: {
          widths: ['*'],
          body: [
            [{ text: 'CLÁUSULA 1 – DO OBJETO, VALOR, PAGAMENTO E REAJUSTE', bold: true, margin: [5, 5, 5, 5] }]
          ]
        }
      },

      { text: '\n1.1. Objeto - O objeto do presente contrato é a prestação de serviços especializados de administração de condomínio, associação e outras avenças, por parte da ADMINISTRADORA em favor do CONDOMÍNIO.\n\n' },
      { text: '1.2. Valor - Pelos serviços ora contratados, abrangidos no presente instrumento particular, o CONDOMÍNIO pagará mensalmente à ADMINISTRADORA a importância descrita no quadro resumo deste contrato. No preço convencionado estão previstos/inclusos todos os encargos, taxas, tributos e impostos exigidos por lei, com exceção das previsões específicas presentes neste contrato.\n\n' },
      { text: '1.3. Pagamento - O pagamento convencionado deverá ser efetuado até, no máximo, a data expressamente indicada no quadro resumo deste contrato, após a emissão da Nota Fiscal Eletrônica por parte da ADMINISTRADORA. O CONDOMÍNIO autoriza que todos os valores devidos à mesma, sejam por ela debitados de sua conta bancária, inclusive os referentes a reembolsos e os de consequência deste contrato. Em caso de não efetivação do pagamento na data convencionada, por procedência do CONDOMÍNIO, acarretará o pagamento de multa (2%), juros (1% ao mês) e atualização monetária (TJSP), sem prejuízo de outras cominações legais.\n\n' },
      { text: '1.4. Reajuste – O contrato será reajustado anualmente (a cada 12 meses) a partir da data-base, com o índice que consta no quadro resumo deste.\n\n' },
      { text: '1.4.1. Caso as partes presencie desequilíbrio contratual, quanto a incomum variação do índice de correção monetária escolhido, que consta no quadro resumo deste, o presente contrato poderá ter seu valor reajustado por outro índice econômico, por vontade das partes, a qualquer tempo, através de aditivo contratual expressamente firmado, ou, por aceite expresso do CONDOMÍNIO, através de qualquer um dos meios de comunicação habitual das partes.\n\n' },

      {
        style: 'tableExample',
        table: {
          widths: ['*'],
          body: [
            [{ text: 'CLÁUSULA 2 – DO PRAZO, RESCISÃO CONTRATUAL E TRANSFERÊNCIA DA ADMINISTRAÇÃO', bold: true, margin: [5, 5, 5, 5] }]
          ]
        }
      },

      { text: `\n${formData.clausula21}\n\n` },
      { text: `${formData.clausula22}\n\n` },
      { text: '2.3. Transferência de Administração - A ADMINISTRADORA se obriga a entregar sob protocolo ao CONDOMÍNIO, no prazo de dez dias úteis contados da data da comunicação de rescisão: o cadastro de condôminos, indicando as unidades e respectivas frações ideais para efeito de rateio de despesas, livro de registro de empregados e última folha de pagamento dos funcionários do CONDOMÍNIO. E no prazo de vinte dias úteis todos os demais documentos pertencentes ao mesmo.\n\n' },

      {
        style: 'tableExample',
        table: {
          widths: ['*'],
          body: [
            [{ text: 'CLÁUSULA 3 – DOS SERVIÇOS PRESTADOS PELA ADMINISTRADORA', bold: true, margin: [5, 5, 5, 5] }]
          ]
        }
      },

      { text: '\n3.1. Cadastro de Condôminos - Mediante listagem que lhe for fornecida, providenciar a implantação de cadastro de condôminos, medida que permitirá as emissões de avisos-recibos, comunicados em geral e relatórios controles. As alterações subsequentes serão procedidas mediante a comunicação expressa do (a) Síndico (a), ou diretamente pelo próprio condômino, que fornecerá os dados necessários, ou então a comunicação do condômino ou possuidor adquirente da unidade, que exibirá o título de propriedade para as anotações devidas.\n\n' },
      { text: '3.2. Assembleias Gerais – Emitir as convocações para as Assembleias Gerais Ordinárias e Extraordinárias, com as respectivas Ordens do Dia, observadas as disposições legais e da Convenção Condominial; Presença e assessoramento às Assembleias Gerais, atribuído como serviços especiais, mediante solicitação direta ou tácita do (a) Síndico (a); poderá elaborar as atas das Assembleias Gerais, em caso de seu representante ser membro da mesa de Assembleia, e posterior remessa da Ata a todos os condôminos; Registro em Cartório de títulos e documentos das Atas lavradas em livro próprio.\n\n' },
      { text: '3.3. Previsão Orçamentária - Assessoramento na elaboração de previsões orçamentárias, que serão submetidas à apreciação da Assembleia Geral; eventuais despesas extraordinárias aprovadas pelo CONDOMÍNIO, emergenciais ou não, e não inclusas na previsão orçamentária aprovada, serão objeto de rateio específico, a ser submetido à aprovação ou ratificação da Assembleia Geral, conforme o caso.\n\n' },
      { text: '3.4. Contas a Receber - A ADMINISTRADORA, através do seu departamento de contas a receber, efetuará o rateio e cobrança das previsões orçamentárias e demais receitas ordinárias e extraordinárias do CONDOMÍNIO, aprovadas em Assembleias ou mesmo as determinadas pelo (a) Síndico (a), mediante o envio antecipado dos avisos de cobrança bancária aos condôminos, da forma física ou por meio eletrônico.\n\n' },
      { text: `3.5. Cobrança de Cotas Atrasadas - As cotas condominiais, rateios extraordinários e multas por infração regulamentar vencidos e não pagos serão cobrados administrativamente pela ADMINISTRADORA, no prazo de até 30 (trinta) dias contados da data original do vencimento, preferencialmente através de lembretes de cobrança, nos e-mails dos condôminos inadimplentes cadastrados no seu sistema. Os valores em aberto serão acrescidos de multa, juros e correção monetária. Além disso, após ${formData.diasCobrancaAdvocacia || '30'} dias do vencimento, a cobrança será direcionada a um escritório de advocacia, que utilizará de todos os meios para a efetiva cobrança de sua exclusiva responsabilidade, e serão cobrados honorários advocatícios sobre o valor do débito atualizado, com juros e multa, independente de ação judicial, ao condômino ou possuidor que der causa. O representante legal do CONDOMÍNIO deverá dar ciência dos procedimentos de cobranças aos seus condôminos ou possuidores das unidades autônomas.\n\n` },
      { text: '3.6. Prestação de Contas – Mensalmente, será elaborada uma prestação de contas, na qual estará discriminada, detalhadamente, toda a movimentação financeira do CONDOMÍNIO - receitas e despesas – tudo em rigorosa conformidade com os comprovantes autorizados pelo (a) Síndico (a). Até o 20º dia do mês seguinte ao de referência, será remetida ao CONDOMÍNIO, de forma digital, pasta contendo toda a documentação comprobatória do período, para a devida conferência, aprovação ou parecer.\n\n' },
      { text: '3.7. Pagamento das Contas do Condomínio - As contas do condomínio serão pagas mediante a prévia e expressa autorização do síndico, exceto as decorrentes de procedimentos rotineiros, tais como: folha de pagamento e encargos sociais, contas de consumo de água, energia elétrica, gás, impostos e taxas, bem como as demais despesas previamente autorizadas por contrato.\n\n' },
      { text: '3.7.1. O CONDOMÍNIO deverá formalizar por escrito, com antecedência mínima de 2 dias úteis, quando quiser suspender o pagamento de serviços já contratados ou autorizar pagamentos não rotineiros.\n\n' },
      { text: '3.7.2. A ADMINISTRADORA responde por acréscimos a que der causa, embora fique eximida de responsabilidade por multas e penalidades, quando, por indisponibilidade de caixa do CONDOMÍNIO ou remessa de documentos pelo CONDOMÍNIO, ou a sua autorização de pagamento, sem o tempo hábil previsto, deixar de liquidar obrigações ou efetuar pagamentos após o vencimento.\n\n' },
      { text: '3.7.3. A ADMINISTRADORA não se responsabiliza por encargos tributários, previdenciários, trabalhistas, penalidades e sanções previstas em contratos de qualquer natureza, nos quais figure como parte o CONDOMÍNIO, derivados de pagamentos sem observância da legislação vigente, rescisões e outras ações, autorizadas pelo CONDOMÍNIO, sem ou contra sua orientação legal.\n\n' },
      { text: '3.7.4. Todas as contas relacionadas a consumos de água, gás ou qualquer outro valor individualizado por unidade autônoma, poderão serem incluídos nos boletos mensais encaminhados aos condôminos, entretanto, o CONDOMÍNIO ou empresa prestadora de tal serviço ao CONTRANTE, deverá encaminhar o arquivo digital em TXT, dentro do tempo hábil para o seu processamento e inclusão, expressamente e comprovadamente por meio de e-mail. A ADMINISTRADORA não se responsabiliza pelo conteúdo encaminhado, nem pela integridade e/ou verossimilhança dos dados fornecidos, de única responsabilidade do CONDOMÍNIO ou da empresa prestadora de tal serviço, bem como, não se responsabiliza por qualquer e eventual retificação de dados informados posteriormente ao seu lançamento original ou sem tempo hábil para tal, seja solicitado pelo CONTRATANTE ou pela empresa prestadora desses serviços.\n\n' },
      { text: '3.8. Seguro Contra Incêndio e Responsabilidade Civil – A responsabilidade pela contratação do seguro obrigatório de incêndio e de responsabilidade civil é exclusiva do (a) Síndico (a), representante legal do CONDOMÍNIO (artigo 1348, inciso IX, do Código Civil). A ADMINISTRADORA, não obstante, poderá auxiliar na obtenção de cotação das propostas de seguros para o CONDOMÍNIO, caso as Partes tenham prévia e oportunamente assim ajustado.\n\n' },
      { text: '3.9. Funcionários –Orientar e recolher nos respectivos prazos todos os encargos devidos, mantendo e apresentando, sempre em dia, os livros e documentos exigidos.\n\n' },
      { text: '3.9.1. Havendo a terceirização de mão-de-obra no condomínio, caberá a empresa prestadora destes serviços à responsabilidade pelo pagamento dos salários, adiantamentos, benefícios, recolhimento dos encargos trabalhistas e previdenciários, impostos, taxas, contribuições e demais obrigações assumidas pelas partes no específico contrato. Neste caso, não respondendo a ADMINISTRADORA, por nenhuma consequência que esta modalidade de serviço vier a acarretar ao CONDOMÍNIO, sejam elas de ordem trabalhista, civil, tributária ou mesmo criminais direta ou indiretamente.\n\n' },
      { text: '3.10. Pagamento dos Funcionários - Efetuar o pagamento do pessoal, nas bases salariais e de acordo com a legislação vigente, até o 5º (quinto) dia útil do mês seguinte ao vencido e adiantamento de 40% no 15º dia após a data do pagamento da folha. Os pagamentos correspondentes às horas extras, prêmios e adicionais extraordinários, bem como o gozo de férias, serão previamente autorizados pelo CONDOMÍNIO; O pagamento das verbas salariais, indenizatórios entre outras devidas aos empregados, dar-se-á por meio de crédito em conta corrente/salário do respectivo empregado, na forma indicada pela ADMINISTRADORA, salvo circunstância especial que impeça tal procedimento; O vale-alimentação, refeição e o vale-transporte serão pagos através de crédito eletrônico em cartões pessoais e individuais aos funcionários, por empresa terceirizada especializada, cujo custo pelo serviço é de responsabilidade do CONDOMÍNIO.\n\n' },
      { text: '3.11. Orçamentos – Colaborar na coleta de orçamentos e pesquisa de preços para a execução de obras e serviços, aquisição de equipamentos e materiais em geral, salvo os produtos e serviços que dependam de conhecimento e orientação técnica, para as quais será necessário contratar um profissional habilitado; A pedido do (a) síndico (a), a ADMINISTRADORA poderá fazer a cotação de fornecedores para a execução de serviços no CONDOMÍNIO, contudo não se responsabilizará pela contratação em si, nem poderá fiscalizar nem garantir o cumprimento das obrigações desses terceiros contratados, cabendo ao CONDOMÍNIO a análise dos riscos da contratação da empresa postulante dos serviços, bem como a decisão final por sua contratação.\n\n' },
      { text: '3.12. Expedição de Circulares – Poderá ficar a cargo da ADMINISTRADORA, a redação e encaminhamento aos condôminos, das circulares e editais que o síndico e as assembleias por bem determinar.\n\n' },
      { text: '3.13. Guarda de Documentos – Todos os documentos do CONDOMÍNIO constantes da pasta de prestação de contas mensal, não exigíveis em caso de fiscalização de órgãos competentes ou demandas trabalhistas, serão mantidos nos arquivos da ADMINISTRADORA somente até a finalização da pasta digital. Após decorrido este prazo, os mesmos serão devolvidos ao CONDOMÍNIO.\n\n' },
      { text: '3.14. Dos Serviços Jurídicos - Caso o CONDOMÍNIO necessite de serviços jurídicos, a ADMINISTRADORA apresentará relação de escritórios de advogados especialistas em diversas áreas, ficando a cargo do CONDOMÍNIO a escolha do escritório que lhe prestará os serviços. Os honorários do advogado e os termos da contratação serão tratados entre o representante legal do escritório escolhido e o representante legal do CONDOMÍNIO, que lhes outorgará procuração específica para a eventual medida extrajudicial ou judicial. A ADMINISTRADORA não possui qualquer responsabilidade sobre os serviços prestados pelo escritório de advogados indicado.\n\n' },

      {
        style: 'tableExample',
        table: {
          widths: ['*'],
          body: [
            [{ text: 'CLÁUSULA 4 – DAS DISPOSIÇÕES GERAIS.', bold: true, margin: [5, 5, 5, 5] }]
          ]
        }
      },

      { text: '\n4.1. A título de reembolso, serão repassados ao CONDOMINIO todos os custos e despesas relacionadas com correio, cópias, impressões, envelopes, material de escritório, tarifas/taxas bancárias, e outras despesas decorrentes de atos praticados pela ADMINISTRADORA em benefício ao CONDOMINIO. Somado a isso, os demais itens previstos no Referencial de Serviços Especiais descritos abaixo, quando efetivados, serão pagos à ADMINISTRADORA, conforme segue:\n\n' },

      {
        style: 'tableExample',
        table: {
          widths: ['*', '*'],
          body: [
            [{ text: table41Headers.servico, bold: true, fillColor: '#eeeeee' }, { text: table41Headers.valor, bold: true, fillColor: '#eeeeee' }],
            ...table41Data.map(row => [
              row.servico, 
              row.tipo === 'valor' ? row.valor : (row.tipo === 'isento' ? 'ISENTO' : row.valor)
            ])
          ]
        }
      },

      { text: '\n4.1.1. Serão repassadas mediante reembolso as eventuais despesas de aluguéis de máquinas, contratação de operadores, telões etc., que demandarem despesas, e que vierem a serem solicitadas pelo CONDOMÍNIO, de modo que, não faça parte do escopo ou quadro de materiais que a ADMINISTRADORA possua para a prestação de serviços.\n\n' },
      { text: '4.1.2. Fica claro nesta oportunidade, que os valores previstos nesta tabela referencial, ficarão sujeitos ao reajuste pelo índice econômico escolhido no quadro de resumo do preambulo.\n\n' },
      ...(formData.tipoLgpd === 'Completa' ? [
        { text: '4.2. - Considerando o tratamento de dados pessoais realizado pela ADMINISTRADORA, seus funcionários, representantes, contratados, subcontratados ou outros, em nome e a mando do CONDOMINIO, a ADMINISTRADORA deve garantir que qualquer terceiro envolvido no tratamento em seu nome, em razão disto, cumprirá integralmente aquilo definido pela Lei Geral de Proteção de Dados (“LGPD” - Lei nº 13.709/18). A ADMINISTRADORA deverá observar as diretrizes da legislação aplicável a matérias relacionadas à proteção de dados pessoais e privacidade, principalmente no que se refere ao tratamento de informações pessoais relacionados ao objeto da contratação do presente, inclusive nas seguintes condições:\n\n' },
        { text: '4.2.1. A ADMINISTRADORA assegura que os dados pessoais e/ou sensíveis tratados em decorrência deste contrato não serão acessados, compartilhados ou transferidos a terceiros sem a autorização prévia e por escrito do CONDOMINIO. Caso o CONDOMINIO autorize estas operações de tratamento, a ADMINISTRADORA deverá garantir que tais terceiros se obriguem, por escrito, a assegurar a mesma proteção aos dados pessoais estabelecida neste contrato. A ADMINISTRADORA será responsável por todas as ações e omissões realizadas por tais terceiros relativas ao tratamento dos referidos dados pessoais, que tiver realizado.\n\n' },
        { text: '4.2.2. Caso o ADMINISTRADORA identificar a ocorrência de um incidente de segurança, deverá notificar o CONDOMINIO em até 48h (quarenta e oito horas), por escrito. A notificação deverá conter informações detalhadas contendo, no mínimo, a descrição do ocorrido e de sua causa, a natureza dos dados afetados, informações sobre os titulares envolvidos, quais os riscos relacionados e os possíveis impactos aos titulares, as ações adotadas para a prevenção e as medidas técnicas e administrativas para a mitigação dos efeitos e dos prejuízos, para que a ADMINISTRADORA possa cumprir com eventuais exigências legais.\n\n' },
        { text: '4.2.3. A ADMINISTRADORA deverá, sob o comando do CONDOMINIO, ou quando da extinção do vínculo contratual e obrigacional existente, devolver integralmente os dados pessoais e excluí-los definitiva e permanentemente, salvo se aplicáveis obrigações legais ou regulatórias que determinem a continuidade do seu armazenamento, dentro do prazo legal estabelecido.\n\n' },
        { text: '4.2.4. A ADMINISTRADORA será responsável por quaisquer reclamações, perdas e danos, que venha a sofrer o CONDOMINIO, além de multas, inclusive as aplicadas pelas autoridades competentes, e qualquer outra situação que exija o pagamento de valores pecuniários ou acarrete prejuízos, quando os eventos decorrerem de: a-) descumprimento, pela ADMINISTRADORA, ou por terceiros por ela contratados, das disposições expostas neste instrumento; b-) qualquer incidente relacionado aos dados pessoais tratados pela ADMINISTRADORA ou de terceiros por ela contratados, referentes a este contrato, ou c-) qualquer ato da ADMINISTRADORA ou de terceiros por ela contratados, em discordância com a legislação aplicável à privacidade e proteção de dados.\n\n' },
        { text: '4.2.5. A ADMINISTRADORA não deverá realizar quaisquer ações proibidas pela Lei Federal nº 12.846/2013, Lei Federal nº 9.613/1998, e as demais normas aplicáveis que tratem das práticas de atos contra a administração pública, corrupção, lavagem de dinheiro, evasão fiscal, improbidade administrativa, financiamento ao terrorismo, bem como outras normas relacionadas (“Leis Anticorrupção”). Ademais, a ADMINISTRADORA não deve fazer pagamentos, oferecer ou transferir quaisquer bens ou direitos, bem como influenciar indevidamente qualquer servidor, funcionário ou empregado da administração pública direta ou indireta, qualquer membro de um partido político, ou candidato a um cargo político, ainda, qualquer terceiro em desconformidade com as Leis Anticorrupção ou a título de compliance.\n\n' },
        { text: '4.2.6. A ADMINISTRADORA declaram e garantem que em todas as suas atividades relacionadas ao Contrato bem como em todas as suas atividades em geral e naquelas relacionadas ao seu grupo econômico, bem como seus respectivos diretores, conselheiros, administradores, colaboradores, funcionários, empregados ou beneficiários, consultores ou outros prepostos não tomaram ou tomarão qualquer medida que viole as Leis Anticorrupção e não pagaram, ofereceram, prometeram ou autorizaram, nem pagarão, oferecerão, prometerão, ou autorizarão o pagamento de dinheiro, bens ou direitos, direta ou indiretamente, a qualquer servidor, funcionário ou empregado da administração pública direta ou indireta, em qualquer caso com a finalidade de: influenciar qualquer ato ou decisão de tal pessoa em sua capacidade oficial; induzir tal pessoa a agir (seja por ação ou omissão) em violação de seu dever legal; obter qualquer vantagem indevida; ou induzir tal pessoa a usar a sua influência para afetar ou influenciar qualquer ato ou decisão de uma autoridade competente a título de compliance.\n\n' },
        { text: '4.2.7. O não cumprimento pelas Pastes das Leis Anticorrupção a de compliance será considerada uma infração grave ao Contrato e conferirá à Parte inocente o direito de rescindir imediatamente o Contrato, assumindo a Parte infratora a exclusiva responsabilidade pelas perdas e danos decorrentes de tal infração, em conformidade com as normas aplicáveis.\n\n' }
      ] : [
        { text: '4.2. As partes, por si próprias, os seus empregados e residentes, comprometem-se a agir neste contrato de acordo com a atual Legislação sobre Proteção de Dados Pessoais (LGPD) e as decisões dos órgãos reguladores e de supervisão sobre o assunto, especialmente a Lei 13.709/2018. Além disso, a PARTE CONTRATANTE declara que detém todas as autorizações, licenças, permissões, concessões, consentimentos, direitos e/ou garantias legalmente necessários ("Autorizações de Tratamento") para o propósito de autorizar o tratamento dos Dados Pessoais por si fornecidos e de acordo com as suas diretrizes, declarando também que tais Dados Pessoais foram obtidos legalmente, em estrita conformidade com todas as leis aplicáveis.\n\n' }
      ]),
      { text: '4.3. O presente contrato e prestação de serviços não estabelecerá qualquer relação ou vínculo empregatício entre o CONDOMÍNIO e os empregados da ADMINISTRADORA, respondendo a mesma com exclusividade pelas eventuais reclamações trabalhistas ajuizadas por seus funcionários ou profissionais envolvidos na prestação dos serviços.\n\n' },
      { text: '4.4. As partes declaram expressamente substituídos todos os instrumentos ou acordos anteriormente celebrados, que possuam o mesmo objeto do presente contrato, de modo que a nova relação jurídico-comercial (condições, procedimentos, valores etc.), decorrente dos instrumentos antigos, passa a ser regida pelo disposto no presente instrumento a contar da data de início da vigência deste contrato.\n\n' },
      { text: '4.5. Fica expressa e irrevogavelmente estabelecido que a tolerância ou o não exercício pelas partes, de direitos garantidos em lei ou por este contrato, não significará renúncia ou novação, podendo as partes exercê-los a qualquer momento.\n\n' },
      { text: `4.6. As partes elegem o foro da cidade de ${formData.tipoForo === 'Personalizado' && formData.cidadeForo ? formData.cidadeForo : 'São Paulo'}, Estado de São Paulo, para dirimir quaisquer questões provenientes deste instrumento, renunciando a qualquer outro, por mais privilegiado que seja.\n\n` },
      
      ...(additionalClauses.length > 0 ? [
        { text: 'CLÁUSULAS ADICIONAIS\n\n', style: 'boldText', color: '#059669' },
        ...additionalClauses.map((clause, index) => ({
          text: [
            { text: `${index + 5}. ${clause.title}: `, bold: true },
            { text: `${clause.text}\n\n` }
          ]
        }))
      ] : []),

      { text: '4.7. As PARTES declaram que estarem justos e contratados, assinam o presente Instrumento Particular de Contrato de Prestação de Serviços por meio eletrônico, com o uso da plataforma Clicksign (i.e., https://www.clicksign.com/), nos termos da Medida Provisória nº 2.200-2/2001. As PARTES e os Intervenientes anuentes reconhecem como válidas as assinaturas realizadas inclusive com certificados não emitidos pela Infraestrutura de Chaves Públicas Brasileira (i.e., ICP-Brasil), nos termos do Artigo 10, Parágrafo 2º da Medida Provisória nº 2.200-2/2001, quando enviadas para os E-mails encaminhados neste Contrato. Este Contrato produz efeitos para todas as PARTES e para os Intervenientes Anuentes a partir da data indicada no QUADRO RESUMO, ainda que uma ou mais PARTES realizem a assinatura em data posterior, para que surtam seus legais e jurídicos efeitos.\n\n' },

      { text: '____________________________________________________', alignment: 'center', margin: [0, 40, 0, 0] },
      { text: formData.nomeCondominio || 'CONTRATANTE', alignment: 'center' },
      { text: '\n____________________________________________________', alignment: 'center', margin: [0, 40, 0, 0] },
      { text: 'Sell Administradora de Condomínios', alignment: 'center' },
      { text: 'CONTRATADA', alignment: 'center' },
    ],
    styles: {
      header: { fontSize: 12, bold: true, alignment: 'center' },
      boldText: { bold: true, margin: [0, 5, 0, 2] },
      tableExample: { margin: [0, 5, 0, 15] }
    },
    defaultStyle: {
      fontSize: 10,
      lineHeight: 1.3,
      alignment: 'justify'
    }
  };
  
    const fileName = formData.nomeCondominio
      ? `Contrato_${formData.nomeCondominio.replace(/\s+/g, '_')}.pdf`
      : 'Contrato_Sell_Administradora.pdf';
      
    const pdfDocGenerator = pdfMakeInstance.createPdf(docDefinition as any);
    
    pdfDocGenerator.getBase64((data: string) => {
      resolve({ base64: data, fileName });
    });
  });
};
