# Arquitetura do MindShare

## Estado atual e fonte de verdade

SRS completo v1.3 em `MindShare_SRS_v1.3.md` e PDF homônimo. Os SRS v1.1 e v1.2 foram preservados. Etapas 1–5 e evolução final implementadas no mesmo projeto React/TypeScript/Vite, com HashRouter, Tailwind 4, tokens MindShare e componentes existentes. Sem backend ou integração institucional real. Publicação estática documentada em `publicacao.md`. Os registros de validação das etapas anteriores permanecem em `validation.md`.

## Domínio compartilhado

`DemoState` v3 contém `users`, `applications`, `activities`, `enrollments`, `attendance` e `progress`. Não há coleções separadas de propostas publicadas, vagas, horas ou comprovantes. `Activity.status` é a fonte de curadoria; somente Aprovada passa pelo catálogo. Vagas são capacidade menos inscrições, inclusive concluídas. Horas e PDFs derivam das inscrições Concluída.

Discente continua exercendo Participante e Instrutor na mesma identidade. `User` admite Professor Curador (verified/active) e Administrador. Solicitações docentes têm estados próprios Pendente/Aprovada/Rejeitada. Uma aprovação cria usuário Curador utilizável no login normal e no seletor de professores. Não se persiste senha. Toda conta/solicitação usa domínio reservado `.test` e documentação representada por texto fictício, nunca arquivo pessoal.

`Activity.curatorId` identifica o professor designado. `assignments` conserva transferências administrativas com origem, destino, motivo, data e autor. Decisões anteriores permanecem no array `decisions`. O Instrutor não altera o professor depois da submissão. Professor inativo não recebe nova submissão nem decide. Administração pode gerir permissões e reatribuir propostas Em análise/Ajustes solicitados, sem aprovar mérito acadêmico.

`delivery` representa mínimo, local/link, instruções, encontros ou videoaulas e encerramento. Planejamento estrutural segue RF10; operação de encontros/frequência é separada. Modalidades novas: Presencial, Remota síncrona e Remota assíncrona. O antigo formato Remoto é convertido na migração para Remota síncrona.

## Comandos e autorização

`src/lib/demo/state.ts` mantém criação/submissão/edição, decisões, inscrição e conclusão. `evolution.ts` centraliza solicitações docentes, decisão administrativa, ativação, transferência, operação de encontros, frequência, intervalos de vídeo e elegibilidade. As funções são puras: falha mantém o estado; sucesso retorna novo snapshot.

O Provider executa o comando contra seu ref do snapshot atual, faz um único commit e persiste. `run` permite compor os novos comandos sem outro estado de domínio. Guardas protegem rotas; comandos repetem perfil, dono, vínculo da inscrição e atribuição. A sessão armazena apenas ID em sessionStorage, e o usuário atual é resolvido no snapshot, refletindo desativação e contas recém-aprovadas. Isso representa autorização no fluxo normal; frontend/localStorage não são barreira contra manipulação.

Curadoria usa projeção individual no dashboard, fila e histórico; detalhes e comandos verificam professor designado/ativo. O histórico exibido usa atribuição atual e conserva autoria original das decisões. Transferência faz o professor anterior perder acesso ao registro por sua área.

## Frequência e conclusão

Não registrado não é falta. Acumulado = presenças / lançamentos de presença ou ausência em encontros Realizado × 100. Planejado, Cancelado e Não registrado ficam fora do denominador parcial. Sem lançamentos, mostrar Sem dados. Comparação de mínimo usa valor sem arredondar; exibição usa uma casa decimal. Presencial/síncrona exigem encerramento, ao menos um encontro computado, todos os encontros realizados lançados e mínimo atendido. Registros pendentes ou atividade aberta bloqueiam conclusão.

Assíncrona usa união dos intervalos validados dos vídeos obrigatórios, ponderados pela duração, e ao menos uma confirmação por vídeo obrigatório. O percentual mínimo é definido na proposta (0–100), sem atribuí-lo à UFC. As instruções de participação contextualizam o curso; os critérios estruturados são mínimo, conteúdo obrigatório e validação final do Instrutor.

`confirmEnrollmentCompletion` continua sendo a única transição para conclusão e conserva prevenção de duplicação, propriedade, data e inscrição. O mesmo gerador PDF original recebe os dados concluídos e mantém o aviso RF23.

## Player real

HTML5 video com controles nativos, playsInline, mídia H.264/AAC local e poster. A camada mede diferenças de posição entre eventos reais e o tempo de reprodução plausível, recusando saltos, pausa, busca, erro, página oculta e espera de confirmação. Intervalos sobrepostos são unidos; reassistência não duplica. Posição, intervalos, checkpoints e limite de segundos já confirmados persistem por participante/atividade/vídeo; reload não zera o tempo desde a última verificação.

O player pausa de imediato ao solicitar confirmação, evitando validar trechos ainda não confirmados. Prazo padrão de 30 segundos, ajustável de 10 a 120. Após expirar ou optar por continuar depois, o vídeo permanece pausado até interação explícita. Vídeo curto de 180 s usa verificação normal proporcional a 90 s; conteúdos longos usam até 300 s. Demo Studio pode ativar 15 s explicitamente, sem mudar o mínimo de conclusão. Aba oculta pausa. Erro de mídia apresenta nova tentativa e preserva progresso confirmado.

## Persistência e compatibilidade

Chave atual: `mindshare:demo:data:v3`. Leitura valida IDs, perfis, estados, referências, inscrições/capacidade, datas, decisões, organização, frequências e intervalos não sobrepostos. Payloads inválidos geram fallback com aviso sem apagar o registro original. Quota/bloqueio mantém uso em memória e comunica risco de perda.

Sem v3, a migração lê v2, atribui propostas legadas a Helena, conserva decisões, inscrições e conclusões, converte Remoto e acrescenta os três cenários novos com IDs determinísticos. v2 é preservado. A migração v1 também permanece disponível. Recarregar v3 não injeta fixtures duplicadas. Registros legados sem critérios estruturados usam compatibilidade identificada; não se inventa presença/progresso passado nem se revogam conclusões. Editar legado e fornecer nova organização ativa os critérios estruturados.

Reset só restaura as chaves do MindShare e requer confirmação pelo Demo Studio; não chama localStorage.clear. Não existe sincronização entre abas, dispositivos ou controle concorrente.

## Composição e apresentação

Áreas do Instrutor, Curador e Administração reutilizam WorkspaceFrame; Participante conserva seu layout. DeliveryInfo/DeliveryFields são compartilhados. Diálogos nativos possuem IDs únicos e fecham de forma controlada para restaurar foco. Rotas novas incluem cadastro/professor, administracao/*, instrutor/atividades/:id/frequencia e participante/atividades/:id/frequencia ou aulas.

Demo Studio fica em feature separada, com estado apenas de interface, ativado por `?demo=1` antes do hash e carregado sob demanda. Observa sessão/contexto; preenche credenciais no login normal, sem bypass, e só navega/orienta. Ações acadêmicas são realizadas nas telas do MindShare. Documentação em `demo-studio.md`.

Vite usa base `/mindshare/` para o repositório confirmado; assets usam BASE_URL e o build funciona em `/mindshare/`. HashRouter evita necessidade de rewrites. Vídeo servido localmente; PDF e Demo Studio são chunks sob demanda. Nenhuma dependência de produção nova foi necessária. Workflow em `.github/workflows/deploy.yml`, com verificações obrigatórias e base obtida do Pages. Estado da publicação em `publicacao.md`.

## Refinamento final de UX — 07/11/2026

Demo Studio foi reduzido a seleção de conta, identificação da sessão, restauração confirmada e minimizar/expandir. A seleção encerra apenas a sessão e navega ao login; `LoginPageWrapper` usa a chave de navegação para renovar o preenchimento, inclusive na mesma URL. Cenários e atalhos foram retirados da interface sem remover os exemplos de domínio.

`saveMeetingAttendance` reutiliza `operateActivity` e `recordAttendance` em um único comando atômico. Salva data confirmada, assunto e lançamentos sem alterar duração, modalidade, local ou mínimo aprovados. Assunto, autoria e data de atualização são campos opcionais aditivos do snapshot v3: snapshots anteriores continuam válidos sem migração destrutiva. Não registrado remove o lançamento explícito, permanecendo fora do denominador. Frequência de inscrição já concluída é preservada. Novos encontros ou mudanças de duração são estruturais e permanecem sujeitos à curadoria pelos fluxos de proposta existentes; a operação não expande silenciosamente o planejamento aprovado.

A página pública assíncrona lista exclusivamente as aulas associadas, sem URLs de reprodução. A área inscrita mantém HTML5 video, confirmações e intervalos únicos. Só o player apresenta barra de reprodução; o progresso acadêmico é textual. Carregamento acompanha metadata, espera, busca e prontidão, sem reinicializar a mídia em cada atualização do estado. Uma confirmação pendente reaparece ao tentar reproduzir após recarga, antes de validar novo trecho.

As ilustrações próprias ficam em `public/brand/login-acude-cedro.webp` e `register-acude-cedro.webp`, usando BASE_URL, proporção 4:5 e decoração acessível. A segunda é compartilhada pelos cadastros discente e docente. Falha opcional de imagem remove somente a arte e preserva o formulário. Em telas pequenas a composição prioriza o formulário, conforme o layout existente.

Arquivos estáticos publicados, inclusive o MP4, são públicos. Bloquear a reprodução pela navegação normal para não inscritos não oferece proteção real de conteúdo: autorização e entrega privada de mídia exigiriam backend.
