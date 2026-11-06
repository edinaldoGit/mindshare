# MindShare — Documento de Requisitos de Software (SRS)

**Requisitos de Software (QXD0251) · Turma 02A · UFC Quixadá · Versão 1.3 · 05/11/2026**

Equipe: Daniely Maia; Viviane Araújo; Mª Tatiane Dias; Fº Edinaldo dos Santos; Lara Mª Gurgel

## Histórico de revisões

| Versão | Data | Autor(es) | Descrição |
|---|---|---|---|
| 0.1 | 10/09/2026 | Equipe | Documento de Visão (base deste SRS). |
| 1.0 | 31/10/2026 | Equipe | Primeira versão completa do SRS (RF, RNF, rastreabilidade e glossário). |
| 1.1 | 31/10/2026 | Equipe | Alinhamento ao template ISO 29148 (ReqView): interfaces, método de verificação, seção de verificação e reagrupamento dos RNF. |
| 1.2 | 05/11/2026 | Equipe | Especificação do cadastro verificado de Professores Curadores e do perfil Administrador; modalidades presencial, remota síncrona e remota assíncrona; frequência, acompanhamento de vídeos, critérios de conclusão e requisitos de privacidade. Consolidação dos critérios de aceitação e da rastreabilidade. |
| 1.3 | 05/11/2026 | Equipe | Curadoria individual atribuída, reatribuição administrativa, frequência com registros pendentes, encerramento, progresso por intervalos sem duplicação, verificações proporcionais, acessibilidade e falhas de mídia. |

## 1. Introdução

### 1.1 Propósito

Este documento especifica os requisitos funcionais e não funcionais do MindShare, plataforma web de cursos colaborativos para discentes da UFC Quixadá. Deriva do Documento de Visão (10/09/2026) e serve de referência para projeto, implementação e testes. A versão 1.3 consolida os requisitos originais e as melhorias acadêmicas descritas neste histórico.

### 1.2 Escopo

O sistema fará:

- Cadastro público de discentes com e-mail institucional e autenticação por e-mail e senha.
- Solicitação e validação específica de acesso docente ao perfil de Professor Curador, por mecanismo institucional confiável ou análise administrativa.
- Gestão administrativa de validação docente, ativação de curadores e reatribuição, sem decisão de mérito acadêmico.
- Criação, submissão, curadoria e publicação de atividades (aulas, minicursos, oficinas e grupos de estudo).
- Oferta de atividades presenciais, remotas síncronas e remotas assíncronas, com dados próprios da modalidade.
- Catálogo, busca, filtros e recomendação de atividades.
- Inscrição, acompanhamento de frequência ou progresso, participação e confirmação de conclusão.
- Registro de carga horária e emissão de comprovantes digitais em PDF.

O sistema não fará:

- Substituir o sistema oficial de registro de horas complementares da UFC.
- Oferecer cursos de instituições externas ou com certificação reconhecida fora da UFC.
- Funcionar como rede social genérica ou fórum de discussão amplo.
- Gerenciar pagamentos ou cobranças pelos cursos.
- Garantir o reconhecimento da carga horária como atividade complementar pela UFC.
- Realizar integração real com gov.br, SIAPE, sistemas institucionais ou ferramentas externas de videoconferência no protótipo acadêmico.
- Utilizar câmera, microfone, reconhecimento facial ou monitoramento biométrico para registrar presença ou progresso.

A validação docente, o cadastro administrativo, as confirmações de acompanhamento e os controles de frequência do protótipo acadêmico serão fluxos demonstrativos. Não representam validação institucional real nem comprovam atenção, aprendizagem ou vínculo ativo.

### 1.3 Definições, siglas e abreviações

Ver Apêndice A (Glossário).

### 1.4 Referências

- MindShare — Documento de Visão, 10/09/2026.
- ISO/IEC/IEEE 29148 — *Systems and software engineering: Life cycle processes: Requirements engineering*.
- Atividade Avaliativa: Elaboração do Documento de Requisitos de Software (SRS).
- Lei Geral de Proteção de Dados Pessoais — Lei nº 13.709/2018.

### 1.5 Visão geral do documento

A Seção 2 descreve o produto de forma geral. A Seção 3 apresenta os requisitos específicos. Os apêndices trazem o glossário, a matriz de rastreabilidade, a divisão de responsabilidades e o checklist de qualidade.

## 2. Descrição geral

### 2.1 Perspectiva do produto

O MindShare é uma plataforma web independente. Não se integra ao sistema oficial de horas complementares da UFC: o discente baixa o comprovante e o submete à UFC por conta própria. Os recursos de validação docente, gestão administrativa, frequência e reprodução acompanhada de vídeos são especificados para uma evolução do produto; no protótipo acadêmico, são demonstrados sem backend ou integrações institucionais reais.

#### 2.1.1 Interfaces de sistema

O sistema é acessado por navegador web, sem instalação. O cadastro discente utiliza e-mail institucional. O vínculo docente poderá ser verificado, em uma implantação futura, por integração com fonte institucional confiável ou por análise administrativa autorizada. SIAPE isoladamente não comprova o vínculo; autenticação gov.br poderá complementar a identificação, mas não substitui a confirmação institucional. Essas integrações não estarão ativas no protótipo.

#### 2.1.2 Interfaces de usuário

A interface web inclui telas para cadastro e login; solicitação e validação de perfil docente; propostas do Instrutor; fila de curadoria do Professor Curador; gestão de validações pelo Administrador; catálogo e filtros; inscrição; registro e consulta de frequência; reprodução de vídeos assíncronos com confirmações de presença; histórico de carga horária e comprovantes.

#### 2.1.3 Interfaces de hardware

Não há interface com hardware dedicado. O usuário precisa de dispositivo com navegador e acesso à internet (premissa P2). O acompanhamento não requer câmera ou microfone.

#### 2.1.4 Interfaces de software

O sistema gera comprovantes em formato PDF. Atividades síncronas podem informar link de ferramenta externa, acessado pelo participante inscrito. Vídeos assíncronos são reproduzidos no ambiente MindShare. Não há integração real com sistemas governamentais, institucionais ou de videoconferência no protótipo.

#### 2.1.5 Interfaces de comunicação

A comunicação entre navegador e servidor ocorre pela internet, por HTTPS (RNF11). Dados de cadastro, documentos comprobatórios e registros de participação devem ter acesso limitado conforme o perfil e a finalidade (RNF13 e RNF14).

### 2.2 Funções do produto

1. Autenticação e controle de acesso (F1).
2. Solicitação e validação de perfis e criação/submissão de atividades (F2).
3. Curadoria de atividades (F3).
4. Catálogo, busca e descoberta de atividades (F4).
5. Inscrição, frequência/progresso, participação e conclusão (F5).
6. Registro de carga horária, histórico e comprovantes (F6).
7. Gestão administrativa de solicitações docentes, ativação de Curadores e transferência de atribuições, sem avaliação do mérito acadêmico.

### 2.3 Características dos usuários

| Perfil | Descrição | Necessidade principal |
|---|---|---|
| Discente Instrutor | Discente de graduação da UFC Quixadá com vínculo institucional validado, que cria e conduz atividades. | Ensinar e compartilhar conhecimento. |
| Discente Participante | Discente de graduação da UFC Quixadá que se inscreve e participa de atividades. | Aprender, acompanhar participação e registrar carga horária. |
| Professor Curador | Docente da UFC Quixadá cuja solicitação de perfil foi validada; analisa propostas antes da publicação. | Assegurar adequação acadêmica, clareza dos critérios e qualidade das propostas. |
| Administrador | Usuário autorizado responsável por validação docente, ativação/desativação de curadores e reatribuição de propostas, sem decisão acadêmica. | Aprovar ou recusar solicitações com acesso restrito aos dados necessários. |

Um mesmo Discente pode atuar como Instrutor e Participante. A seleção de perfil em formulário público não concede privilégios de Professor Curador. O Administrador não exerce curadoria acadêmica, não cria propostas nem altera registros de frequência; pode gerir permissões docentes e transferir atribuições com registro.

### 2.4 Restrições

- R1: Projeto didático, sem orçamento.
- R2: O sistema deve seguir as normas institucionais da UFC Quixadá aplicáveis à validação de horas complementares.
- R3: O sistema não substitui o sistema oficial de registro de horas.
- R4: O e-mail institucional apoia o cadastro discente, mas não é prova suficiente de vínculo docente nem concede privilégios de curadoria.
- R5: A aprovação de atividade e a emissão do comprovante não garantem reconhecimento da carga horária pela UFC.
- R6: O perfil de Professor Curador só pode ser ativado após verificação institucional confiável ou aprovação administrativa documentada.
- R7: No protótipo acadêmico, fluxos de validação docente, frequência e acompanhamento de vídeo são demonstrativos; integrações reais não fazem parte desta versão.
- R8: O Administrador tem permissões limitadas à validação docente, gestão de curadores e reatribuição registrada; não decide o mérito acadêmico.
- R9: O registro de presença e de vídeo não pode depender de coleta biométrica.

### 2.5 Premissas e dependências

- P1: Os discentes da UFC Quixadá têm interesse em ensinar e aprender colaborativamente.
- P2: Os usuários dispõem de internet e dispositivo com navegador.
- P3: As categorias de horas complementares seguem o documento oficial da instituição.
- P4: Uma implantação futura poderá dispor de fonte institucional confiável ou de equipe administrativa autorizada para verificar vínculo docente. O protótipo não depende desse acesso.
- P5: Instrutores informam encontros, critérios de frequência e conclusão de forma correta e tempestiva.
- P6: O intervalo de confirmação de acompanhamento de vídeo e o prazo de resposta podem ser configurados conforme avaliação pedagógica e de acessibilidade; os valores iniciais especificados são parâmetros de referência.
- P7: A instituição ou responsável pelo serviço definirá e documentará prazos de retenção e descarte compatíveis com a legislação e as finalidades do tratamento.

## 3. Requisitos específicos

Prioridade: Alta (essencial para o produto funcionar), Média (importante, mas o produto funciona sem ele) e Baixa (desejável). Origem: F1 a F6 são as funcionalidades do Documento de Visão; “Escopo”, “Restrições” e “Melhorias v1.2” referem-se a este documento e à revisão registrada. Os critérios de aceitação são verificáveis por teste, demonstração, inspeção ou análise, conforme indicado.

### 3.1 Requisitos funcionais

#### 3.1.1 Autenticação, cadastro e controle de acesso (F1)

| ID | Requisito | Prior. | Origem | Verificação | Critério de aceitação |
|---|---|---|---|---|---|
| RF01 | O sistema deve permitir o cadastro público de Discente somente com e-mail institucional da UFC Quixadá. | Alta | F1, R4 | Teste | Dado e-mail fora do domínio institucional, o cadastro é recusado com mensagem. Dado e-mail institucional válido, o cadastro discente é concluído. A escolha de um perfil docente não ativa poderes de Curador. |
| RF02 | O sistema deve autenticar o usuário por e-mail institucional e senha. | Alta | F1 | Teste | Com par válido, o usuário acessa a plataforma; com par inválido, o acesso é negado com mensagem. |
| RF03 | O sistema deve restringir o acesso às funcionalidades conforme perfil e estado de validação. | Alta | F1, R4, R6, R8 | Teste | Discente não acessa curadoria; Curador não cria atividade; solicitação docente pendente/recusada não acessa curadoria; Administrador acessa somente gestão de validação; perfil validado acessa curadoria. |
| RF24 | O sistema deve registrar uma solicitação específica de acesso docente ao perfil de Professor Curador, separada do cadastro público discente. | Alta | Melhorias v1.2, F1 | Teste | A solicitação registra identidade, vínculo declarado, mecanismo de verificação e estado pendente; o solicitante não recebe permissões de Curador enquanto pendente. |
| RF25 | O sistema deve permitir verificar o vínculo docente por fonte institucional confiável ou por análise administrativa autorizada. | Alta | Melhorias v1.2, R6 | Inspeção | A especificação da verificação identifica fonte e resultado; SIAPE isoladamente não aprova; autenticação gov.br, se disponível, atua somente como identificação complementar; o protótipo exibe fluxo demonstrativo sem integração real. |
| RF26 | O sistema deve permitir ao Administrador autorizado aprovar ou recusar uma solicitação docente, registrando responsável, data, resultado e justificativa da decisão. | Alta | Melhorias v1.2, R6, R8 | Teste | Somente Administrador autorizado decide; decisão fica registrada; aprovação ativa o perfil de Curador; recusa mantém acesso de curadoria bloqueado e comunica o resultado ao solicitante. |

#### 3.1.2 Criação e submissão de atividades (F2)

| ID | Requisito | Prior. | Origem | Verificação | Critério de aceitação |
|---|---|---|---|---|---|
| RF04 | O sistema deve permitir ao Instrutor cadastrar uma proposta com título, ementa, carga horária, modalidade, categoria de horas, número de vagas e critérios aplicáveis de participação e conclusão. | Alta | F2, Melhorias v1.2 | Teste | Campos obrigatórios da modalidade são exigidos: local para presencial; link para remota síncrona; vídeos acessíveis no MindShare para remota assíncrona. São exigidos percentual mínimo de frequência para presencial/síncrona e critérios de conclusão para todas as modalidades. Proposta válida é salva como “Rascunho”; campo obrigatório ausente impede salvar e é indicado. |
| RF05 | O sistema deve permitir ao Instrutor submeter uma proposta completa à curadoria. | Alta | F2 | Teste | Proposta submetida muda para “Em análise” e fica visível ao Professor Curador, incluindo modalidade, detalhes de realização, frequência e critérios de conclusão. |
| RF10 | O sistema deve permitir ao Instrutor editar uma proposta para a qual foram solicitados ajustes. | Alta | F2, F3 | Teste | Em “Ajustes solicitados”, o Instrutor edita e salva; em outros estados, edição não é permitida, conforme regras de negócio. O histórico de decisões anteriores permanece consultável. |
| RF27 | O sistema deve apresentar campos de realização específicos para cada modalidade de atividade. | Alta | Melhorias v1.2, F2 | Teste | Presencial exige local; remota síncrona exige link de acesso externo, visível apenas a inscritos; remota assíncrona exige ao menos um vídeo reproduzível no MindShare. Campos incompatíveis não são solicitados como obrigatórios. |
| RF28 | O sistema deve permitir ao Instrutor definir o percentual mínimo de frequência exigido para conclusão de atividade presencial ou remota síncrona. | Alta | Melhorias v1.2, F2, F5 | Teste | Percentual numérico válido entre 0% e 100% é obrigatório, exibido antes da inscrição e enviado à curadoria; alteração após publicação exige nova análise antes de produzir efeito. |
| RF29 | O sistema deve permitir ao Instrutor registrar presença ou ausência de Participantes inscritos em cada encontro presencial ou remoto síncrono realizado. | Alta | Melhorias v1.2, F5 | Teste | Para cada encontro realizado e participante inscrito, o Instrutor autorizado registra presença, ausência ou estado não registrado, podendo usar mecanismo apropriado ao formato síncrono; alterações ficam identificadas e datadas; não se permite registrar encontros de atividade assíncrona como frequência presencial/síncrona. |
| RF30 | O sistema deve apresentar ao Participante inscrito os encontros registrados, suas presenças e ausências, a frequência acumulada e o percentual mínimo exigido. | Alta | Melhorias v1.2, F5 | Demonstração | A área do participante identifica cada encontro e estado, exibe numerador/total de encontros computáveis, percentual acumulado e mínimo; antes de haver encontro registrado, informa que não há dados suficientes. |
| RF31 | O sistema deve registrar progresso de vídeo assíncrono somente para trechos efetivamente acompanhados durante a reprodução. | Alta | Melhorias v1.2, F5 | Teste | Reprodução atualiza progresso validado; saltos/avanços não são contabilizados automaticamente; progresso persiste ao pausar, sair e retornar, respeitando os segmentos validados. |
| RF32 | O sistema deve solicitar confirmação periódica de presença durante vídeo assíncrono e pausar a reprodução quando o prazo de resposta expirar. | Alta | Melhorias v1.2, F5 | Teste | Intervalo configurável inicia com referência entre 5 e 10 minutos e prazo de resposta com referência de 30 segundos; confirmação tempestiva mantém reprodução; ausência de confirmação pausa o vídeo e interrompe o avanço validado; retorno permite confirmar e retomar do ponto interrompido. |
| RF33 | O sistema deve exibir ao Participante o progresso validado por vídeo e o progresso geral da atividade assíncrona, e disponibilizar ao Instrutor autorizado um resumo por participante. | Média | Melhorias v1.2, F5 | Demonstração | Participante vê progresso individual e agregado; Instrutor consulta apenas participantes de suas atividades; dados mostram trechos validados e confirmações, sem alegar atenção ou aprendizagem. |

#### 3.1.3 Curadoria de atividades (F3)

| ID | Requisito | Prior. | Origem | Verificação | Critério de aceitação |
|---|---|---|---|---|---|
| RF06 | O sistema deve exibir ao Professor Curador a lista individual de propostas “Em análise” atribuídas ao professor autenticado, com título, Instrutor, data de submissão, modalidade, dados de realização, frequência mínima e critérios de conclusão. | Alta | F3, Melhorias v1.2 | Demonstração | Curador validado e ativo vê somente as propostas pendentes atribuídas a ele e os campos necessários à avaliação; usuário sem perfil validado não acessa a lista. |
| RF07 | O sistema deve permitir ao Professor Curador aprovar uma proposta submetida. | Alta | F3 | Teste | A aprovação muda o estado para “Aprovada” e registra responsável e data; a proposta aprovada torna-se publicável no catálogo. |
| RF08 | O sistema deve permitir ao Professor Curador rejeitar uma proposta com justificativa obrigatória. | Alta | F3 | Teste | Justificativa vazia ou composta somente de espaços é recusada; rejeição muda o estado para “Rejeitada” e a justificativa e decisão ficam visíveis ao Instrutor e no histórico. |
| RF09 | O sistema deve permitir ao Professor Curador solicitar ajustes com descrição obrigatória. | Alta | F3 | Teste | Descrição vazia ou composta somente de espaços é recusada; estado muda para “Ajustes solicitados” e descrição fica visível ao Instrutor e no histórico. |
| RF11 | O sistema deve publicar no catálogo somente atividades com estado “Aprovada”. | Alta | F3, F4 | Teste | Atividades com outro estado não aparecem em busca ou consulta do catálogo. |
| RF34 | O sistema deve permitir ao Professor Curador analisar os critérios de conclusão e as informações de modalidade, frequência e acompanhamento antes de decidir a proposta. | Alta | Melhorias v1.2, F3 | Teste | A tela de revisão apresenta os dados declarados e impede decisão sem que os campos obrigatórios da proposta estejam completos; decisão registrada referencia a versão analisada. |

#### 3.1.4 Catálogo e busca de atividades (F4)

| ID | Requisito | Prior. | Origem | Verificação | Critério de aceitação |
|---|---|---|---|---|---|
| RF12 | O sistema deve permitir busca por palavra-chave no título e na ementa de atividade publicada. | Alta | F4 | Teste | Correspondência no título ou ementa aparece; sem correspondência, sistema informa que nada foi encontrado. |
| RF13 | O sistema deve permitir filtrar atividades por área temática. | Média | F4 | Teste | Resultados contêm somente atividades da área selecionada. |
| RF14 | O sistema deve permitir filtrar atividades por intervalo de carga horária. | Média | F4 | Teste | Resultados contêm somente atividades dentro do intervalo informado. |
| RF15 | O sistema deve permitir filtrar atividades pelas modalidades presencial, remota síncrona e remota assíncrona. | Média | F4, Melhorias v1.2 | Teste | Cada modalidade pode ser selecionada; resultados correspondem à modalidade selecionada e apresentam seus critérios essenciais. |
| RF16 | O sistema deve permitir filtrar atividades com vagas disponíveis. | Média | F4 | Teste | Filtro retorna somente atividades com ao menos uma vaga livre. |
| RF17 | O sistema deve recomendar ao Discente atividades publicadas conforme área de interesse e carga horária máxima informadas. | Baixa | Escopo | Teste | Resultados correspondem à área e não excedem a quantidade de horas informada. |
| RF35 | O sistema deve apresentar, antes da inscrição, a modalidade, os dados de realização, a frequência mínima ou critérios de progresso e os critérios de conclusão da atividade. | Alta | Melhorias v1.2, F4, F5 | Teste | A tela de detalhes mostra todos os critérios necessários à modalidade; link de atividade síncrona fica visível somente a participantes inscritos; o Discente pode consultar os critérios antes de confirmar inscrição. |

#### 3.1.5 Inscrição, participação e conclusão (F5)

| ID | Requisito | Prior. | Origem | Verificação | Critério de aceitação |
|---|---|---|---|---|---|
| RF18 | O sistema deve permitir inscrição do Participante em atividade aprovada com vaga disponível. | Alta | F5 | Teste | Inscrição é confirmada e vagas diminuem em 1; sem vagas, inscrição é recusada com mensagem. |
| RF19 | O sistema deve permitir ao Participante consultar suas inscrições, estado, frequência ou progresso e conclusão. | Média | F5, Melhorias v1.2 | Demonstração | Lista mostra “Inscrito” ou “Concluída” e, quando aplicável, frequência por encontro/percentual ou progresso validado de vídeos. |
| RF20 | O sistema deve permitir ao Instrutor confirmar a conclusão de Participante inscrito após verificar os critérios aplicáveis. | Alta | F5, Melhorias v1.2 | Teste | Somente inscrito pode ser concluído; tela apresenta frequência calculada para presencial/síncrona ou progresso e critérios para assíncrona. Confirmação é recusada enquanto critério obrigatório não for atendido ou a atividade presencial/síncrona não estiver encerrada; Instrutor permanece responsável pela validação final. |
| RF36 | O sistema deve calcular a frequência presencial ou síncrona pelo número de encontros em que houve presença dividido pelo total de encontros realizados e registrados para a atividade. | Alta | Melhorias v1.2, F5 | Teste | Percentual acumulado = presenças ÷ registros de presença ou ausência em encontros realizados × 100; não registrados não equivalem a ausência e ficam fora do denominador. Sem registros, exibir “Sem dados”. Exibir uma casa decimal, comparar sem arredondar. Conclusão exige atividade encerrada e todos os encontros realizados contabilizados para o participante. |
| RF37 | O sistema deve permitir configurar critérios de conclusão para atividades remotas assíncronas e avaliar o progresso validado dos vídeos perante esses critérios. | Alta | Melhorias v1.2, F5 | Teste | Critérios são definidos na proposta, revisados pelo Curador e exibidos antes da inscrição; sistema compara progresso validado com os limites definidos e bloqueia confirmação se algum critério obrigatório não for atingido. |

#### 3.1.6 Registro de carga horária e comprovantes (F6)

| ID | Requisito | Prior. | Origem | Verificação | Critério de aceitação |
|---|---|---|---|---|---|
| RF21 | O sistema deve registrar no histórico do Participante a carga horária de cada atividade concluída. | Alta | F6 | Teste | Após confirmação, histórico exibe atividade e carga horária, e o total acumulado é atualizado. |
| RF22 | O sistema deve gerar comprovante digital em PDF para cada atividade concluída. | Alta | F6 | Inspeção | PDF contém nome do Participante, título da atividade, nome do Instrutor, carga horária e data de conclusão. |
| RF23 | O sistema deve exibir em cada comprovante aviso de que sua emissão não garante reconhecimento da carga horária pela UFC. | Alta | R5 | Inspeção | Todos os PDFs exibem o aviso em texto legível. |
| RF38 | O sistema deve disponibilizar o comprovante PDF após confirmação de conclusão pelo Instrutor, mantendo os critérios e aviso institucionais aplicáveis. | Alta | F6, R5 | Teste | Comprovante não é emitido antes da conclusão registrada; depois, fica disponível no histórico e inclui o aviso obrigatório RF23. |

#### 3.1.7 Atribuição e operação das atividades

| ID | Requisito | Prior. | Origem | Verificação | Critério de aceitação |
|---|---|---|---|---|---|
| RF39 | O sistema deve exigir a seleção de Professor Curador ativo e validado para submissão de proposta. | Alta | Evolução v1.3, F2 | Teste | Lista mostra somente docentes elegíveis; submissão sem seleção ou com professor inativo é recusada; atribuição é preservada em ajustes e reenvios e não pode ser alterada unilateralmente após submissão. |
| RF40 | O sistema deve restringir listas, detalhes, histórico e decisões de curadoria ao professor designado e ativo. | Alta | Evolução v1.3, F3 | Teste | Outro Curador não consulta proposta pela URL nem executa decisão; indicadores e fila usam apenas atribuições atuais; comandos repetem autorização. |
| RF41 | O sistema deve permitir ao Administrador ativar ou desativar Curadores aprovados e transferir propostas pendentes a outro Curador ativo, com motivo, autoria e data. | Alta | Evolução v1.3 | Teste | Transferência preserva ID, estado e decisões; professor anterior perde acesso, novo recebe; Administrador não pode aprovar academicamente. |
| RF42 | O sistema deve representar encontros planejados com data, duração, local ou link e situação de realização, separando planejamento de registros operacionais. | Alta | Evolução v1.3, F5 | Teste | Instrutor responsável marca encontro realizado/cancelado e encerra a atividade; planejamento permanece protegido pelos estados de edição da proposta. |
| RF43 | O sistema deve conservar intervalos únicos de reprodução validada e confirmações por participante, atividade e vídeo. | Alta | Evolução v1.3, F5 | Teste | Pausa, erro, aba oculta, avanço e espera de confirmação não geram progresso indevido; reassistir não duplica; recarga recupera intervalos e posição; progresso geral pondera duração dos vídeos obrigatórios. |
| RF44 | O sistema deve pausar a reprodução real e suspender validação enquanto solicita confirmação de acompanhamento, permitindo retomada acessível e sem penalidade irreversível. | Alta | Evolução v1.3, F5 | Teste | Diálogo pode ser operado por teclado; prazo configurável inicia em 30 segundos; expiração conserva ponto e exige confirmação; vídeos curtos recebem ao menos uma verificação; indicador não afirma atenção ou aprendizagem. |

### 3.2 Requisitos não funcionais

#### 3.2.1 Interfaces externas

| ID | Requisito | Métrica e condição de medição | Verificação | Prior. | Origem |
|---|---|---|---|---|---|
| RNF01 | O sistema deve funcionar nos navegadores mais usados. | Todas as funções de prioridade Alta funcionam nas duas últimas versões estáveis de Chrome, Firefox, Edge e Safari, por teste manual. | Teste | Média | Visão (P2) |
| RNF02 | O sistema deve exibir telas em diferentes tamanhos de tela. | Sem rolagem horizontal em larguras de 360 px a 1920 px. | Teste | Média | Visão (P2) |
| RNF13 | O sistema deve restringir documentos comprobatórios docentes aos Administradores autorizados envolvidos na validação. | 100% dos casos de acesso de teste respeitam controle de perfil; tentativas de perfil não autorizado são negadas e registradas. | Teste e inspeção | Alta | Melhorias v1.2, R6, R8 |

#### 3.2.2 Usabilidade

| ID | Requisito | Métrica e condição de medição | Verificação | Prior. | Origem |
|---|---|---|---|---|---|
| RNF03 | O sistema deve permitir a um Discente novo concluir inscrição sem ajuda. | Em teste com 5 discentes, ao menos 4 concluem em até 3 min, sem instrução prévia. | Teste | Média | F5 |
| RNF14 | O sistema deve comunicar de forma clara a coleta e o uso de dados de cadastro, frequência e acompanhamento de vídeos. | Antes da coleta, 100% dos fluxos apresentam finalidade, dados tratados, visibilidade, retenção aplicável e mecanismo de consentimento ou aviso pertinente; compreensão avaliada em teste com usuários. | Teste e inspeção | Alta | Melhorias v1.2, LGPD |
| RNF15 | O sistema deve permitir acompanhar vídeo e frequência sem exigir câmera, microfone ou recurso biométrico. | Inspeção confirma inexistência de solicitação ou captura desses dados nos fluxos de participação. | Inspeção | Alta | Melhorias v1.2, R9 |

#### 3.2.3 Desempenho

| ID | Requisito | Métrica e condição de medição | Verificação | Prior. | Origem |
|---|---|---|---|---|---|
| RNF04 | O sistema deve responder às buscas de atividades dentro de tempo limite. | Até 2 s no percentil 95, com 200 usuários simultâneos, em teste de carga. | Teste | Média | F4 |
| RNF05 | O sistema deve gerar comprovante dentro de tempo limite. | Até 5 s no percentil 95, com 50 gerações simultâneas, em teste de carga. | Teste | Média | F6 |
| RNF16 | O sistema deve persistir progresso validado e frequência sem perda de registros confirmados. | 100% dos registros confirmados em cenários de interrupção/retomada permanecem recuperáveis e sem contabilização duplicada. | Teste | Alta | Melhorias v1.2, F5 |

#### 3.2.4 Banco de dados lógico e privacidade

| ID | Requisito | Métrica e condição de medição | Verificação | Prior. | Origem |
|---|---|---|---|---|---|
| RNF06 | O sistema deve armazenar senhas de forma irreversível. | 100% das senhas armazenadas como hash com salt, verificado por inspeção do banco de dados. | Inspeção | Alta | F1 |
| RNF07 | O sistema deve manter histórico de carga horária e comprovantes por período mínimo. | Registros de atividades concluídas consultáveis por 5 anos após a conclusão, por consulta com datas retroativas. | Teste | Média | F6 |
| RNF17 | O sistema deve aplicar minimização de dados ao processo de validação docente e ao acompanhamento. | São coletados apenas dados necessários à finalidade; nenhum dado biométrico, imagem ou áudio é coletado; campos e finalidades são inspecionáveis. | Inspeção | Alta | Melhorias v1.2, LGPD |
| RNF18 | O sistema deve aplicar política documentada de retenção e descarte a documentos comprobatórios docentes e registros de acompanhamento. | Política identifica finalidade, prazo ou critério de retenção, responsáveis e descarte seguro; 100% dos dados vencidos segundo a política são eliminados ou anonimizados, salvo obrigação de retenção documentada. | Inspeção e análise | Alta | Melhorias v1.2, LGPD, P7 |
| RNF19 | O sistema deve manter acesso a dados de frequência, progresso e documentos limitado a usuários autorizados pela finalidade. | 100% dos casos de teste de autorização concedem apenas acesso necessário: Participante aos próprios dados; Instrutor às atividades sob sua condução; Administrador aos documentos de validação; Curador aos dados necessários à análise. | Teste | Alta | Melhorias v1.2, R8 |

#### 3.2.5 Restrições de projeto

As restrições R1 a R9 estão na Seção 2.4. Não há requisitos de projeto adicionais.

#### 3.2.6 Conformidade com padrões

| ID | Requisito | Métrica e condição de medição | Verificação | Prior. | Origem |
|---|---|---|---|---|---|
| RNF08 | O sistema deve atender às diretrizes de acessibilidade para conteúdo web. | Conformidade com WCAG 2.1 nível AA, medida por auditoria automatizada sem falhas críticas nas telas principais. | Análise | Média | Visão (Seção 2) |
| RNF09 | O sistema deve registrar o consentimento do usuário para tratamento de dados pessoais quando aplicável. | 100% dos tratamentos opcionais sujeitos a consentimento registram data, hora e versão do aviso; tratamentos necessários possuem finalidade e fundamento documentados, sem presumir que a aceitação de termos assegura conformidade, por inspeção do banco de dados. | Inspeção | Alta | F1, LGPD |

#### 3.2.7 Atributos do sistema

| ID | Requisito | Métrica e condição de medição | Verificação | Prior. | Origem |
|---|---|---|---|---|---|
| RNF10 | O sistema deve bloquear temporariamente login após tentativas inválidas. | Bloqueio de 15 min após 5 tentativas consecutivas inválidas. | Teste | Média | F1 |
| RNF11 | O sistema deve proteger o tráfego de dados entre usuário e servidor. | 100% das requisições por HTTPS, verificado por varredura automatizada. | Análise | Alta | F1 |
| RNF12 | O sistema deve estar disponível durante o semestre letivo. | Disponibilidade mensal mínima de 95%, medida por monitoramento de uptime. | Análise | Média | F1 a F6 |

#### 3.2.8 Reprodução e acessibilidade de mídia

| ID | Requisito | Métrica e condição de medição | Verificação | Prior. | Origem |
|---|---|---|---|---|---|
| RNF20 | O sistema deve oferecer controles de reprodução, confirmação e navegação por aulas acessíveis por teclado e informação textual equivalente. | Todos os controles têm nome acessível, foco visível e operação sem apontador; conteúdo com fala possui legendas/transcrição adequadas e conteúdo demonstrativo sem fala possui descrição. | Teste e inspeção | Alta | Evolução v1.3 |
| RNF21 | O sistema deve informar erros de mídia e permitir nova tentativa sem perder progresso confirmado. | Erro de carregamento/decodificação mostra mensagem e ação de tentar novamente; progresso confirmado permanece após falha e recarga em todos os casos de teste. | Teste | Alta | Evolução v1.3 |
| RNF22 | O sistema deve servir a mídia demonstrativa com caminhos compatíveis com publicação estática em subdiretório. | Vídeo local MP4 abre no build de produção com base configurada; licença e atribuição estão acessíveis; primeira imagem em até 5 segundos em teste local com cache frio e arquivo até 20 MB. | Teste e inspeção | Média | Evolução v1.3 |

### 3.3 Verificação

Cada requisito indica o método usado para verificá-lo. O critério de aceitação de cada RF e a métrica de cada RNF definem o resultado esperado.

| Método | Definição |
|---|---|
| Teste | Execução do sistema com entradas definidas e comparação com o resultado esperado. |
| Demonstração | Operação do sistema diante do avaliador, sem medição detalhada. |
| Inspeção | Exame direto de artefatos, como comprovante PDF, política de retenção, configuração de acesso ou registro de dados. |
| Análise | Avaliação de dados coletados por ferramenta, como auditoria de acessibilidade, varredura de segurança ou monitoramento. |

### 3.4 Regras de negócio consolidadas

- RN01: Discente pode exercer Instrutor e Participante na mesma identidade. SIAPE ou gov.br isolados não habilitam curadoria. Cadastro docente pendente/recusado não concede acesso.
- RN02: Só Curador validado, ativo e designado decide proposta Em análise. Ajustes/reenvio preservam atribuição; transferência cabe ao Administrador e gera histórico.
- RN03: Apenas Aprovada aparece no catálogo. Rejeição e ajustes exigem motivo. Edição estrutural é permitida somente em Ajustes solicitados; rascunho é criado completo.
- RN04: Presencial exige local e encontros; síncrona exige link HTTP(S) e encontros; assíncrona exige vídeos, conteúdo obrigatório e progresso mínimo entre 0 e 100%. Nenhum percentual é apresentado como norma da UFC.
- RN05: Não registrado é distinto de ausência. Cálculo parcial usa somente encontros realizados com lançamento; conclusão presencial/síncrona exige encerramento, lançamentos completos e mínimo atingido.
- RN06: Vídeo contabiliza união dos intervalos reproduzidos, nunca o salto da barra ou tempo pausado. Aba oculta, erro e confirmação suspendem validação. Intervalos reassistidos não duplicam; progresso geral usa duração dos vídeos obrigatórios.
- RN07: Conclusão é única e depende do Instrutor, inscrição válida e todos os critérios. Conclusões legadas não são revogadas na migração. Atividades legadas sem controles recebem tratamento de compatibilidade identificado, sem inventar frequência passada.
- RN08: Vagas derivam das inscrições, horas derivam das conclusões; comprovantes continuam exibindo que a emissão não garante reconhecimento da carga horária pela UFC.
- RN09: Documentos docentes têm finalidade, acesso e retenção definidos; protótipo usa somente representações fictícias e não armazena arquivos pessoais. Confirmações não comprovam atenção ou aprendizagem.
- RN10: O sistema pretendido requer autorização e persistência no servidor. O protótipo demonstra os fluxos por comandos locais, sem garantir identidade, integridade, retenção, concorrência ou conformidade jurídica. O Demo Studio é ferramenta auxiliar externa ao domínio acadêmico, documentada separadamente.

## Apêndice A — Glossário

| Termo | Definição |
|---|---|
| Discente | Aluno de graduação da UFC Quixadá com vínculo institucional validado. |
| Instrutor | Discente que cria e conduz uma atividade. |
| Participante | Discente inscrito em uma atividade. |
| Professor Curador | Professor da UFC Quixadá cujo vínculo docente foi verificado e que analisa propostas antes da publicação. |
| Administrador | Usuário autorizado a validar cadastros docentes, gerir ativação de Curadores e transferir propostas pendentes com registro, sem decisão acadêmica. |
| Atividade | Aula, minicurso, oficina ou grupo de estudo oferecido na plataforma. |
| Proposta | Atividade cadastrada por Instrutor que aguarda curadoria ou correção. |
| Curadoria | Análise de proposta pelo Professor Curador, com resultado de aprovação, rejeição ou solicitação de ajustes. |
| Catálogo | Conjunto de atividades aprovadas e disponíveis para consulta. |
| Ementa | Descrição do conteúdo e dos objetivos da atividade. |
| Carga horária | Quantidade de horas atribuída a uma atividade. |
| Horas complementares | Horas de atividades extracurriculares exigidas na graduação, conforme normas da UFC. |
| Categoria de horas complementares | Classificação da atividade segundo o documento oficial da UFC. |
| Área temática | Assunto ou campo de conhecimento da atividade. |
| Formato | Termo utilizado nas versões anteriores para modalidade de realização; não se confunde com o tipo de atividade (Aula, Oficina, Minicurso ou Grupo de estudo). |
| Modalidade presencial | Atividade realizada em espaço físico, cujo local deve ser informado pelo Instrutor. |
| Modalidade remota síncrona | Atividade realizada ao vivo por ferramenta externa, cujo link é disponibilizado aos inscritos. |
| Modalidade remota assíncrona | Atividade cujo conteúdo em vídeo é reproduzido no ambiente MindShare, no horário escolhido pelo Participante. |
| Encontro | Unidade realizada de atividade presencial ou síncrona, registrada para fins de frequência. |
| Frequência | Proporção de encontros realizados com presença registrada em relação ao total de encontros computáveis. |
| Percentual mínimo de frequência | Limite percentual previamente definido para conclusão de atividade presencial ou síncrona. |
| Progresso validado | Trechos de vídeo acompanhados segundo as regras de reprodução e confirmação; não representa prova de atenção ou aprendizagem. |
| Confirmação de presença | Ação explícita do Participante em resposta à solicitação periódica durante vídeo assíncrono. |
| Critério de conclusão | Condição informada antes da inscrição e analisada na curadoria, necessária para o Instrutor confirmar conclusão. |
| Vaga | Lugar disponível para um Participante em uma atividade. |
| Comprovante | Documento digital em PDF que registra participação e carga horária cumprida, sem garantir reconhecimento pela UFC. |
| E-mail institucional | Endereço fornecido pela UFC, usado no cadastro discente; isoladamente não comprova vínculo docente. |
| SIAPE | Sistema/identificador funcional da administração pública federal; seu número isolado não comprova vínculo docente ativo para fins deste sistema. |
| gov.br | Serviço de identificação digital que poderá ser complementar à verificação institucional, sem substituí-la. |
| Dado biométrico | Dado pessoal resultante de tratamento técnico específico relacionado a características físicas, fisiológicas ou comportamentais de uma pessoa. |
| Atribuição | Vínculo entre uma proposta e o Curador ativo responsável; mudanças administrativas possuem autoria, data e motivo. |
| Não registrado | Encontro sem lançamento de presença/ausência, excluído do cálculo parcial e impeditivo de conclusão quando realizado. |
| Encerramento | Declaração operacional do Instrutor de que a atividade terminou; não equivale à conclusão automática dos participantes. |
| SRS | *Software Requirements Specification*, Documento de Requisitos de Software. |
| RF / RNF | Requisito funcional / requisito não funcional. |
| WCAG | *Web Content Accessibility Guidelines*, diretrizes de acessibilidade para a web. |
| LGPD | Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018). |
| HTTPS | Protocolo de comunicação web com criptografia. |
| Percentil 95 | Valor abaixo do qual ficam 95% das medições. |

## Apêndice B — Matriz de rastreabilidade

| Item da Visão, restrição ou melhoria | Requisitos relacionados |
|---|---|
| Evolução v1.3: atribuição e gestão | RF39, RF40, RF41; RNF19 |
| Evolução v1.3: encontros e vídeo | RF42, RF43, RF44; RNF20, RNF21, RNF22 |
| F1 Autenticação e controle de acesso | RF01, RF02, RF03, RF24, RF25, RF26; RNF06, RNF09, RNF10, RNF11, RNF13, RNF14, RNF17, RNF19 |
| F2 Criação e submissão de atividades | RF04, RF05, RF10, RF27, RF28 |
| F3 Curadoria de atividades | RF06, RF07, RF08, RF09, RF10, RF11, RF34 |
| F4 Catálogo e busca de atividades | RF11, RF12, RF13, RF14, RF15, RF16, RF17, RF35; RNF04 |
| F5 Inscrição, participação e conclusão | RF18, RF19, RF20, RF28, RF29, RF30, RF31, RF32, RF33, RF35, RF36, RF37; RNF03, RNF15, RNF16 |
| F6 Registro de carga horária e comprovantes | RF21, RF22, RF23, RF38; RNF05, RNF07 |
| Melhorias v1.2: cadastro e validação de Curador | RF03, RF24, RF25, RF26; RNF13, RNF17, RNF18, RNF19 |
| Melhorias v1.2: modalidades | RF04, RF05, RF06, RF27, RF34, RF35 |
| Melhorias v1.2: frequência e vídeos | RF28, RF29, RF30, RF31, RF32, RF33, RF36, RF37; RNF15, RNF16 |
| Melhorias v1.2: conclusão e comprovante | RF20, RF21, RF22, RF23, RF35, RF37, RF38 |
| Melhorias v1.2: privacidade e proteção | RF24, RF25, RF26; RNF09, RNF13, RNF14, RNF15, RNF17, RNF18, RNF19 |
| Escopo: busca e recomendação por interesse e horas | RF12, RF17 |
| Escopo: perfis e validação de vínculo | RF01, RF03, RF24, RF25, RF26 |
| Escopo: itens fora do escopo | Seção 1.2; R5, R7, R9 |
| Restrições R4, R5, R6, R8 e R9 | RF01, RF03, RF23, RF24, RF25, RF26; RNF13, RNF15, RNF19 |
| Critérios de sucesso: adesão | Dados de RF01, RF24 e RF26 (cadastros e validações) |
| Critérios de sucesso: oferta de atividades | RF05, RF07 e RF11 (propostas submetidas, aprovadas e publicadas) |
| Critérios de sucesso: participação | RF18, RF20, RF29, RF30, RF31, RF32, RF36 e RF37 |
| Critérios de sucesso: horas geradas | RF21, RF22, RF23 e RF38 |
| Qualidade transversal | RNF01, RNF02, RNF08, RNF11, RNF12, RNF13, RNF14, RNF15, RNF17, RNF18, RNF19 |

## Apêndice C — Divisão de responsabilidades

| Seção | Responsável | Revisor |
|---|---|---|
| 1. Introdução e glossário | A definir | A definir |
| 2. Descrição geral | A definir | A definir |
| 3.1.1 a 3.1.2 (RF de F1 e F2) | A definir | A definir |
| 3.1.3 a 3.1.4 (RF de F3 e F4) | A definir | A definir |
| 3.1.5 a 3.1.6 (RF de F5 e F6) | A definir | A definir |
| 3.2 Requisitos não funcionais | A definir | A definir |
| Apêndices B e D e revisão final | A definir | A definir |

## Apêndice D — Checklist de qualidade

| Item | Situação |
|---|---|
| O escopo informa o que o sistema fará e não fará. | Atendido (Seção 1.2) |
| Os perfis Discente, Instrutor, Participante, Professor Curador e Administrador estão definidos e têm permissões delimitadas. | Atendido (Seções 2.3 e 2.4; RF03, RF24–RF26) |
| As modalidades têm dados de realização e critérios próprios. | Atendido (RF04, RF27, RF28, RF35) |
| Frequência e progresso têm regra de cálculo verificável. | Atendido (RF29–RF33, RF36–RF37) |
| Todo requisito tem ID único, prioridade e origem. | Atendido |
| Todo RF utiliza “O sistema deve...” e descreve uma capacidade verificável. | Atendido |
| Todo RNF possui métrica e condição de medição. | Atendido |
| Privacidade, acesso, retenção e descarte dos novos dados estão especificados. | Atendido (RNF13–RNF19; P7) |
| O mecanismo de vídeo não coleta biometria nem afirma comprovar atenção ou aprendizagem. | Atendido (Seções 1.2 e 2.4; RF31–RF33; RNF15, RNF17) |
| Não há contradição entre confirmação do Instrutor, critérios de conclusão e comprovante. | Atendido (RF20–RF23, RF35, RF37–RF38) |
| Todas as funções e melhorias estão na matriz de rastreabilidade. | Atendido (Apêndice B) |
| O protótipo está claramente diferenciado de integrações e validações reais. | Atendido (Seções 1.2, 2.1, 2.1.1 e R7) |
| O histórico de revisões está preenchido. | Atendido (Histórico de revisões) |
