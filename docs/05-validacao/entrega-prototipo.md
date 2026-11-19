# Entrega do Protótipo Interativo — MindShare

> **Disciplina:** Requisitos de Software (QXD0251 · Turma 02A) — Universidade Federal do Ceará (UFC) · Campus Quixadá  
> **Projeto:** MindShare — Plataforma Web de Aprendizagem Colaborativa  
> **Equipe:** Daniely Maia, Fº Edinaldo dos Santos, Lara Mª Gurgel, Mª Tatiane Dias e Viviane Araújo  
> **Documento de referência:** [MindShare — Documento de Requisitos de Software (SRS)](<../00-documentos-gerais/MindShare — Documento de Requisitos de Software (SRS).pdf>) (`RF01`–`RF34`, `RN01`–`RN07`, `RNF01`–`RNF14`, `R1`–`R8`)

---

## 1. Links de Acesso ao Protótipo

O protótipo foi construído como uma aplicação web estática interativa (em substituição a um protótipo estático no Figma), permitindo validar visual e funcionalmente todos os fluxos especificados no SRS diretamente no navegador:

| Recurso | Endereço | Finalidade |
| --- | --- | --- |
| **Protótipo publicado (Demo Studio)** | https://edinaldogit.github.io/mindshare/?demo=1#/ | Acesso ao protótipo interativo com painel lateral discreto para troca rápida de perfil, restauração do estado inicial e aceleração da confirmação de presença em videoaulas. |
| **Repositório no GitHub** | https://github.com/edinaldoGit/mindshare | Código-fonte do protótipo (`prototipo/`), testes automatizados e documentação de Engenharia de Requisitos (`docs/`). |

---

## 2. Modelos de IA, Plataformas e Tecnologias Utilizadas

Em vez de produzir telas estáticas em ferramentas de desenho (como o Figma), a equipe adotou **prototipação interativa assistida por Inteligência Artificial**, permitindo validar tanto o design quanto as regras de transição de estado, filtros combinados, permissões por perfil e geração de comprovante em PDF.

| Categoria | Ferramenta / Tecnologia | Papel no desenvolvimento do protótipo |
| --- | --- | --- |
| **Ambiente assistido por IA** | **Google Antigravity** | Ambiente agêntico utilizado para orquestrar a construção por fases, leitura do SRS, edição do código e auditoria visual. |
| **Modelos de IA (LLMs)** | Família **Gemini** (Google DeepMind) e modelos de geração de código (**Claude / GPT**) | Tradução iterativa dos requisitos do SRS em interfaces interativas, revisão de aderência e refinamento de UX. |
| **Versionamento e publicação** | **Git**, **GitHub** e **GitHub Pages** | Controle de versão, automação de build (GitHub Actions) e hospedagem estática pública em HTTPS. |
| **Framework e linguagem** | **React** + **TypeScript** | Estruturação modular das telas por perfil de usuário e tipagem das entidades e estados do SRS. |
| **Build e roteamento** | **Vite** + **React Router** (`HashRouter`) | Empacotamento estático leve e navegação entre áreas públicas e protegidas no GitHub Pages. |
| **Estilização e ícones** | **Tailwind CSS** + **Lucide Icons** | Construção do design system da marca MindShare (tokens de cores, responsividade e iconografia). |
| **Comprovantes e persistência** | **pdf-lib** + **`localStorage`** | Geração dinâmica de comprovantes em PDF no navegador e persistência local simulada sem backend. |

---

## 3. Prompts Utilizados na Construção do Protótipo (Organizados por Fases)

Para estruturar a construção iterativa do protótipo e garantir rastreabilidade direta com o SRS, o desenvolvimento foi dividido em **7 fases incrementais**, nas quais cada prompt ficou responsável por um conjunto específico de telas, fluxos e regras de negócio.

---

### Fase 1 — Base do Protótipo, Identidade Visual e Perfis

> **Objetivo da fase:** Estruturar a base do protótipo interativo no navegador, definir a identidade visual do MindShare e organizar a navegação entre área pública e áreas autenticadas por perfil.

```text
Crie a base de um protótipo web interativo para o sistema MindShare, uma plataforma de
aprendizagem colaborativa para discentes da UFC Campus Quixadá. O protótipo vai substituir
telas estáticas (como no Figma) para validarmos os requisitos do SRS diretamente no navegador,
sem precisar de servidor ou banco de dados reais.

Diretrizes iniciais:
1. Utilize a marca oficial do MindShare (logotipo completo e ícone) e adote uma identidade
   visual limpa, acolhedora e acadêmica: fundo claro suave, cartões brancos com bordas
   discretas, tons de azul para ações principais e verde-água para destaques e conclusões,
   com boa legibilidade tanto em computador quanto em celular.
2. Crie o cabeçalho de navegação e o rodapé institucional informando que a aprovação de
   atividades e a emissão de comprovantes não garantem o reconhecimento da carga horária pela
   UFC.
3. Deixe o protótipo pré-carregado com dados realistas de usuários, propostas, atividades e
   inscrições, mantendo as alterações feitas durante o uso salvas no próprio navegador.
4. Prepare a estrutura de navegação e controle de acesso separando os perfis definidos no SRS:
   Visitante, Discente (que atua como Participante e Instrutor), Professor Curador e
   Administração.
```

---

### Fase 2 — Página Inicial, Catálogo, Detalhes da Atividade e Autenticação (`RF01`–`RF03`, `RF11`–`RF16`, `RF27`, `RNF10`)

> **Objetivo da fase:** Construir a experiência pública de descoberta de atividades e os fluxos de cadastro discente e login com restrições de acesso.

```text
Sobre a base criada na Fase 1, implemente as telas públicas e o acesso de usuários seguindo o
SRS do MindShare:

1. Página Inicial:
   - Apresente a proposta colaborativa "de estudante para estudante", um cartão em destaque de
     uma atividade publicada, uma seção "Como funciona" em 3 passos (encontrar, aprender em
     comunidade e compartilhar conhecimento) e atalhos para o catálogo e acesso.
2. Catálogo Público de Atividades:
   - Mostre exclusivamente atividades com status "Aprovada" (RF11).
   - Inclua busca por palavra-chave no título e na ementa, ignorando maiúsculas e acentos
     (RF12).
   - Adicione filtros combináveis por área temática (RF13), intervalo de carga horária de/até
     com aviso se o valor final for menor que o inicial (RF14), formato da atividade (RF15) e
     opção "Somente com vagas" calculada pelas inscrições (RF16), exibindo etiquetas dos
     filtros ativos e opção de limpar tudo.
   - Cada cartão deve trazer uma ilustração temática por área, carga horária, formato, nome do
     instrutor e quantidade de vagas disponíveis.
3. Página de Detalhes da Atividade:
   - Exiba antes da inscrição: resumo, ementa completa, categoria de horas complementares,
     dados do instrutor, modalidade, frequência ou progresso mínimo, critérios de conclusão e
     a lista de aulas quando a atividade for remota assíncrona (RF27).
   - Restrinja o link da reunião ao vivo e o acesso às videoaulas apenas para quem estiver
     inscrito (RF27).
4. Login e Cadastro de Discente:
   - Organize as telas de entrada e cadastro em duas colunas, com um painel lateral de boas-
     vindas à comunidade universitária e o formulário ao lado.
   - No cadastro discente (RF01), solicite nome completo, e-mail institucional (usando o padrão
     de exemplo @mindshare.test), senha com no mínimo 8 caracteres, confirmação de senha e
     aceite obrigatório de consentimento conforme a LGPD explicando a finalidade dos dados. Ao
     finalizar, a conta criada já deve poder ser usada no login.
   - No login (RF02), valide e-mail e senha, exiba mensagens claras de erro e bloqueie novas
     tentativas por 15 minutos após 5 falhas consecutivas (RNF10).
   - Garanta que cada perfil só acesse suas próprias telas e funcionalidades (RF03).
```

---

### Fase 3 — Área do Participante, Inscrições, Recomendações, Histórico e Comprovante PDF (`RF17`–`RF19`, `RF21`–`RF23`)

> **Objetivo da fase:** Entregar a jornada completa do estudante como Participante, desde a inscrição até a emissão do comprovante digital em PDF.

```text
Agora construa a área autenticada do Participante, com menu lateral no computador (e seletor
adaptado no celular):

1. Painel Inicial do Participante:
   - Exiba cartões de resumo com inscrições ativas, atividades concluídas, horas acumuladas e
     comprovantes disponíveis, atualizados automaticamente conforme o uso, além de sugestões de
     atividades.
2. Inscrição e Acompanhamento:
   - Na página de detalhes da atividade, permita ao Participante se inscrever quando houver
     vagas disponíveis, bloqueando inscrição duplicada e atualizando as vagas automaticamente
     (RF18, RN07).
   - Crie a tela "Minhas inscrições" com filtro por status (Todas, Inscrito e Concluída) e
     acesso à página individual de cada atividade inscrita, com atalho para acompanhar
     frequência ou assistir às videoaulas (RF19).
3. Descobrir por Interesse (RF17):
   - Crie um formulário onde o estudante escolhe a área temática desejada, informa o limite
     máximo de horas e pode marcar para ocultar atividades em que já está inscrito, listando as
     atividades aprovadas compatíveis.
4. Histórico de Horas e Comprovantes em PDF (RF21, RF22, RF23):
   - No Histórico, some apenas as horas de atividades cuja conclusão já foi confirmada pelo
     Instrutor (RN07).
   - Em Comprovantes e no Histórico, permita gerar e baixar um arquivo PDF individual para cada
     atividade concluída contendo o logotipo do MindShare, nome do participante, título da
     atividade, instrutor, carga horária, data de conclusão e, em destaque, o aviso obrigatório
     de que a emissão do comprovante não garante o reconhecimento da carga horária pela UFC.
```

---

### Fase 4 — Área do Instrutor, Propostas Multiformato e Gestão de Participantes (`RF04`–`RF05`, `RF10`, `RF20`)

> **Objetivo da fase:** Permitir que o mesmo Discente atue como Instrutor (`RN01`), crie e ajuste propostas nos três formatos e confirme a conclusão dos inscritos.

```text
Implemente a área do Instrutor, acessível ao mesmo Discente mantendo a mesma conta (RN01):

1. Painel e Lista de Propostas:
   - Mostre o resumo de propostas cadastradas, em análise, aprovadas e total de participantes
     inscritos, além de uma listagem filtrável pelos 5 estados do fluxo: Rascunho, Em análise,
     Ajustes solicitados, Aprovada e Rejeitada.
2. Formulário de Nova Proposta e Edição (RF04, RN04):
   - Divida o formulário em 3 blocos: informações da atividade, organização e realização/
     curadoria.
   - Campos obrigatórios: título, ementa, área temática, tipo de atividade (Aula, Minicurso,
     Oficina ou Grupo de estudo), carga horária, número de vagas, formato (Presencial, Remota
     síncrona ou Remota assíncrona), categoria de horas complementares, Professor Curador ativo
     responsável, percentual mínimo exigido e orientações/critérios de conclusão.
   - Adapte os campos extras ao formato escolhido:
     • Presencial: local de realização e lista de encontros planejados (data/horário e duração).
     • Remota síncrona: link da reunião e lista de encontros planejados.
     • Remota assíncrona: intervalo de confirmação de presença configurável entre 5 e 10
       minutos e editor de playlist de videoaulas (permitindo adicionar/remover várias aulas com
       título, breve descrição opcional e indicação se a aula é obrigatória).
   - A proposta deve começar como rascunho. A edição posterior só pode ser liberada quando o
     status for "Ajustes solicitados", preservando o Curador atribuído e todo o histórico de
     decisões (RF10, RN03).
3. Detalhes da Proposta e Submissão (RF05):
   - Exiba o histórico de eventos/decisões da proposta e a ação para submeter a proposta
     completa ao Professor Curador ativo selecionado.
4. Minhas Atividades e Gestão de Participantes (RF20):
   - Liste as atividades aprovadas do Instrutor e crie a tela de participantes inscritos,
     permitindo confirmar a conclusão de cada participante somente quando ele cumprir os
     critérios obrigatórios da modalidade.
```

---

### Fase 5 — Curadoria Docente Exclusiva e Fluxo de Decisões (`RF06`–`RF09`)

> **Objetivo da fase:** Criar o espaço de avaliação do Professor Curador validado e ativo, com fila individualizada e histórico de decisões.

```text
Construa a área do Professor Curador seguindo as regras de governança acadêmica do SRS:

1. Painel e Fila Exclusiva (RF06, RN02):
   - Exiba métricas das propostas sob responsabilidade do Curador e uma fila mostrando
     exclusivamente as propostas no estado "Em análise" atribuídas a ele (somente se o Curador
     estiver ativo), destacando a proposta enviada há mais tempo e mostrando formato, dados de
     realização, mínimo exigido e critérios de conclusão.
2. Tela de Análise e Decisões (RF07, RF08, RF09):
   - Apresente todos os dados da proposta, a ementa completa, as orientações de realização e o
     histórico de decisões anteriores.
   - Disponibilize as três decisões com janela de confirmação:
     • Aprovar proposta: muda para "Aprovada" e publica automaticamente no catálogo (RF11).
     • Rejeitar proposta: exige justificativa obrigatória para o Instrutor.
     • Solicitar ajustes: exige descrição obrigatória dos ajustes para que o Instrutor possa
       editar e reenviar a proposta.
3. Histórico de Decisões:
   - Mostre o histórico de todas as decisões já registradas pelo Curador, com filtro por tipo de
     decisão e distinção entre a decisão registrada e a situação atual da proposta.
```

---

### Fase 6 — Administração Docente, Frequência e Videoaulas Assíncronas (`RF24`–`RF34`)

> **Objetivo da fase:** Implementar a validação de acesso docente pela Administração, o lançamento de encontros/frequência e o acompanhamento de videoaulas assíncronas.

```text
Complete os fluxos finais especificados no SRS cobrindo validação docente, frequência e
acompanhamento de videoaulas:

1. Solicitação de Acesso Docente (RF24):
   - Crie um formulário separado do cadastro discente para professores solicitarem acesso à
     curadoria, informando nome, e-mail institucional, unidade/vínculo, escolha entre Análise
     administrativa e Verificação institucional, aviso de uso restrito dos dados (LGPD) e
     aceite obrigatório. Solicitações pendentes ou rejeitadas não podem liberar acesso (RN01).
2. Área da Administração (RF25, RF26, R7):
   - Crie o painel administrativo com contagem de solicitações pendentes, professores
     aprovados, ativos e rejeitados.
   - Na tela de solicitações docentes, permita ao Administrador aprovar ou rejeitar cadastros
     registrando responsável, data e justificativa obrigatória em caso de rejeição.
   - Na tela de curadores e atribuições, permita ativar ou desativar professores e transferir
     propostas pendentes para outro Curador ativo mediante motivo registrado, sem permitir que
     a Administração aprove ou rejeite propostas acadêmicas (RN02).
3. Encontros e Frequência — Presencial e Remota Síncrona (RF28, RF29, RF30, RN05):
   - Na visão do Instrutor: selecionar o encontro, confirmar data/horário, registrar o assunto
     abordado e marcar cada inscrito como Presente, Ausente ou Não registrado; permitir
     cancelar um encontro planejado e encerrar a atividade quando não houver encontros abertos.
   - Na visão do Participante: listar os encontros com o assunto abordado, o status de presença,
     o percentual acumulado e o mínimo exigido. Encontros futuros ou ainda sem lançamento nunca
     devem contar como falta.
4. Sala de Videoaulas Assíncronas (RF31, RF32, RF33, RF34, RN06, R8):
   - Crie a tela de aulas com reprodutor de vídeo e lista de aulas na lateral exibindo o
     progresso da aula atual e o progresso geral do curso.
   - Contabilize apenas os trechos efetivamente assistidos em tempo real (avançar na barra não
     conta e reassistir não duplica progresso), pausando o vídeo se o participante mudar de aba.
   - Exiba uma janela periódica de confirmação de presença baseada no intervalo configurado
     pelo Instrutor (entre 5 e 10 minutos, com ajuste proporcional em vídeos curtos para
     permitir a validação) e prazo de resposta de 30 segundos, pausando o vídeo se o prazo
     expirar. Nunca solicitar câmera, microfone ou biometria, deixando claro que a confirmação
     não comprova aprendizagem.
   - Disponibilize também ao Instrutor o resumo de progresso validado dos participantes em suas
     atividades assíncronas (RF34).
```

---

### Fase 7 — Revisão de Experiência Real e Polimento Visual / UX

> **Objetivo da fase:** Garantir que o protótipo transmita a experiência de um sistema real e corrigir problemas visuais e de usabilidade encontrados durante a revisão.

```text
Faça uma revisão geral de experiência de uso, textos e acabamento visual em todas as telas do
protótipo:

1. Experiência de sistema real:
   - Remova mensagens, avisos e textos que indiquem que se trata de um "protótipo", "versão de
     demonstração", "simulação" ou "dados fictícios" nas telas comuns do sistema.
   - Mantenha intactos o aviso obrigatório de que os comprovantes não garantem reconhecimento de
     horas pela UFC (RF23) e os créditos de licença do vídeo exibido nas aulas.
2. Ajustes visuais e de legibilidade:
   - Corrija o contraste dos botões azuis dentro de cartões (como na área administrativa e na
     confirmação de cadastro docente) para que o texto fique sempre branco e legível.
   - Encurte os textos de exemplo nos campos de carga horária do catálogo ("Mín." e "Máx.")
     para evitar que fiquem cortados.
   - Melhore a disposição dos campos de cada aula na playlist de videoaulas do formulário de
     proposta e remova textos repetitivos sobre as capas ilustradas dos cartões do catálogo.
   - Deixe o Painel Administrativo no mesmo padrão visual dos demais painéis, com ícones nos
     cartões de indicadores e destaque visual quando houver solicitações pendentes.
   - Transforme os status de presença (Presente, Ausente, Não registrado e Cancelado) em
     etiquetas coloridas com ícone, adicione barras visuais de progresso marcando o mínimo
     exigido tanto na tela de frequência quanto na barra lateral de videoaulas (destacando a
     aula atual e marcando com ícone as aulas já acompanhadas).
   - Padronize os links de voltar com seta para a esquerda e corrija contagens com "(s)" e
     "(ões)" para singular e plural naturais em português.
```

---

## 4. Matriz de Rastreabilidade e Aderência: SRS × Protótipo

A avaliação abaixo considera o papel do artefato como **protótipo interativo de validação de requisitos** (sem backend, banco de dados ou integrações institucionais reais da UFC). Requisitos cujo fluxo visual e de interação está integralmente coberto dentro do escopo de um protótipo recebem **`Sim`**; elementos introduzidos especificamente para navegação, UX ou apresentação acadêmica recebem **`Extra`**.

### 4.1 Requisitos Funcionais (`RF01`–`RF34`)

| ID do requisito | Tela do protótipo | Atende? (Sim / Parcial / Não / Extra) | Divergência (prompt / SRS) | Observação ou ação |
| --- | --- | --- | --- | --- |
| **RF01** | Cadastro Discente (`#/cadastro`) | Sim | Nenhuma no escopo de protótipo. | Integração com o domínio institucional real da UFC prevista na implementação com backend. |
| **RF02** | Login (`#/entrar`) | Sim | Nenhuma no escopo de protótipo. | Autenticação em servidor e hash de senha em banco previstos na implementação com backend. |
| **RF03** | Guardas de rota e menus por perfil (todas as áreas) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF04** | Nova Proposta (`#/instrutor/propostas/nova`) | Sim | Nenhuma. | SRS atualizado para incluir explicitamente *tipo de atividade* e *área temática* alinhados ao formulário. |
| **RF05** | Detalhe da Proposta (`#/instrutor/propostas/:id`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF06** | Painel e Fila de Curadoria (`#/curadoria`, `#/curadoria/propostas`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF07** | Análise de Proposta (`#/curadoria/propostas/:activityId`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF08** | Análise de Proposta (`#/curadoria/propostas/:activityId`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF09** | Análise de Proposta (`#/curadoria/propostas/:activityId`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF10** | Editar Proposta (`#/instrutor/propostas/:id/editar`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF11** | Catálogo Público (`#/catalogo`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF12** | Catálogo Público (`#/catalogo`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF13** | Catálogo Público (`#/catalogo`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF14** | Catálogo Público (`#/catalogo`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF15** | Catálogo Público (`#/catalogo`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF16** | Catálogo Público (`#/catalogo`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF17** | Descobrir por Interesse (`#/participante/recomendacoes`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF18** | Detalhes da Atividade (`#/atividades/:activityId`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF19** | Minhas Inscrições (`#/participante/inscricoes`) e Detalhe (`#/participante/atividades/:activityId`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF20** | Gestão de Participantes (`#/instrutor/atividades/:activityId/participantes`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF21** | Histórico de Horas (`#/participante/historico`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF22** | Histórico (`#/participante/historico`) e Comprovantes (`#/participante/comprovantes`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF23** | Comprovante PDF, Histórico e Comprovantes (`#/participante/comprovantes`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF24** | Solicitação de Acesso Docente (`#/cadastro/professor`) | Sim | Nenhuma no escopo de protótipo. | Integração real com base institucional/SIAPE prevista na implementação com backend. |
| **RF25** | Solicitações Docentes (`#/administracao/docentes`, `#/administracao/docentes/:id`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF26** | Curadores e Atribuições (`#/administracao/curadores`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF27** | Detalhes da Atividade (`#/atividades/:activityId`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF28** | Encontros e Frequência (`#/instrutor/atividades/:activityId/frequencia`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF29** | Encontros e Frequência (`#/instrutor/atividades/:activityId/frequencia`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF30** | Minha Frequência (`#/participante/atividades/:activityId/frequencia`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF31** | Videoaulas (`#/participante/atividades/:activityId/aulas`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF32** | Videoaulas (`#/participante/atividades/:activityId/aulas`) e Nova Proposta (`#/instrutor/propostas/nova`) | Sim | Em vídeos curtos (3 min), o intervalo é ajustado proporcionalmente para teste em tela. | Manter ajuste proporcional no protótipo; intervalo configurável de 5–10 min preservado na proposta. |
| **RF33** | Videoaulas (`#/participante/atividades/:activityId/aulas`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RF34** | Progresso dos Participantes (`#/instrutor/atividades/:activityId/frequencia` e `.../participantes`) | Sim | Nenhuma. | Nenhuma ação necessária. |

### 4.2 Regras de Negócio (`RN01`–`RN07`)

| ID do requisito | Tela do protótipo | Atende? (Sim / Parcial / Não / Extra) | Divergência (prompt / SRS) | Observação ou ação |
| --- | --- | --- | --- | --- |
| **RN01** | Sidebar Discente (`#/participante`, `#/instrutor`), Cadastro Docente (`#/cadastro/professor`) e Login (`#/entrar`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RN02** | Fila/Análise de Curadoria (`#/curadoria/propostas/*`) e Curadores (`#/administracao/curadores`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RN03** | Catálogo (`#/catalogo`), Curadoria (`#/curadoria/propostas/:activityId`) e Edição (`#/instrutor/propostas/:id/editar`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RN04** | Nova Proposta (`#/instrutor/propostas/nova`) e Detalhes (`#/atividades/:activityId`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RN05** | Frequência (`#/instrutor/atividades/:activityId/frequencia`, `#/participante/atividades/:activityId/frequencia`) e Participantes | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RN06** | Videoaulas (`#/participante/atividades/:activityId/aulas`) | Sim | Nenhuma. | Nenhuma ação necessária. |
| **RN07** | Catálogo (`#/catalogo`), Detalhes (`#/atividades/:activityId`), Histórico (`#/participante/historico`) e Comprovantes (`#/participante/comprovantes`) | Sim | Nenhuma. | Nenhuma ação necessária. |

### 4.3 Itens Extras Sugeridos pela IA (`Extra`)

| ID do requisito | Tela do protótipo | Atende? (Sim / Parcial / Não / Extra) | Divergência (prompt / SRS) | Observação ou ação |
| --- | --- | --- | --- | --- |
| **EXTRA-01** | Painel Demo Studio (`/?demo=1#/`) | Extra | Não especificado no SRS nem solicitado nos prompts; sugerido pela IA para permitir alternar facilmente entre perfis de usuário durante testes e apresentação. | Manter isolado sob o parâmetro `?demo=1` para não interferir na experiência normal de uso. |
| **EXTRA-02** | Alternador segmentado `Participante \| Instrutor` e Indicador visual de etapas na proposta | Extra | Não especificados no SRS nem solicitados nos prompts; adicionados pela IA como melhoria de navegação e escaneabilidade. | Manter como melhoria de usabilidade (`RNF03`) e reforço visual de `RN01`. |

---

## 5. Síntese da Validação

- **Requisitos Funcionais (`RF01`–`RF34`):** **34 de 34** (`100%`) atendidos (`Sim`) dentro do escopo de um protótipo interativo de validação de requisitos, sem pendências visuais ou funcionais (`0` *Parcial*, `0` *Não*).
- **Regras de Negócio (`RN01`–`RN07`):** **7 de 7** (`100%`) validadas visualmente e cobertas por testes automatizados.
- **Verificação automatizada:** `170/170` testes unitários passando (`npm test`), `0` erros/avisos de lint (`npm run lint`), `0` erros de tipagem (`npm run typecheck`) e build de produção validado e publicado no GitHub Pages.
