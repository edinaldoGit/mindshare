# Verificações da etapa 1

Executadas em 04/11/2026 (America/Sao_Paulo), Node 24.21.0, npm 11.19.0.

## Ferramentas e comandos

- `pdftotext -layout docs/mindshare-srs.pdf /tmp/mindshare-srs.txt`: extração completa e leitura das 13 páginas, incluindo tabelas e apêndices. `pdfinfo` confirma 13 páginas. Página 4 renderizada com `pdftoppm` e inspecionada para conferir RF02–05/RF10 e colunas.
- `npm view`: verificadas versões e engines de Vite/React/Router/Tailwind. Instalação das dependências com `npm install` e `npm install -D` concluída.
- `npm run lint`: passou, zero avisos (inclui reexecução após override de dependência).
- `npm run typecheck`: passou com tsc -b e strict.
- `npm run build`: passou; saída em dist, JS aproximadamente 303 kB (97 kB gzip). Primeiro build falhou por import de latin.css ausente; corrigido para wght.css das fontes instaladas e build repetido com sucesso.
- `npm audit`: inicialmente 10 avisos moderados propagados de minimatch nas ferramentas de lint; override ^11.0.4 aplicado e documentado. Auditoria final: **zero vulnerabilidades**. Não foi usado audit fix --force. Reavaliar override em atualização futura das ferramentas.
- `npm run dev -- --host 127.0.0.1`: servidor local iniciado e aplicação aberta no navegador. A primeira tentativa restrita de abrir porta retornou EPERM; execução local autorizada resolveu.
- `npm run preview -- --host 127.0.0.1 --base /mindshare/`: build de produção iniciado em subpasta local, sem deploy.

## Revisão no navegador

- Página inicial inspecionada visualmente em desktop (viewport normal 1074 px) e celular (360 px). Capturas em validation/foundation-desktop.png e validation/foundation-mobile.png; preview resumido em foundation-preview.png.
- Larguras 360, 640, 768, 1280 e 1920 px: scrollWidth respectivamente 345, 625, 753, 1265 e 1905; nenhum excede a largura. A diferença de 15 px é a barra vertical do navegador. Isso verifica amostras da página inicial, não todo intervalo/telas futuras.
- Imagens da logo e dS: complete e naturalWidth > 0, inclusive no build sob /mindshare/. Fonte computada: Inter Variable.
- Botão Conheça a fundação rola até a seção sem alterar a rota do HashRouter.
- Link da área do participante abre placeholder; recarregar mantém rota e conteúdo; retorno ao início funciona. Foco e título atualizados a cada rota.
- Build em /mindshare/: catálogo abre e recarrega em /mindshare/#/catalogo, com aviso de desenvolvimento. Logo/ícone usam /mindshare/brand/... corretamente.
- Logs consultados no navegador de produção: nenhum erro ou aviso capturado.

## Limites

Não executados: auditoria WCAG automatizada completa, testes com cinco discentes, matriz das duas versões de Chrome/Firefox/Edge/Safari, testes de carga, uptime, segurança de servidor, armazenamento de cinco anos e publicação real no GitHub Pages. Não afirmar conformidade integral dos RNF com base nesta revisão. Seleção de perfis, dados demonstrativos, persistência, autenticação e jornadas funcionais estão planejados, não implementados.

# Verificações da Etapa 2

Executadas em 04/11/2026 (America/Sao_Paulo), Node 24.21.0, npm 11.19.0. Inspeção no navegador integrado do Codex, usando o build de produção local sob `/mindshare/` (sem deploy). O servidor de preview da Etapa 1 permaneceu disponível durante a revisão.

## Comandos e resultados

- `npm test`: **19 testes aprovados**, zero falhas. Node test/assert e remoção de tipos nativa, sem dependência de testes adicionada. Cobertura: título, ementa, acentos, área, limites inclusivos de horas, formato, vagas, combinação de todos os filtros, limpeza, vazio, quatro estados não publicados, detalhes por ID, ausência de mutação em consultas, credenciais fictícias, validação de cadastro, domínio configurável, perfis, retorno interno e bloqueio/expiração.
- `npm run lint`: passou, zero avisos. Uma chamada de relógio adicionada ao handler foi sinalizada pela regra de pureza durante o refinamento; removida, e a versão final passou sem desativar regras.
- `npm run typecheck`: passou, TypeScript estrito.
- `npm run build`: passou. Saída final aproximada: JS 350,92 kB / 110,25 kB gzip; CSS 52,40 kB / 13,72 kB gzip. Esses são tamanhos do build, não métricas de tempo ou carga do SRS.
- Prettier executado temporariamente via `npm exec --package=prettier`, sem acrescentar dependência ao package.json.
- Nenhuma dependência de produção adicionada nesta etapa. Originais de marca comparados com as cópias de produção, sem diferença.

## Cenários operados na interface

- Busca por `juncoes` encontrou SQL pela ementa, sem depender do título.
- Combinação Design + Presencial + mínimo 6 h + máximo 6 h + com vagas retornou somente a oficina Figma, com chips de todos os critérios. A revisão detectou perda de critérios em eventos rápidos com navegação concorrente; HashRouter passou a usar useTransitions=false. Cenário repetido sem perda de filtros.
- Limpeza restaurou 12 atividades; combinação sem correspondência exibiu estado vazio e ação de restauração.
- Card abriu detalhes com clique/toque e teclado Enter. Voltar ao catálogo preservou os critérios. Quatro propostas não aprovadas são excluídas nos testes; uma proposta Em análise foi consultada por ID na interface e exibiu indisponível.
- ID inexistente apresentou Atividade não encontrada; visitante em /participante foi redirecionado ao login com retorno. Evidências em route-checks.json.
- Entrar para participar preservou retorno da oficina; após login de Discente, retornou aos detalhes, exibiu aviso da Etapa 3 e conservou sete vagas. Nenhuma inscrição foi criada.
- Login vazio apresentou erros associados e foco no primeiro campo. Credencial inválida exibiu recusa. Mostrar/ocultar senha alternou o tipo de campo. Quinta falha exibiu bloqueio por 15 min e desabilitou submissão; a expiração foi testada com relógio controlado em teste unitário, sem esperar 15 minutos reais. Reload reinicia o contador local, limitação intencional da simulação.
- Cadastro vazio mostrou erros de nome, domínio, senha, confirmação e consentimento. Dados inteiramente fictícios válidos produziram sucesso, data de consentimento em memória e foco no novo título. Nenhuma conta real criada; a continuação usa Alex Costa.
- Discente entrou nos placeholders Participante e Instrutor com a mesma sessão; /curadoria recusou acesso. Sessão se manteve ao recarregar. Professor Curador entrou em Curadoria e foi recusado ao tentar /instrutor/propostas/nova. Logout voltou ao início. Visitantes não acessam placeholders internos sem sessão.
- Menu mobile abriu, fechou com Escape e devolveu foco ao botão; navegação fechou o menu. Painel mobile de filtros abriu, aplicou área temática, indicou dois resultados e fechou com Escape com foco no acionador.
- Convites da landing, como funciona, destaques e rodapé foram inspecionados. Logs de erro/aviso consultados ao final: vazios.

## Responsividade e referências visuais

Verificação DOM no build final: **5 páginas × 6 larguras = 30 casos**, em 360, 390, 768, 1024, 1440 e 1920 px. Nenhum scrollWidth excedeu o viewport e nenhum elemento de main ultrapassou a borda direita. Valores detalhados e títulos de confirmação em `validation/stage2/responsive-checks.json`. Barra vertical ocupa aproximadamente 15 px. Cabeçalho com sessão Discente também conferido em 768 px, sem overflow.

Inspeção visual das cinco páginas em desktop e celular; referências salvas em `validation/stage2/`:

- home-desktop.png e landing-mobile.png: hero da landing (desktop 1440 px, celular 390 px).
- landing-sections-desktop.png e landing-footer-desktop.png: passos, destaques, convite ao instrutor, chamada final e rodapé.
- catalogo-desktop.png e catalogo-mobile.png.
- detalhes-desktop.png e detalhes-mobile.png.
- login-desktop.png, login-mobile.png e login-blocked-mobile.png.
- cadastro-desktop.png e cadastro-mobile.png.

As capturas representam viewports, não a extensão completa das páginas. Uma captura mobile de página inteira não foi fornecida pelo navegador; as referências foram feitas por viewport e as regiões seguintes revisadas por navegação/rolagem.

## Limites preservados

Sem testes nas duas versões dos quatro navegadores, auditoria WCAG completa, teste com cinco discentes, medição de concorrência/carga, uptime ou publicação remota. Domínios oficiais e categorias institucionais aguardam confirmação. RF01–03/RNF09/RNF10 permanecem simulações parciais. RF17 foi adiado para Etapa 3; inscrição, acompanhamento, conclusões e PDF não foram antecipados. Nenhuma implementação de segurança real ou conformidade legal é afirmada.

# Verificações da Etapa 3

Executadas em 04–05/11/2026, no build de produção local sob `/mindshare/`, sem deploy.

## Comandos e resultados

- `npm test`: **50 testes aprovados**, zero falhas. Preservados os 19 testes da Etapa 2; adicionados 26 de participação/estado/persistência/recomendação e cinco de comprovantes.
- `npm run lint`: passou, zero avisos. `npm run typecheck`: passou com modo estrito. `npm run build`: passou.
- Build: entrada JS aproximadamente 383,78 kB / 118,65 kB gzip; módulo PDF carregado sob demanda aproximadamente 422,59 kB / 176,96 kB gzip; CSS 69,07 kB / 16,30 kB gzip. Tamanhos não representam medição de desempenho do SRS.
- Única dependência de execução acrescentada: pdf-lib. Auditoria durante a instalação: zero vulnerabilidades.

## Cenários operados no navegador

- Alex iniciou com três inscrições, duas conclusões, 10 horas e dois comprovantes. A inscrição na oficina Figma reduziu sete vagas para seis; catálogo, detalhes e dashboard passaram a refletir o mesmo estado. Nova inscrição não alterou horas nem comprovantes.
- Recarregar conservou a inscrição e seis vagas; o botão de inscrição foi substituído pelo acompanhamento. Após confirmar, o foco vai ao link Acompanhar atividade.
- Minhas Inscrições filtrou duas concluídas; histórico mostrou apenas essas conclusões. Atividade inscrita não oferece conclusão nem PDF. Atividade concluída apresenta data, carga horária e download.
- Recomendações: Programação e limite de oito horas, ocultando inscrições existentes, retornou somente Algoritmos (8 h); limite de uma hora apresentou vazio. O limite é por atividade, não soma de resultados.
- Visitante recebeu Entrar para participar com retorno aos detalhes. Login do Professor Curador conservou esse retorno, mas não apresentou ação de inscrição; `/participante` recusou esse perfil.
- Reiniciar abriu confirmação com foco inicial em Cancelar; Escape cancelou e restaurou foco. Confirmar restaurou três inscrições/duas conclusões/10 h/dois PDFs e manteve a sessão. Reload conservou o estado restaurado.
- Navegação móvel pelo seletor nativo operada nas cinco páginas principais; títulos e foco mudaram com as rotas.
- Estados sem vagas, duplicidade, atividade não aprovada, último assento, identidade/perfil, conclusão indevida, integridade do armazenamento, versões inválidas e falhas de quota/acesso foram verificados por testes automatizados. Falhas de armazenamento foram simuladas com adaptadores; não se afirma teste de quota real do navegador.

## Comprovantes PDF

- Download real na interface gerou `mindshare-comprovante-web-acessivel.pdf`. Texto extraído e conferido: Alex Costa, título da atividade, Renê Lima, seis horas, conclusão em 04/11/2026, identificação demonstrativa e aviso RF23. Evidência em `validation/stage3/pdf-browser-fields.txt`.
- Dois exemplos finais em `output/pdf/`, gerados pela mesma função da aplicação. Ambos renderizados com Poppler e revisados visualmente; previews em `validation/stage3/comprovante-acessibilidade.png` e `comprovante-comunicacao.png`. Acentos, quebra de texto, marca e aviso legíveis, sem sobreposição.
- Geração restrita à inscrição concluída do usuário atual, inclusive na função que prepara o documento; testes verificam recusa de outro participante, não concluída e perfil indevido. O PDF não representa certificação oficial.

## Responsividade e evidências

- **Oito telas × seis larguras = 48 casos**: 360, 390, 768, 1024, 1440 e 1920 px. Dashboard, inscrições, histórico, comprovantes, recomendações com resultado, acompanhamento inscrito/concluído e detalhes públicos. Nenhum scrollWidth excedeu o viewport; nenhum elemento visível de main ultrapassou a borda direita. Registros em `validation/stage3/responsive-checks.json`.
- Inspeção visual em desktop e celular, com capturas em `validation/stage3/`: dashboard, inscrições, histórico, comprovantes, recomendações, acompanhamento inscrito/concluído, inscrição confirmada e diálogo de reinício. As imagens são capturas por viewport.
- Logs de erro/aviso consultados ao final: vazios. Marca original comparada com os arquivos do build, sem diferença; estilos utilizam os tokens existentes. Diálogo nativo, estados textuais, navegação móvel com rótulo, foco após rotas e ações, campos associados e controles por teclado revisados nos fluxos operados.

## Limites e preparação seguinte

Sem backend, deploy, autenticação real, auditoria WCAG integral, matriz de navegadores, teste com cinco discentes, carga/concorrência entre navegadores, uptime ou retenção de cinco anos. Persistência local não sincroniza abas ou dispositivos e não constitui controle de acesso de produção. Domínios e categorias institucionais continuam pendentes.

RF17–19 e RF21–23 demonstrados localmente; RF20 tem comando puro preparado e testado, sem interface nesta etapa. Participante não confirma sua conclusão. Propostas, curadoria e interface do Instrutor permanecem para etapas seguintes. Dados, históricos e perfis são fictícios. Os registros das Etapas 1 e 2 acima descrevem o estado histórico de cada entrega; esta seção registra o comportamento atual.

# Verificações da Etapa 4

Executadas em 05/11/2026 (America/Sao_Paulo), no build de produção servido localmente sob `/mindshare/`. Não houve deploy.

## Comandos e resultados

- `npm test`: **64 testes aprovados**, zero falhas. Os 50 testes anteriores continuam passando; foram adicionados cenários de domínio, autorização, migração e integração entre conclusão, histórico e PDF.
- `npm run lint`: passou sem avisos.
- `npm run typecheck`: passou (`tsc -b`, configuração estrita).
- `npm run build`: passou. Saída: JS principal 423,81 kB / 126,99 kB gzip; módulo PDF carregado sob demanda 422,59 kB / 176,96 kB gzip; CSS 83,19 kB / 18,49 kB gzip. São tamanhos de artefato, não medições de desempenho do SRS.
- Nenhuma dependência foi adicionada na Etapa 4.

## Fluxos operados no navegador

- A sessão de Alex manteve o mesmo Discente ao alternar Participante ↔ Instrutor. A rota `/instrutor` exibiu métricas derivadas do estado e as propostas/atividades pertencentes a Alex.
- Migração v1→v2 apresentou aviso e preservou inscrições. Reset demonstrativo restaurou propostas/inscrições seed e manteve a sessão.
- Formulário vazio mostrou quatro erros junto aos campos e moveu o foco ao título. Uma proposta válida foi salva como Rascunho, com autor e data, e aberta em detalhes.
- O diálogo de submissão explicou que não há aprovação nem publicação automática. Após confirmar, a proposta permaneceu Em análise com data registrada; detalhes informaram que aguarda curadoria.
- A proposta de Ajustes solicitados foi aberta e editada pelas telas próprias; após salvar, o comentário da curadoria e o estado permaneceram até a nova submissão. Estados Em análise/Aprovada/Rejeitada não oferecem edição.
- Na gestão de atividade aprovada de Alex, Júlia apareceu como Inscrita. Após confirmar no diálogo, a inscrição mudou para Concluída sem alterar a ocupação de vaga. O dashboard/histórico de Júlia passou a exibir 6 horas e um comprovante.
- Download real na página de histórico preparou `mindshare-comprovante-atividade-alex-oficina.pdf`, PDF 1.7 de uma página. `pdfinfo` confirmou título/autor/assunto demonstrativos; a geração usa a função existente da Etapa 3. Arquivo baixado em `~/Transferências/`.
- Logs do navegador não foram usados como substituto dos estados visíveis. O caso de rota de participantes revelou incompatibilidade no nome do parâmetro; foi corrigida e a página repetida com cabeçalho, atividade, inscrições e ações visíveis.

## Responsividade, acessibilidade observada e evidências

- **7 páginas × 6 larguras = 42 casos**: `/instrutor`, propostas, criação, detalhes de ajustes, edição autorizada, atividades e participantes; larguras 360, 390, 768, 1024, 1440 e 1920 px. Todos mostraram título principal e nenhum `scrollWidth` excedeu o viewport. Registro por caso em `validation/stage4/responsive-checks.json`.
- Em 360 px, os erros do formulário ficaram visíveis com foco no primeiro campo. Diálogo de submissão mediu 305 px dentro do viewport; `scrollWidth` permaneceu 345 px em viewport 360 px (diferença de barra vertical), sem overflow horizontal.
- Capturas por viewport em `validation/stage4/`: `instructor-dashboard-final.jpg`, `instructor-dashboard-mobile.jpg`, `instructor-participants-completed.jpg`, `proposal-errors-mobile.jpg`, `submission-dialog-mobile.jpg` e `participant-history.jpg`.
- Revisão manual confirmou labels, mensagens associadas, erros textuais, estado de proposta não comunicado apenas por cor, foco no primeiro erro, títulos hierárquicos e diálogo com explicação contextual. Essa revisão não substitui auditoria WCAG automatizada ou testes em múltiplos leitores de tela.

## Limites e preparação da Etapa 5

Sem backend, autenticação real, sincronização entre abas/dispositivos, concorrência distribuída, testes com cinco discentes, matriz completa de navegadores, auditoria WCAG integral, carga, uptime ou deploy. A amostra Júlia é uma persona fictícia separada para operar a jornada completa. O documento PDF é demonstrativo e não confirma reconhecimento oficial de horas.

RF04, RF05, RF10 e RF20 estão demonstrados localmente e cobertos por testes. RF11 continua publicando somente Aprovada. O snapshot v2 conserva a coleção única `Activity`; `approveProposal` já altera esse mesmo registro para integração futura, mas não está exposto na interface. A Etapa 5 pode criar fila Em análise e comandos do Professor Curador para aprovação, rejeição e solicitação de ajustes sem introduzir uma coleção paralela.

# Verificações da Etapa 5

Executadas em 05/11/2026 (America/Sao_Paulo), no navegador integrado e no build de produção local em `http://127.0.0.1:4173/mindshare/`, sem deploy. SRS original extraído e critérios RF06–RF11 conferidos antes da implementação. O serviço de aprovação existente foi localizado e reutilizado.

## Comandos e resultados

- `npm test`: **86 testes aprovados**, zero falhas. Os 64 anteriores foram preservados; 22 testes novos cobrem fila, três decisões, campos, perfis, estados indevidos, duplicidade, identidade, busca/filtros, reenvio, histórico, persistência, reset e a jornada completa até PDF.
- `npm run lint`: passou, zero avisos. `npm run typecheck`: passou. `npm run build`: passou.
- Build final aproximado: JS principal 446 kB / 132 kB gzip; PDF sob demanda 422,59 kB / 176,96 kB gzip; CSS 88,95 kB / 19,39 kB gzip. Tamanhos de arquivos não comprovam métricas concorrentes de desempenho do SRS.
- `git diff --check`: executado sem erros. O checkout contém os arquivos não rastreados das entregas anteriores; esse comando cobre o diff rastreado. Fontes alteradas foram formatadas com o Prettier já disponível no cache local, sem instalação ou dependência nova.
- Schema permanece v2: o modelo já guardava todas as informações de decisão necessárias. Testes confirmaram leitura de snapshot anterior compatível, preservação das inscrições/conclusões e round-trip dos ciclos novos. A migração v1→v2 continua passando nos testes anteriores.

## Jornada completa operada no navegador

Sem alterar o armazenamento manualmente ou chamar comandos pela avaliação do navegador:

1. Alex criou “Laboratório de leitura e prototipação inclusiva”, cinco horas, Remoto, dez vagas; salvamento abriu detalhes Rascunho e submissão registrada levou a Em análise.
2. Helena encontrou a proposta na fila e abriu os detalhes. Solicitação de ajustes sem texto e com espaços foi recusada. Descrição válida registrou Ajustes solicitados e comentário.
3. Alex consultou o feedback, abriu edição autorizada, acrescentou prática em duplas e verificação de contraste, salvou mantendo comentário/status e reenviou a mesma proposta.
4. Helena encontrou o reenvio na fila; detalhes mostraram o texto alterado e a decisão anterior. Aprovação confirmada levou a Aprovada, com data/autoria e registro anterior conservado. Reload manteve a decisão.
5. Júlia encontrou a atividade por busca e combinação de área, formato, cinco horas e vagas. Detalhes permitiram inscrição, reduzindo dez para nove vagas. Dashboard mostrou a nova atividade.
6. Alex abriu suas atividades aprovadas, localizou Júlia e confirmou a conclusão no diálogo. Inscrição ficou Concluída; nove vagas permaneceram.
7. Júlia consultou histórico de cinco horas/uma conclusão e baixou o PDF demonstrativo real.

ID preservado durante o ciclo: `575556a9-7cd7-44fe-81c9-d3150e9f96f8`. Relato estruturado em `validation/stage5/browser-journey.json`; evidências de histórico e documento no mesmo diretório. Ao terminar os testes, os exemplos foram restaurados pela interface, mantendo a sessão de Helena; a proposta do teste permanece documentada nas evidências, e não no seed restaurado.

## Demais cenários de interface

- Rejeição sem justificativa e com espaços permaneceu no formulário com erro e foco no campo. Motivo válido alterou a proposta de Alex para Rejeitada; o Instrutor viu a justificativa e não recebeu link de edição.
- Discente em `/curadoria/propostas` e Professor em `/instrutor/propostas/nova` receberam recusa de perfil. Os testes também recusam decisões por Discente/visitante e conclusão pelo Curador.
- Filtro Ajustes solicitados no histórico conservou o evento da proposta posteriormente aprovada; o cartão informou “Situação atual: Aprovada”. Nenhum histórico independente foi preenchido manualmente.
- Decidir todas as pendências exibiu fila vazia real. Reset confirmado pelo Professor restaurou três pendências, incluindo a nova amostra de escrita científica, mantendo Helena na sessão; reload conservou o snapshot restaurado.
- Navegação móvel pelo seletor foi operada até análise e dashboard. Títulos receberam foco nas rotas; sucesso focou a mensagem. A revisão identificou foco perdido ao cancelar com Escape: o diálogo passou a fechar antes da desmontagem. Repetição confirmou retorno ao botão de decisão nas três ações e seis larguras.
- Logs de erro/aviso consultados ao final: vazios. Não há aprovação automática, inscrição criada por aprovação ou atividade duplicada por decisão.

## PDF da jornada

O arquivo baixado foi copiado sem alteração para `output/pdf/mindshare-jornada-completa-etapa5.pdf`. `pdfinfo` confirmou PDF 1.7, A4, uma página, título/autor demonstrativos e aviso RF23 no assunto. Texto extraído confirmou Júlia Torres, Alex Costa, título da nova atividade, cinco horas, conclusão em 05/11/2026 e aviso de não garantia de reconhecimento pela UFC. Extração em `validation/stage5/complete-journey-pdf.txt`.

Página renderizada com Poppler e inspecionada visualmente em `validation/stage5/complete-journey-pdf.png`: conteúdo legível, sem sobreposição ou recorte de texto. O ambiente de renderização emitiu avisos de cache Fontconfig; não impediram a geração da imagem. A biblioteca e a lógica de PDF da Etapa 3 foram reutilizadas.

## Responsividade e evidências

- Quatro rotas novas, com variantes de análise Em análise/Aprovada/Rejeitada/Ajustes solicitados, indisponibilidade e fila vazia: **54 verificações de páginas/estados** nas larguras **360, 390, 768, 1024, 1440 e 1920 px**. Todas apresentaram h1 e nenhum documento ou elemento visível de main ultrapassou horizontalmente o viewport. Registros em `validation/stage5/responsive-checks.json`.
- Três diálogos nas mesmas seis larguras: **18 verificações**, incluindo erros de rejeição/ajustes e cancelamento por Escape. Todos permaneceram dentro das bordas horizontal e vertical do viewport, e o foco retornou ao acionador. Registros em `validation/stage5/dialog-responsive-checks.json`. Somados, são **72 casos**.
- Capturas por viewport em `validation/stage5/`: dashboard desktop/mobile, fila desktop, análise desktop/mobile, histórico filtrado desktop, rejeição com erro mobile, fila vazia mobile e histórico do participante após a jornada. As imagens não representam a extensão inteira das páginas.

## Limites e Etapa 6

Não executados: auditoria WCAG automatizada integral, matriz das duas versões de Chrome/Firefox/Edge/Safari, testes com cinco discentes, carga concorrente, segurança de servidor, uptime ou retenção de cinco anos. Persistência local não sincroniza abas/dispositivos; guards não são segurança contra manipulação. Categorias e vínculo institucional continuam exemplos. Histórico preserva todas as decisões e a submissão mais recente, sem versionar conteúdo nem inventar datas de envios antigos.

RF06–RF11 estão demonstrados no recorte local, e a jornada central está completa. A estrutura está pronta para refinamento transversal, auditoria, ampliação dos testes e preparação de GitHub Pages na Etapa 6. Nenhum backend ou deploy foi implementado nesta etapa.

# Verificações da evolução final — SRS 1.3

Concluídas em 06/11/2026, após implementação iniciada em 05/11/2026. Esta seção representa o estado atual; as seções anteriores preservam o histórico das etapas e seus resultados da época. Build de produção verificado em `http://127.0.0.1:4173/mindshare/?demo=1#/`, sem publicação.

## Qualidade e documentos

- **143 testes executados e aprovados, zero falhas**: 86 anteriores preservados e 57 novos testes de domínio, autorização, migração, frequência, intervalos assistidos, checkpoints, persistência e conclusão. `npm test`, `npm run lint`, `npm run typecheck` e `npm run build` passaram. Resultados completos em `validation/final/`.
- `git diff --check` passou; como o checkout contém arquivos não rastreados das entregas, o comando não valida todo esse conteúdo. Fontes alteradas foram formatadas com o formatador disponível localmente.
- Nenhuma dependência nova de produção. Build: JavaScript principal 494,31 kB / 146,39 kB gzip; Demo Studio sob demanda 8,26 / 3,14 kB; PDF sob demanda 422,59 / 176,96 kB; CSS 93,50 / 20,53 kB.
- SRS 1.3 completo: 44 RF e 22 RNF, IDs únicos e preservados. Fonte Markdown e PDF de 15 páginas; todas as páginas renderizadas e inspecionadas, sem cortes ou sobreposições. PDFs original e 1.2 preservados.

## Jornadas reais no navegador

Operadas pela interface, sem preencher armazenamento manualmente ou invocar comandos de negócio pelo console:

1. Sofia Andrade solicitou cadastro docente com evidência fictícia; Clara aprovou administrativamente e a nova professora apareceu nos seletores. Solicitação `8e91b075-b7ef-4a92-a9a9-b399bea6d1e2`.
2. Alex criou “Oficina de narrativa visual inclusiva”, quatro horas, modalidade presencial, escolheu Sofia e submeteu. ID `cda698f9-28ae-4837-9eca-edf4af59cb06`. Marcos não conseguiu acessar sua análise. Sofia solicitou ajustes; Alex editou e reenviou o mesmo registro; Sofia aprovou conservando o histórico.
3. Júlia inscreveu-se; Alex marcou encontro realizado, presença e encerramento. A elegibilidade mostrou 100% de frequência, mínimo de 75% e nenhuma marcação pendente. Conclusão confirmada; Júlia consultou o histórico e baixou PDF real. Arquivo e texto extraído: `validation/final/journey-certificate.pdf` e `.txt`. Página renderizada e inspecionada visualmente.
4. Júlia inscreveu-se no curso assíncrono e reproduziu o arquivo local inteiro. Metadados: 180 s, 320 × 180, sem erro. Total validado: 179,6058349609375 s (**99,781%**, exibidos como 99,8%). Confirmação normal aberta em aproximadamente 90 s; após expirar, o vídeo continuou pausado no mesmo instante. Confirmação retomou a reprodução. Reload conservou progresso e confirmação. Alex confirmou a conclusão; Júlia chegou a 4,5 horas no histórico e baixou o comprovante assíncrono real (`async-certificate.pdf` e `.txt`).
5. Clara transferiu proposta pendente de Helena para Marcos com justificativa; fila e histórico reagiram sem mudar o estado acadêmico. Desativação e reativação de Beatriz foram operadas. Rejeição de Renata sem motivo foi impedida; motivo válido registrou a decisão. Administração não acessou criação de proposta como Instrutor.
6. Alex iniciou a mesma videoaula com progresso próprio, separado do de Júlia. Modo de apresentação de 15 s e prazo ajustado para 10 s foram operados. Expiração pausou; reload não eliminou a confirmação pendente. Avanço pelos controles nativos de 15,692006 para 17,492 s, com vídeo pausado, manteve o progresso validado em 15,408492 s: salto não foi creditado.
7. Formulário com campos centrais preenchidos, mas sem curador e organização, recusou salvamento, mostrou erros associados e focou a seção pertinente. Nenhuma proposta foi criada por esse salvamento inválido.

Mídia decodificada integralmente por FFmpeg sem erro; arquivo local de 4.718.180 bytes, SHA256 `57c4fbfd9618ac685f9e7d50cb7fc64ec432670bb7e619eb31db95bc6af0a814`. Origem, licença CC BY 3.0 e modificações documentadas em `media-licenses.md`. Evidências de reprodução e persistência em `validation/final/media-browser-checks.json`.

## Responsividade, acessibilidade e correções

**144 casos nas larguras 360, 390, 768, 1024, 1440 e 1920 px**, com altura de 900 px: 120 páginas/estados, 12 verificações do Studio expandido/minimizado e 12 diálogos de conclusão/confirmação de vídeo. Nenhum transbordamento horizontal nos casos finais; diálogos e Studio permaneceram dentro das bordas. A largura útil exclui a barra de rolagem.

Páginas/estados: cadastro docente; dashboard, lista e detalhe administrativos; gestão de curadores; dashboard, fila, detalhe e histórico de curadoria; formulários presencial, síncrono e assíncrono; erros de realização obrigatória; frequência do Instrutor vazia e preenchida; frequência do Participante; relatório de progresso do Instrutor; conclusão com critérios; videoaula; histórico integrado. Registros em `responsive-checks.json`, `studio-checks.json` e `dialog-checks.json` na pasta final.

Problemas identificados e corrigidos: IDs repetidos em diálogos, restauração de foco com Escape, conversão de data/hora local, recorte de 3 px do Studio em telas pequenas, centralização e altura da confirmação de vídeo, associação/foco de erros dos novos campos, seleção de curador indisponível, schema numérico estrito, conservação da migração em memória quando há quota e união de intervalos sem preencher lacunas não assistidas. Testes finais passaram após as correções. Logs de erros/avisos do navegador consultados ao terminar: vazios.

Studio ausente na URL normal e presente somente com `?demo=1` antes do hash. Seleção preencheu o login normal, sem autenticação automática. Ao terminar, restauração confirmada pela interface removeu os dados criados nos ensaios, trouxe novamente as seis contas iniciais e os indicadores iniciais, desativou verificações aceleradas e encerrou a sessão. Evidências preservam os resultados anteriores ao reset.

## Limites e publicação

Teste em navegador integrado; não constitui matriz de Chrome/Firefox/Edge/Safari, auditoria WCAG integral, ensaio de carga, teste simultâneo com cinco discentes ou verificação de retenção por cinco anos. Identidade, vínculo docente, decisões e documentos são demonstrativos. Armazenamento local e guards de interface não substituem backend, autenticação e autorização de servidor, nem sincronizam dispositivos.

Build estático com base relativa, HashRouter, mídia local e Demo Studio por query compatível com subdiretório. Vídeo carregou no preview de produção sob `/mindshare/`. Nenhum serviço local é exigido pelo aplicativo publicado; o servidor de preview serve apenas para validação. Não houve deploy. Restam revisão final do repositório, configuração da publicação no GitHub Pages, publicação e teste da URL pública.

# Entrega pública — etapa 6

Publicado em 06/11/2026 no repositório existente `edinaldoGit/mindshare`, sem mudança de visibilidade. Relatório vigente com URLs, execução, resultados e limites: [publicacao.md](publicacao.md). Roteiro: [apresentacao.md](apresentacao.md).

Instalação limpa por lockfile, 143/143 testes, lint, typecheck e build aprovados localmente e no primeiro workflow público. Auditoria npm retornou zero vulnerabilidades conhecidas. Revisão pré-publicação não encontrou segredos nos arquivos; nenhum documento docente real ou senha institucional foi incluído.

Os fluxos públicos efetivamente operados incluem cadastro/aprovação docente, login dos quatro papéis, criação/submissão/aprovação de proposta atribuída, bloqueio de outro Curador, inscrição, frequência/encerramento/conclusão, reprodução integral do MP4 público, confirmação expirada com pausa e retomada, persistência e download real de PDF. Júlia atingiu 99,6% de progresso validado no Pages; Alex começou com progresso próprio zerado. Resultados independentes das métricas locais anteriores.

Foram feitas 48 verificações adicionais nas seis larguras usuais: login/cadastro locais alterados; landing e videoaula públicas; Studio aberto/minimizado e diálogos públicos de vídeo/restauração. Sem transbordamento nos resultados finais. Evidências em `validation/publication/`. As 144 verificações anteriores permanecem como histórico, sem alegação de repetição integral.

Na revisão pública, o indicador do cenário docente não reconheceu a nova solicitação decidida porque acompanhava apenas a amostra inicial; o predicado foi corrigido e todas as verificações de código passaram novamente. Nenhuma funcionalidade acadêmica foi alterada.

A validação continua restrita ao navegador integrado, sem matriz completa, auditoria WCAG integral, Lighthouse, teste concorrente ou serviço institucional real. Snapshot local não sincroniza dispositivos. O relatório de publicação distingue configuração, deploy bem-sucedido e verificações efetivamente operadas.

# Refinamento definitivo de UX — 07/11/2026

Esta seção é a revisão vigente e preserva os relatórios anteriores como histórico. SRS v1.3 lido e preservado, junto de arquitetura, matriz, design system, Demo Studio, configuração Vite/HashRouter e workflow existente.

## Implementação e verificações locais

Demo Studio reduzido a seleção, sessão, restauração confirmada e minimizar/expandir. Seleção navega diretamente ao login preenchido e minimiza o painel, sem autenticar; re-selecionar a mesma conta também restaura o preenchimento. O clique em Entrar continua obrigatório. Troca de conta conservou inscrições e frequência. Cancelar restauração por Escape fechou o diálogo e devolveu foco ao botão; confirmar manteve a sessão inicial de Alex e restaurou os exemplos.

Encontros e frequência agora é acessível diretamente nos cartões de Minhas atividades e na gestão de participantes: `/instrutor/atividades/:activityId/frequencia`. Seleção por dia, data/horário confirmado, assunto e Presente/Ausente/Não registrado são salvos em um único comando atômico que reutiliza os serviços existentes. Cada participante consulta `/participante/atividades/:activityId/frequencia`. Registros pendentes não são ausência. Fórmula RF36 preservada: presenças / registros explícitos de encontros realizados × 100, sem ponderação por duração. Não há conclusão antecipada nem novo comando de conclusão. Duração, local, modalidade e mínimo permanecem protegidos pelo planejamento aprovado; novos encontros estruturais continuam sujeitos à curadoria.

Jornada local operada pela interface: Júlia inscreveu-se na oficina (20→19 vagas); Alex selecionou o encontro, informou “Introdução à prototipação colaborativa” e salvou presença. Júlia consultou o assunto, 100% parcial, encontro futuro Não registrado e nenhum controle de edição. A troca de conta e recarga conservaram os registros.

Página pública assíncrona mostra uma aula realmente associada, descrição, duração e indicação de acesso após inscrição. Não há elemento de vídeo nem link MP4 nesse fluxo. A área inscrita prioriza o player; progresso acadêmico é textual, sem barras adicionais. A mídia permanece Big Buck Bunny, 180 segundos, local e com atribuição CC BY 3.0. Página acadêmica de revisão conserva todas as informações e orientações do planejamento.

Reprodução local efetiva: confirmação normal aos **90,220216 s**, vídeo pausado; expiração manteve exatamente o ponto e **50,0%** validado. Retomada por Enter registrou uma confirmação e voltou a reproduzir. Recarga conservou os 50,0%, a confirmação e recuperou **90,220216 s** após metadata. Mensagem de carregamento desapareceu; não existem elementos `progress` adicionais na videoaula. Diálogo e controles operados por teclado. Saltos e elegibilidade continuam cobertos pelos testes de domínio existentes.

Ilustrações encontradas e integradas: `public/brand/login-acude-cedro.webp` e `register-acude-cedro.webp`; a segunda é usada nos dois cadastros. Proporção 4:5 sem corte, BASE_URL, decoração acessível e prioridade do formulário no mobile. Ausência opcional testada retirando temporariamente a primeira imagem: formulário preservado, zero imagens quebradas remanescentes e build aprovado. Arquivo restaurado antes do build final.

## Evidências e qualidade

`validation/ux-final/` contém comandos e resultados, métricas de responsividade, painel, diálogos e capturas. **162/162 testes aprovados**: os 143 anteriores preservados e 19 novos casos; resultados em `test-results.txt`. Lint, typecheck, build e diff foram executados novamente após os ajustes finais. O player passou a ser um chunk sob demanda para conservar o tamanho do pacote principal e evitar carregamento de código de vídeo na landing.

**54 verificações de páginas**: login, cadastro discente/docente, gestão de atividades, frequência presencial/síncrona do Instrutor, Minha frequência, detalhes públicos assíncronos e videoaula; larguras 360, 390, 768, 1024, 1440 e 1920 px, altura 900 px. Títulos presentes e nenhum overflow horizontal. Autenticação foi repetida após ajustar tamanho e proporção das ilustrações. Mais seis verificações do diálogo de vídeo e seis da restauração, com todos dentro da viewport; painel expandido e minimizado também medidos nas seis larguras, somando 78 verificações locais de páginas/painel/diálogos. Esses casos não representam repetição das 144 verificações históricas.

Console local consultado durante a reprodução: sem erros/avisos. A falha de imagem provocada deliberadamente gera a requisição malsucedida esperada; ela não é ocultada como se não tivesse ocorrido. Teste limitado ao navegador integrado, sem auditoria WCAG completa, matriz de navegadores, carga, estudo com usuários ou sincronização entre dispositivos.

## Publicação desta revisão

Resultado do novo deploy e verificações públicas serão registrados em `publicacao.md` e na continuação desta seção após a conclusão efetiva. O workflow existente foi confrontado com as documentações oficiais atuais do Vite e GitHub Pages; base `/mindshare/`, branch `main`, artefato `dist`, validações obrigatórias, Actions oficiais fixadas e permissões adequadas por job foram preservados. Nenhuma alteração de visibilidade ou force push é necessária.

### Correção descoberta na hospedagem

A primeira publicação desta rodada (`9ab4ee6`, workflow `42414298946` bem-sucedido) permitiu validar frequência presencial/síncrona, cálculos 50%/100%/pendência, encerramento, conclusão e PDF. A reprodução pública revelou uma condição de corrida: com metadata em cache ou clique muito cedo após reload, o evento inicial podia ser perdido e a confirmação abrir antes de recuperar o ponto salvo.

A inicialização passou a observar os eventos reais e a prontidão já existente do elemento, restaurando a posição antes de liberar controles e validação. Não há recarga extra de mídia. Teste local com cache: antes do reload, 26,064795 s e 14,3%; após metadata, **25,865506 s** (última posição validada persistida), mesmos **14,3%**, pausado e sem loading permanente. Evidência em `video-restoration-fixed-local.json`. Todos os comandos obrigatórios foram repetidos após a correção. A playlist interna também passou a indicar Aula atual/Em andamento/Aula acompanhada, evitando repetir o mesmo percentual em três lugares.
