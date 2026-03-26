import { Document, Packer, Paragraph, HeadingLevel, AlignmentType, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, Header, Footer, ImageRun } from 'docx';
import { saveAs } from 'file-saver';
import { logoBase64 } from './logoBase64';
import { iconBase64 } from './iconBase64';

export const generateWord = async (formData: any, table41Data: any[], table41Headers: any, additionalClauses: { id: string; title: string; text: string }[] = []) => {
  const createBoldParagraph = (text: string) => new Paragraph({ children: [new TextRun({ text, bold: true })] });
  const createParagraph = (text: string) => new Paragraph({ text, alignment: AlignmentType.JUSTIFIED });
  
  const createBoxedText = (text: string) => new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })],
            margins: { top: 100, bottom: 100, left: 100, right: 100 }
          })
        ]
      })
    ]
  });

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1500,
            right: 1000,
            bottom: 1500,
            left: 1000,
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: Uint8Array.from(atob(logoBase64.split(',')[1]), c => c.charCodeAt(0)),
                              transformation: {
                                width: 160,
                                height: 73,
                              },
                              type: "png",
                            }),
                          ],
                        }),
                      ],
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                            new TextRun({ text: "A GENTE CUIDA", bold: true, size: 20, color: "2b82c9" }),
                          ],
                        }),
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                            new TextRun({ text: "DO SEU CONDOMÍNIO", bold: true, size: 20, color: "2b82c9" }),
                          ],
                        }),
                      ],
                      verticalAlign: "center",
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({ text: "" }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 6, color: "001f3f" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: Uint8Array.from(atob(iconBase64.split(',')[1]), c => c.charCodeAt(0)),
                              transformation: {
                                width: 20,
                                height: 20,
                              },
                              type: "png",
                            }),
                            new TextRun({ text: "  selladm.com.br", size: 20, color: "001f3f" }),
                          ],
                        }),
                      ],
                      margins: { top: 100 },
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({ text: "atendimento@selladm.com.br", size: 20, color: "001f3f" }),
                          ],
                        }),
                      ],
                      margins: { top: 100 },
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                            new TextRun({ text: "(11) 3796-0203", size: 20, color: "001f3f" }),
                          ],
                        }),
                      ],
                      margins: { top: 100 },
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        new Paragraph({ children: [new TextRun({ text: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS - QUADRO RESUMO", bold: true })], alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [new TextRun({ text: "ADMINISTRAÇÃO DE CONDOMÍNIOS/ASSOCIAÇÕES E OUTRAS AVENÇAS", bold: true })], alignment: AlignmentType.CENTER }),
        new Paragraph({ text: "" }),
        
        createBoldParagraph("A partir de agora denominado como CONDOMÍNIO:"),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: `${formData.nomeCondominio ? `CONDOMÍNIO ${formData.nomeCondominio.toUpperCase()}` : 'CONDOMÍNIO'} – CNPJ/MF: ${formData.cnpjCondominio || '____________________'}`, bold: true })] }),
                    new Paragraph({ children: [new TextRun({ text: `Endereço: `, bold: true }), new TextRun({ text: `${formData.enderecoCondominio || '____________________________________________________'}` })] }),
                    new Paragraph({ children: [
                      new TextRun({ text: `Representada Síndico (a): `, bold: true }), 
                      new TextRun({ text: `${formData.nomeSindico || '____________________'} ` }), 
                      new TextRun({ text: `– CPF/CNPJ: `, bold: true }), 
                      new TextRun({ text: `${formData.cpfSindico || '____________________'}` }),
                      ...(formData.cpfSindico.replace(/\\D/g, '').length > 11 ? [
                        new TextRun({ text: ` – Representante: `, bold: true }),
                        new TextRun({ text: `${formData.representanteSindico || '____________________'}` })
                      ] : [])
                    ] }),
                    new Paragraph({ children: [new TextRun({ text: `Telefone: `, bold: true }), new TextRun({ text: `${formData.telefoneSindico || '____________________'} ` }), new TextRun({ text: `E-mail: `, bold: true }), new TextRun({ text: `${formData.emailSindico || '____________________'}` })] }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                })
              ]
            })
          ]
        }),
        new Paragraph({ text: "" }),

        createBoldParagraph("A partir de agora denominada como ADMINISTRADORA:"),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: "SELL ADMINISTRADORA DE CONDOMÍNIOS LTDA - CNPJ: 14.804.150/0001-62", bold: true })] }),
                    new Paragraph({ children: [new TextRun({ text: "Endereço: ", bold: true }), new TextRun({ text: "Av. Pompéia, 723, São Paulo/SP, 05023-000" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Representada por seu sócio: ", bold: true }), new TextRun({ text: "Roberto Silva, inscrito no CPF 940.314.958-20" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Telefone: ", bold: true }), new TextRun({ text: "(11) 3796-0203 - " }), new TextRun({ text: "E-mail: ", bold: true }), new TextRun({ text: "atendimento@selladm.com.br" })] }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                })
              ]
            })
          ]
        }),
        new Paragraph({ text: "" }),

        createBoldParagraph("PRAZOS E VALORES:"),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: "Data-base: ", bold: true }), new TextRun({ text: `${formData.dataBase || '___/___/____'}` })] }),
                    new Paragraph({ children: [new TextRun({ text: "Índice de reajuste: ", bold: true }), new TextRun({ text: `${formData.indiceReajuste} ` }), new TextRun({ text: "– Periodicidade: ", bold: true }), new TextRun({ text: "Anual" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Data de pagamento: ", bold: true }), new TextRun({ text: "Até o dia 10 do mês da prestação de serviços" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Valor da Prestação de serviço: ", bold: true }), new TextRun({ text: `${formData.valorPrestacao || 'R$ ___________'}` })] }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                })
              ]
            })
          ]
        }),
        new Paragraph({ text: "" }),

        createParagraph("Pelo presente instrumento, as partes acima qualificadas têm entre si justo e contratado as seguintes cláusulas:"),
        new Paragraph({ text: "" }),

        createBoxedText("CLÁUSULA 1 – DO OBJETO, VALOR, PAGAMENTO E REAJUSTE"),
        new Paragraph({ text: "" }),

        createParagraph("1.1. Objeto - O objeto do presente contrato é a prestação de serviços especializados de administração de condomínio, associação e outras avenças, por parte da ADMINISTRADORA em favor do CONDOMÍNIO."),
        new Paragraph({ text: "" }),
        createParagraph("1.2. Valor - Pelos serviços ora contratados, abrangidos no presente instrumento particular, o CONDOMÍNIO pagará mensalmente à ADMINISTRADORA a importância descrita no quadro resumo deste contrato. No preço convencionado estão previstos/inclusos todos os encargos, taxas, tributos e impostos exigidos por lei, com exceção das previsões específicas presentes neste contrato."),
        new Paragraph({ text: "" }),
        createParagraph("1.3. Pagamento - O pagamento convencionado deverá ser efetuado até, no máximo, a data expressamente indicada no quadro resumo deste contrato, após a emissão da Nota Fiscal Eletrônica por parte da ADMINISTRADORA. O CONDOMÍNIO autoriza que todos os valores devidos à mesma, sejam por ela debitados de sua conta bancária, inclusive os referentes a reembolsos e os de consequência deste contrato. Em caso de não efetivação do pagamento na data convencionada, por procedência do CONDOMÍNIO, acarretará o pagamento de multa (2%), juros (1% ao mês) e atualização monetária (TJSP), sem prejuízo de outras cominações legais."),
        new Paragraph({ text: "" }),
        createParagraph("1.4. Reajuste – O contrato será reajustado anualmente (a cada 12 meses) a partir da data-base, com o índice que consta no quadro resumo deste."),
        new Paragraph({ text: "" }),
        createParagraph("1.4.1. Caso as partes presencie desequilíbrio contratual, quanto a incomum variação do índice de correção monetária escolhido, que consta no quadro resumo deste, o presente contrato poderá ter seu valor reajustado por outro índice econômico, por vontade das partes, a qualquer tempo, através de aditivo contratual expressamente firmado, ou, por aceite expresso do CONDOMÍNIO, através de qualquer um dos meios de comunicação habitual das partes."),
        new Paragraph({ text: "" }),

        createBoxedText("CLÁUSULA 2 – DO PRAZO, RESCISÃO CONTRATUAL E TRANSFERÊNCIA DA ADMINISTRAÇÃO"),
        new Paragraph({ text: "" }),

        createParagraph(formData.clausula21),
        new Paragraph({ text: "" }),
        createParagraph(formData.clausula22),
        new Paragraph({ text: "" }),
        createParagraph("2.3. Transferência de Administração - A ADMINISTRADORA se obriga a entregar sob protocolo ao CONDOMÍNIO, no prazo de dez dias úteis contados da data da comunicação de rescisão: o cadastro de condôminos, indicando as unidades e respectivas frações ideais para efeito de rateio de despesas, livro de registro de empregados e última folha de pagamento dos funcionários do CONDOMÍNIO. E no prazo de vinte dias úteis todos os demais documentos pertencentes ao mesmo."),
        new Paragraph({ text: "" }),

        createBoxedText("CLÁUSULA 3 – DOS SERVIÇOS PRESTADOS PELA ADMINISTRADORA"),
        new Paragraph({ text: "" }),

        createParagraph("3.1. Cadastro de Condôminos - Mediante listagem que lhe for fornecida, providenciar a implantação de cadastro de condôminos, medida que permitirá as emissões de avisos-recibos, comunicados em geral e relatórios controles. As alterações subsequentes serão procedidas mediante a comunicação expressa do (a) Síndico (a), ou diretamente pelo próprio condômino, que fornecerá os dados necessários, ou então a comunicação do condômino ou possuidor adquirente da unidade, que exibirá o título de propriedade para as anotações devidas."),
        new Paragraph({ text: "" }),
        createParagraph("3.2. Assembleias Gerais – Emitir as convocações para as Assembleias Gerais Ordinárias e Extraordinárias, com as respectivas Ordens do Dia, observadas as disposições legais e da Convenção Condominial; Presença e assessoramento às Assembleias Gerais, atribuído como serviços especiais, mediante solicitação direta ou tácita do (a) Síndico (a); poderá elaborar as atas das Assembleias Gerais, em caso de seu representante ser membro da mesa de Assembleia, e posterior remessa da Ata a todos os condôminos; Registro em Cartório de títulos e documentos das Atas lavradas em livro próprio."),
        new Paragraph({ text: "" }),
        createParagraph("3.3. Previsão Orçamentária - Assessoramento na elaboração de previsões orçamentárias, que serão submetidas à apreciação da Assembleia Geral; eventuais despesas extraordinárias aprovadas pelo CONDOMÍNIO, emergenciais ou não, e não inclusas na previsão orçamentária aprovada, serão objeto de rateio específico, a ser submetido à aprovação ou ratificação da Assembleia Geral, conforme o caso."),
        new Paragraph({ text: "" }),
        createParagraph("3.4. Contas a Receber - A ADMINISTRADORA, através do seu departamento de contas a receber, efetuará o rateio e cobrança das previsões orçamentárias e demais receitas ordinárias e extraordinárias do CONDOMÍNIO, aprovadas em Assembleias ou mesmo as determinadas pelo (a) Síndico (a), mediante o envio antecipado dos avisos de cobrança bancária aos condôminos, da forma física ou por meio eletrônico."),
        new Paragraph({ text: "" }),
        createParagraph(`3.5. Cobrança de Cotas Atrasadas - As cotas condominiais, rateios extraordinários e multas por infração regulamentar vencidos e não pagos serão cobrados administrativamente pela ADMINISTRADORA, no prazo de até 30 (trinta) dias contados da data original do vencimento, preferencialmente através de lembretes de cobrança, nos e-mails dos condôminos inadimplentes cadastrados no seu sistema. Os valores em aberto serão acrescidos de multa, juros e correção monetária. Além disso, após ${formData.diasCobrancaAdvocacia || '30'} dias do vencimento, a cobrança será direcionada a um escritório de advocacia, que utilizará de todos os meios para a efetiva cobrança de sua exclusiva responsabilidade, e serão cobrados honorários advocatícios sobre o valor do débito atualizado, com juros e multa, independente de ação judicial, ao condômino ou possuidor que der causa. O representante legal do CONDOMÍNIO deverá dar ciência dos procedimentos de cobranças aos seus condôminos ou possuidores das unidades autônomas.`),
        new Paragraph({ text: "" }),
        createParagraph("3.6. Prestação de Contas – Mensalmente, será elaborada uma prestação de contas, na qual estará discriminada, detalhadamente, toda a movimentação financeira do CONDOMÍNIO - receitas e despesas – tudo em rigorosa conformidade com os comprovantes autorizados pelo (a) Síndico (a). Até o 20º dia do mês seguinte ao de referência, será remetida ao CONDOMÍNIO, de forma digital, pasta contendo toda a documentação comprobatória do período, para a devida conferência, aprovação ou parecer."),
        new Paragraph({ text: "" }),
        createParagraph("3.7. Pagamento das Contas do Condomínio - As contas do condomínio serão pagas mediante a prévia e expressa autorização do síndico, exceto as decorrentes de procedimentos rotineiros, tais como: folha de pagamento e encargos sociais, contas de consumo de água, energia elétrica, gás, impostos e taxas, bem como as demais despesas previamente autorizadas por contrato."),
        new Paragraph({ text: "" }),
        createParagraph("3.7.1. O CONDOMÍNIO deverá formalizar por escrito, com antecedência mínima de 2 dias úteis, quando quiser suspender o pagamento de serviços já contratados ou autorizar pagamentos não rotineiros."),
        new Paragraph({ text: "" }),
        createParagraph("3.7.2. A ADMINISTRADORA responde por acréscimos a que der causa, embora fique eximida de responsabilidade por multas e penalidades, quando, por indisponibilidade de caixa do CONDOMÍNIO ou remessa de documentos pelo CONDOMÍNIO, ou a sua autorização de pagamento, sem o tempo hábil previsto, deixar de liquidar obrigações ou efetuar pagamentos após o vencimento."),
        new Paragraph({ text: "" }),
        createParagraph("3.7.3. A ADMINISTRADORA não se responsabiliza por encargos tributários, previdenciários, trabalhistas, penalidades e sanções previstas em contratos de qualquer natureza, nos quais figure como parte o CONDOMÍNIO, derivados de pagamentos sem observância da legislação vigente, rescisões e outras ações, autorizadas pelo CONDOMÍNIO, sem ou contra sua orientação legal."),
        new Paragraph({ text: "" }),
        createParagraph("3.7.4. Todas as contas relacionadas a consumos de água, gás ou qualquer outro valor individualizado por unidade autônoma, poderão serem incluídos nos boletos mensais encaminhados aos condôminos, entretanto, o CONDOMÍNIO ou empresa prestadora de tal serviço ao CONTRANTE, deverá encaminhar o arquivo digital em TXT, dentro do tempo hábil para o seu processamento e inclusão, expressamente e comprovadamente por meio de e-mail. A ADMINISTRADORA não se responsabiliza pelo conteúdo encaminhado, nem pela integridade e/ou verossimilhança dos dados fornecidos, de única responsabilidade do CONDOMÍNIO ou da empresa prestadora de tal serviço, bem como, não se responsabiliza por qualquer e eventual retificação de dados informados posteriormente ao seu lançamento original ou sem tempo hábil para tal, seja solicitado pelo CONTRATANTE ou pela empresa prestadora desses serviços."),
        new Paragraph({ text: "" }),
        createParagraph("3.8. Seguro Contra Incêndio e Responsabilidade Civil – A responsabilidade pela contratação do seguro obrigatório de incêndio e de responsabilidade civil é exclusiva do (a) Síndico (a), representante legal do CONDOMÍNIO (artigo 1348, inciso IX, do Código Civil). A ADMINISTRADORA, não obstante, poderá auxiliar na obtenção de cotação das propostas de seguros para o CONDOMÍNIO, caso as Partes tenham prévia e oportunamente assim ajustado."),
        new Paragraph({ text: "" }),
        createParagraph("3.9. Funcionários –Orientar e recolher nos respectivos prazos todos os encargos devidos, mantendo e apresentando, sempre em dia, os livros e documentos exigidos."),
        new Paragraph({ text: "" }),
        createParagraph("3.9.1. Havendo a terceirização de mão-de-obra no condomínio, caberá a empresa prestadora destes serviços à responsabilidade pelo pagamento dos salários, adiantamentos, benefícios, recolhimento dos encargos trabalhistas e previdenciários, impostos, taxas, contribuições e demais obrigações assumidas pelas partes no específico contrato. Neste caso, não respondendo a ADMINISTRADORA, por nenhuma consequência que esta modalidade de serviço vier a acarretar ao CONDOMÍNIO, sejam elas de ordem trabalhista, civil, tributária ou mesmo criminais direta ou indiretamente."),
        new Paragraph({ text: "" }),
        createParagraph("3.10. Pagamento dos Funcionários - Efetuar o pagamento do pessoal, nas bases salariais e de acordo com a legislação vigente, até o 5º (quinto) dia útil do mês seguinte ao vencido e adiantamento de 40% no 15º dia após a data do pagamento da folha. Os pagamentos correspondentes às horas extras, prêmios e adicionais extraordinários, bem como o gozo de férias, serão previamente autorizados pelo CONDOMÍNIO; O pagamento das verbas salariais, indenizatórios entre outras devidas aos empregados, dar-se-á por meio de crédito em conta corrente/salário do respectivo empregado, na forma indicada pela ADMINISTRADORA, salvo circunstância especial que impeça tal procedimento; O vale-alimentação, refeição e o vale-transporte serão pagos através de crédito eletrônico em cartões pessoais e individuais aos funcionários, por empresa terceirizada especializada, cujo custo pelo serviço é de responsabilidade do CONDOMÍNIO."),
        new Paragraph({ text: "" }),
        createParagraph("3.11. Orçamentos – Colaborar na coleta de orçamentos e pesquisa de preços para a execução de obras e serviços, aquisição de equipamentos e materiais em geral, salvo os produtos e serviços que dependam de conhecimento e orientação técnica, para as quais será necessário contratar um profissional habilitado; A pedido do (a) síndico (a), a ADMINISTRADORA poderá fazer a cotação de fornecedores para a execução de serviços no CONDOMÍNIO, contudo não se responsabilizará pela contratação em si, nem poderá fiscalizar nem garantir o cumprimento das obrigações desses terceiros contratados, cabendo ao CONDOMÍNIO a análise dos riscos da contratação da empresa postulante dos serviços, bem como a decisão final por sua contratação."),
        new Paragraph({ text: "" }),
        createParagraph("3.12. Expedição de Circulares – Poderá ficar a cargo da ADMINISTRADORA, a redação e encaminhamento aos condôminos, das circulares e editais que o síndico e as assembleias por bem determinar."),
        new Paragraph({ text: "" }),
        createParagraph("3.13. Guarda de Documentos – Todos os documentos do CONDOMÍNIO constantes da pasta de prestação de contas mensal, não exigíveis em caso de fiscalização de órgãos competentes ou demandas trabalhistas, serão mantidos nos arquivos da ADMINISTRADORA somente até a finalização da pasta digital. Após decorrido este prazo, os mesmos serão devolvidos ao CONDOMÍNIO."),
        new Paragraph({ text: "" }),
        createParagraph("3.14. Dos Serviços Jurídicos - Caso o CONDOMÍNIO necessite de serviços jurídicos, a ADMINISTRADORA apresentará relação de escritórios de advogados especialistas em diversas áreas, ficando a cargo do CONDOMÍNIO a escolha do escritório que lhe prestará os serviços. Os honorários do advogado e os termos da contratação serão tratados entre o representante legal do escritório escolhido e o representante legal do CONDOMÍNIO, que lhes outorgará procuração específica para a eventual medida extrajudicial ou judicial. A ADMINISTRADORA não possui qualquer responsabilidade sobre os serviços prestados pelo escritório de advogados indicado."),
        new Paragraph({ text: "" }),

        createBoxedText("CLÁUSULA 4 – DAS DISPOSIÇÕES GERAIS."),
        new Paragraph({ text: "" }),

        createParagraph("4.1. A título de reembolso, serão repassados ao CONDOMINIO todos os custos e despesas relacionadas com correio, cópias, impressões, envelopes, material de escritório, tarifas/taxas bancárias, e outras despesas decorrentes de atos praticados pela ADMINISTRADORA em benefício ao CONDOMINIO. Somado a isso, os demais itens previstos no Referencial de Serviços Especiais descritos abaixo, quando efetivados, serão pagos à ADMINISTRADORA, conforme segue:"),
        new Paragraph({ text: "" }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [createBoldParagraph(table41Headers.servico)], margins: { top: 50, bottom: 50, left: 50, right: 50 } }),
                new TableCell({ children: [createBoldParagraph(table41Headers.valor)], margins: { top: 50, bottom: 50, left: 50, right: 50 } }),
              ]
            }),
            ...table41Data.map(row => 
              new TableRow({ 
                children: [
                  new TableCell({ children: [new Paragraph(row.servico)], margins: { top: 50, bottom: 50, left: 50, right: 50 } }), 
                  new TableCell({ children: [new Paragraph(row.tipo === 'valor' ? row.valor : (row.tipo === 'isento' ? 'ISENTO' : row.valor))], margins: { top: 50, bottom: 50, left: 50, right: 50 } })
                ] 
              })
            )
          ]
        }),
        new Paragraph({ text: "" }),

        createParagraph("4.1.1. Serão repassadas mediante reembolso as eventuais despesas de aluguéis de máquinas, contratação de operadores, telões etc., que demandarem despesas, e que vierem a serem solicitadas pelo CONDOMÍNIO, de modo que, não faça parte do escopo ou quadro de materiais que a ADMINISTRADORA possua para a prestação de serviços."),
        new Paragraph({ text: "" }),
        createParagraph("4.1.2. Fica claro nesta oportunidade, que os valores previstos nesta tabela referencial, ficarão sujeitos ao reajuste pelo índice econômico escolhido no quadro de resumo do preambulo."),
        new Paragraph({ text: "" }),
        ...(formData.tipoLgpd === 'Completa' ? [
          createParagraph('4.2. - Considerando o tratamento de dados pessoais realizado pela ADMINISTRADORA, seus funcionários, representantes, contratados, subcontratados ou outros, em nome e a mando do CONDOMINIO, a ADMINISTRADORA deve garantir que qualquer terceiro envolvido no tratamento em seu nome, em razão disto, cumprirá integralmente aquilo definido pela Lei Geral de Proteção de Dados (“LGPD” - Lei nº 13.709/18). A ADMINISTRADORA deverá observar as diretrizes da legislação aplicável a matérias relacionadas à proteção de dados pessoais e privacidade, principalmente no que se refere ao tratamento de informações pessoais relacionados ao objeto da contratação do presente, inclusive nas seguintes condições:'),
          new Paragraph({ text: "" }),
          createParagraph('4.2.1. A ADMINISTRADORA assegura que os dados pessoais e/ou sensíveis tratados em decorrência deste contrato não serão acessados, compartilhados ou transferidos a terceiros sem a autorização prévia e por escrito do CONDOMINIO. Caso o CONDOMINIO autorize estas operações de tratamento, a ADMINISTRADORA deverá garantir que tais terceiros se obriguem, por escrito, a assegurar a mesma proteção aos dados pessoais estabelecida neste contrato. A ADMINISTRADORA será responsável por todas as ações e omissões realizadas por tais terceiros relativas ao tratamento dos referidos dados pessoais, que tiver realizado.'),
          new Paragraph({ text: "" }),
          createParagraph('4.2.2. Caso o ADMINISTRADORA identificar a ocorrência de um incidente de segurança, deverá notificar o CONDOMINIO em até 48h (quarenta e oito horas), por escrito. A notificação deverá conter informações detalhadas contendo, no mínimo, a descrição do ocorrido e de sua causa, a natureza dos dados afetados, informações sobre os titulares envolvidos, quais os riscos relacionados e os possíveis impactos aos titulares, as ações adotadas para a prevenção e as medidas técnicas e administrativas para a mitigação dos efeitos e dos prejuízos, para que a ADMINISTRADORA possa cumprir com eventuais exigências legais.'),
          new Paragraph({ text: "" }),
          createParagraph('4.2.3. A ADMINISTRADORA deverá, sob o comando do CONDOMINIO, ou quando da extinção do vínculo contratual e obrigacional existente, devolver integralmente os dados pessoais e excluí-los definitiva e permanentemente, salvo se aplicáveis obrigações legais ou regulatórias que determinem a continuidade do seu armazenamento, dentro do prazo legal estabelecido.'),
          new Paragraph({ text: "" }),
          createParagraph('4.2.4. A ADMINISTRADORA será responsável por quaisquer reclamações, perdas e danos, que venha a sofrer o CONDOMINIO, além de multas, inclusive as aplicadas pelas autoridades competentes, e qualquer outra situação que exija o pagamento de valores pecuniários ou acarrete prejuízos, quando os eventos decorrerem de: a-) descumprimento, pela ADMINISTRADORA, ou por terceiros por ela contratados, das disposições expostas neste instrumento; b-) qualquer incidente relacionado aos dados pessoais tratados pela ADMINISTRADORA ou de terceiros por ela contratados, referentes a este contrato, ou c-) qualquer ato da ADMINISTRADORA ou de terceiros por ela contratados, em discordância com a legislação aplicável à privacidade e proteção de dados.'),
          new Paragraph({ text: "" }),
          createParagraph('4.2.5. A ADMINISTRADORA não deverá realizar quaisquer ações proibidas pela Lei Federal nº 12.846/2013, Lei Federal nº 9.613/1998, e as demais normas aplicáveis que tratem das práticas de atos contra a administração pública, corrupção, lavagem de dinheiro, evasão fiscal, improbidade administrativa, financiamento ao terrorismo, bem como outras normas relacionadas (“Leis Anticorrupção”). Ademais, a ADMINISTRADORA não deve fazer pagamentos, oferecer ou transferir quaisquer bens ou direitos, bem como influenciar indevidamente qualquer servidor, funcionário ou empregado da administração pública direta ou indireta, qualquer membro de um partido político, ou candidato a um cargo político, ainda, qualquer terceiro em desconformidade com as Leis Anticorrupção ou a título de compliance.'),
          new Paragraph({ text: "" }),
          createParagraph('4.2.6. A ADMINISTRADORA declaram e garantem que em todas as suas atividades relacionadas ao Contrato bem como em todas as suas atividades em geral e naquelas relacionadas ao seu grupo econômico, bem como seus respectivos diretores, conselheiros, administradores, colaboradores, funcionários, empregados ou beneficiários, consultores ou outros prepostos não tomaram ou tomarão qualquer medida que viole as Leis Anticorrupção e não pagaram, ofereceram, prometeram ou autorizaram, nem pagarão, oferecerão, prometerão, ou autorizarão o pagamento de dinheiro, bens ou direitos, direta ou indiretamente, a qualquer servidor, funcionário ou empregado da administração pública direta ou indireta, em qualquer caso com a finalidade de: influenciar qualquer ato ou decisão de tal pessoa em sua capacidade oficial; induzir tal pessoa a agir (seja por ação ou omissão) em violação de seu dever legal; obter qualquer vantagem indevida; ou induzir tal pessoa a usar a sua influência para afetar ou influenciar qualquer ato ou decisão de uma autoridade competente a título de compliance.'),
          new Paragraph({ text: "" }),
          createParagraph('4.2.7. O não cumprimento pelas Pastes das Leis Anticorrupção a de compliance será considerada uma infração grave ao Contrato e conferirá à Parte inocente o direito de rescindir imediatamente o Contrato, assumindo a Parte infratora a exclusiva responsabilidade pelas perdas e danos decorrentes de tal infração, em conformidade com as normas aplicáveis.'),
          new Paragraph({ text: "" })
        ] : [
          createParagraph('4.2. As partes, por si próprias, os seus empregados e residentes, comprometem-se a agir neste contrato de acordo com a atual Legislação sobre Proteção de Dados Pessoais (LGPD) e as decisões dos órgãos reguladores e de supervisão sobre o assunto, especialmente a Lei 13.709/2018. Além disso, a PARTE CONTRATANTE declara que detém todas as autorizações, licenças, permissões, concessões, consentimentos, direitos e/ou garantias legalmente necessários ("Autorizações de Tratamento") para o propósito de autorizar o tratamento dos Dados Pessoais por si fornecidos e de acordo com as suas diretrizes, declarando também que tais Dados Pessoais foram obtidos legalmente, em estrita conformidade com todas as leis aplicáveis.'),
          new Paragraph({ text: "" })
        ]),
        createParagraph("4.3. O presente contrato e prestação de serviços não estabelecerá qualquer relação ou vínculo empregatício entre o CONDOMÍNIO e os empregados da ADMINISTRADORA, respondendo a mesma com exclusividade pelas eventuais reclamações trabalhistas ajuizadas por seus funcionários ou profissionais envolvidos na prestação dos serviços."),
        new Paragraph({ text: "" }),
        createParagraph("4.4. As partes declaram expressamente substituídos todos os instrumentos ou acordos anteriormente celebrados, que possuam o mesmo objeto do presente contrato, de modo que a nova relação jurídico-comercial (condições, procedimentos, valores etc.), decorrente dos instrumentos antigos, passa a ser regida pelo disposto no presente instrumento a contar da data de início da vigência deste contrato."),
        new Paragraph({ text: "" }),
        createParagraph("4.5. Fica expressa e irrevogavelmente estabelecido que a tolerância ou o não exercício pelas partes, de direitos garantidos em lei ou por este contrato, não significará renúncia ou novação, podendo as partes exercê-los a qualquer momento."),
        new Paragraph({ text: "" }),
        createParagraph(`4.6. As partes elegem o foro da cidade de ${formData.tipoForo === 'Personalizado' && formData.cidadeForo ? formData.cidadeForo : 'São Paulo'}, Estado de São Paulo, para dirimir quaisquer questões provenientes deste instrumento, renunciando a qualquer outro, por mais privilegiado que seja.`),
        new Paragraph({ text: "" }),
        
        ...(additionalClauses.length > 0 ? [
          new Paragraph({ children: [new TextRun({ text: "CLÁUSULAS ADICIONAIS", bold: true, color: "059669" })] }),
          new Paragraph({ text: "" }),
          ...additionalClauses.flatMap((clause, index) => [
            new Paragraph({
              children: [
                new TextRun({ text: `${index + 5}. ${clause.title}: `, bold: true }),
                new TextRun({ text: clause.text })
              ],
              alignment: AlignmentType.JUSTIFIED
            }),
            new Paragraph({ text: "" })
          ])
        ] : []),

        createParagraph("4.7. As PARTES declaram que estarem justos e contratados, assinam o presente Instrumento Particular de Contrato de Prestação de Serviços por meio eletrônico, com o uso da plataforma Clicksign (i.e., https://www.clicksign.com/), nos termos da Medida Provisória nº 2.200-2/2001. As PARTES e os Intervenientes anuentes reconhecem como válidas as assinaturas realizadas inclusive com certificados não emitidos pela Infraestrutura de Chaves Públicas Brasileira (i.e., ICP-Brasil), nos termos do Artigo 10, Parágrafo 2º da Medida Provisória nº 2.200-2/2001, quando enviadas para os E-mails encaminhados neste Contrato. Este Contrato produz efeitos para todas as PARTES e para os Intervenientes Anuentes a partir da data indicada no QUADRO RESUMO, ainda que uma ou mais PARTES realizem a assinatura em data posterior, para que surtam seus legais e jurídicos efeitos."),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "" }),

        new Paragraph({ text: "____________________________________________________", alignment: AlignmentType.CENTER }),
        new Paragraph({ text: formData.nomeCondominio || 'CONTRATANTE', alignment: AlignmentType.CENTER }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "____________________________________________________", alignment: AlignmentType.CENTER }),
        new Paragraph({ text: "Sell Administradora de Condomínios", alignment: AlignmentType.CENTER }),
        new Paragraph({ text: "CONTRATADA", alignment: AlignmentType.CENTER }),
      ],
    }]
  });

  const blob = await Packer.toBlob(doc);
  const fileName = formData.nomeCondominio
    ? `Contrato_${formData.nomeCondominio.replace(/\s+/g, '_')}.docx`
    : 'Contrato_Sell_Administradora.docx';
  saveAs(blob, fileName);
};
