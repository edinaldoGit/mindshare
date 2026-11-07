# Publicação do MindShare — etapa 6

## Destino confirmado

- Repositório público existente: https://github.com/edinaldoGit/mindshare
- Branch padrão e local: `main`. Remoto inicialmente vazio e checkout sem commits; nenhum histórico remoto sobrescrito.
- GitHub Pages habilitado via API com `build_type: workflow`, HTTPS e sem domínio personalizado. A visibilidade não foi alterada.
- Endereço retornado pelo Pages: https://edinaldogit.github.io/mindshare/
- Demo Studio: https://edinaldogit.github.io/mindshare/?demo=1#/

**Status: publicado e validado pela URL pública.** Resultados e evidências efetivamente coletados estão abaixo.

## Preparação e verificações locais

Inspeção de estrutura, package/lock, rotas, HashRouter, scripts, marca, MP4, Studio, armazenamento, testes e documentos. SRS 1.3 completo e PDF correspondente preservados, assim como versões anteriores. PDF consolidado tem 15 páginas, 44 RF e 22 RNF; texto extraído e metadados conferidos. Revisão visual integral das páginas do PDF registrada na evolução final; não houve alteração de requisitos nesta etapa.

`npm ci --no-audit --no-fund` reproduziu a instalação. `npm test`: 143 aprovados, zero falhas. Lint, typecheck e build passaram; logs em `validation/publication/`. `npm audit` retornou zero vulnerabilidades conhecidas, inclusive desenvolvimento (consulta em 06/11/2026); isso não representa auditoria de segurança integral.

Revisão por padrões e inspeção dos arquivos: nenhum token GitHub, chave privada, chave AWS ou chave de API encontrado. URL com user:pass é caso negativo fictício de teste; não é credencial real. `.env*`, dependências e dist ignorados. Removido caminho absoluto da máquina em evidência antiga. Não há uploads, backend ou documentos docentes reais; contas usam `.test`, senha pública `demonstracao`, sem senha persistida. Login reforça aviso contra senhas pessoais/institucionais; cadastro não solicita salvamento de senha no navegador. Não foram adicionadas credenciais ao workflow. Evidências e PDFs de exemplo contêm personas fictícias e contexto acadêmico; não contêm dados de participantes reais.

## Build e hospedagem

Base local `/mindshare/`; workflow lê base_path do Pages. HashRouter conserva rotas internas sem rewrites. Metadados pt-BR, descrição acadêmica, theme-color e favicon original dS; título inicial corrigido para MindShare · Conhecimento que conecta. Sem logo UFC não autorizado ou marca nova.

JS principal 494,36 kB / 146,42 kB gzip; PDF sob demanda 422,59 / 176,96 kB; Studio sob demanda 8,24 / 3,12 kB; CSS 93,72 / 20,55 kB. Fontes locais divididas em subconjuntos e carregadas pelo navegador conforme uso. Maior arquivo: MP4 4.718.180 bytes; maiores fontes: Inter Latin Ext 85,06 kB e Latin 48,25 kB. Mídia só aparece na rota de videoaulas, com preload metadata, sem download obrigatório na landing. Não foi introduzida dependência nova nem refatoração de risco para otimização marginal. Cache HTTP é administrado pelo Pages; assets compilados possuem hash.

Workflow **MindShare · GitHub Pages**, `.github/workflows/deploy.yml`: push em main e execução manual, Node 24, cache npm, instalação limpa, testes/lint/typecheck/build, upload exclusivo de dist, deploy dependente do build no ambiente github-pages. Concorrência serial, credenciais de checkout não persistidas, Actions oficiais fixadas por SHA e permissões limitadas por job. Configuração baseada na documentação oficial consultada em 06/11/2026: https://vite.dev/guide/static-deploy.html e https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site.

## Limites

O Pages hospeda arquivos estáticos. localStorage é próprio do navegador/origem; sessionStorage guarda a conta da aba. Dispositivos e navegadores não compartilham dados. Guardas e decisões são demonstrativos, sem segurança/autenticação institucional. Migração, dados incompatíveis, quota/armazenamento indisponível e reset possuem testes; isso não comprova funcionamento em toda sessão privada ou política corporativa. Não foram realizados estudo com usuários, carga, matriz de navegadores, auditoria WCAG integral ou Lighthouse. Navegação, foco, labels, diálogos, redução de movimento e controles nativos de vídeo são revisados proporcionalmente ao protótipo.

## Resultado do primeiro deploy e validação pública

**Publicado e acessível em 06/11/2026.** Execução [42163803689](https://github.com/edinaldoGit/mindshare/actions/runs/42163803689), commit `643942126378dfd200575317962dcf1d5aeff00f`, branch main: build e deploy concluídos com sucesso. A execução remota também aprovou os 143 testes, lint e typecheck; Node 24.22.2 no runner. Publicação realizada sem force push, mudança de visibilidade ou histórico remoto sobrescrito. O repositório vazio recebeu o primeiro commit revisado.

Validações efetivamente operadas no navegador integrado pela URL HTTPS pública, sem injetar estado nem chamar comandos de domínio por avaliação:

- Landing, catálogo e recarregamento do catálogo pelo HashRouter; logo e monograma carregados, fontes locais com status loaded, pt-BR e Studio ausente na URL normal. Landing sem elemento de vídeo. Página, logo, ícone e MP4 retornaram HTTP 200; todos os 16 assets compilados/fontes também responderam 200. MP4 servido como video/mp4, 4.718.180 bytes e SHA256 idêntico ao arquivo local. Cache observado max-age=600 para página/marca/mídia; detalhes em `validation/publication/http-assets.json` e `http-build-assets.json`.
- Login normal preenchido pelo Studio e entrada por clique para Júlia, Alex, Marcos, Helena, Clara e nova professora Sofia. Trocas conservaram o snapshot. Ações e atalhos refletiram cada perfil.
- Júlia inscreveu-se em Introdução à Animação Digital; vagas 30→29. Reproduziu vídeo inteiro **sem Studio**, com confirmação normal aos 90,225376 s. Expiração manteve exatamente esse instante e paused=true; confirmação retomou. Play/pause e mute/unmute nativos operados. Final: currentTime=180, ended=true, **179,343942 s validados (99,6%)**, uma confirmação. Reload conservou progresso. Busca por teclado de 179,9 para 178,1 s manteve o total validado. Tentativas de operar a barra por coordenadas não produziram mudança observável; a busca efetivamente verificada foi pelo teclado após recarga.
- Alex consultou 99,6%/mínimo 90%/confirmação registrada, confirmou conclusão e Júlia consultou 0,5 hora no histórico. Comprovante baixado efetivamente do aplicativo público; PDF, texto extraído e imagem de conferência em `validation/publication/public-certificate.*`. PDF de uma página contém Júlia, Alex, atividade, 0,5 hora, data de conclusão e aviso RF23; renderização inspecionada sem cortes/sobreposições. Avisos locais do cache Fontconfig não impediram a renderização.
- Alex criou “Oficina pública de colaboração visual” (quatro horas, presencial, local fictício, encontro e mínimo 75%) e escolheu Marcos. ID `6abd0f98-3f41-44ed-9f1a-65fb734c81e4`. Salvou/submeteu; Marcos aprovou; Helena recebeu Proposta indisponível na mesma URL de análise. Júlia inscreveu-se; Alex marcou encontro realizado, presença e encerramento, consultou 100%/zero pendências e confirmou conclusão. Foram usados dados inteiramente fictícios, inclusive o encontro demonstrativo planejado para o dia seguinte; a marcação operacional não comprova que o encontro aconteceu no mundo real.
- Cadastro docente público de Sofia: solicitação `9efd1655-eb3d-4f1b-aaf9-9b49cd66d704`, pendente sem acesso. Clara aprovou por confirmação; reload manteve Aprovada; Sofia apareceu no Studio e entrou normalmente na curadoria, com fila vazia coerente.
- Revisão adicional de dashboard, inscrições, recomendações e comprovantes do Participante; consulta de frequência; dashboard/propostas/atividades do Instrutor; fila/histórico de Curadoria; dashboard e gestão de curadores administrativos. Títulos principais presentes, foco H1 na navegação e nenhuma imagem quebrada nos registros coletados. As páginas e estados não alterados conservam as verificações anteriores documentadas, sem alegação de repetir integralmente todos os ensaios.

Medições de tamanho são reais do build, e os tempos de requisição HEAD são apenas diagnósticos da rede desta máquina. Não se atribui pontuação Lighthouse, tempo de interação, LCP ou conformidade WCAG sem medição apropriada. Não foi necessária mudança visual estrutural.

## Responsividade e revisão complementar

Nesta etapa foram executadas **48 verificações adicionais** nas larguras 360, 390, 768, 1024, 1440 e 1920 px, altura 900 px: 12 locais (login e cadastro alterados), 12 páginas públicas (landing e videoaula), 12 Studio público (expandido/minimizado) e 12 diálogos públicos (confirmação de vídeo e restauração). Nenhum overflow horizontal; painéis e diálogos dentro da área útil. Em smartphone, minimizar libera as interfaces abaixo; a restauração cancelada preservou os dados. Evidências em `responsive-local.json`, `responsive-public.json` e capturas da pasta de publicação. Não se somam esses casos aos 144 da evolução anterior como se fossem uma auditoria inédita de todas as páginas.

Também foi reproduzido o vídeo com Studio ativado: Alex começou com zero progresso, separado dos 99,6% de Júlia, e a opção explícita de 15 s abriu confirmação com o vídeo pausado. A versão normal permaneceu usando o intervalo proporcional de 90 s.

A revisão pública encontrou um indicador do cenário A limitado à solicitação inicial Renata. O predicado foi corrigido para reconhecer qualquer solicitação decidida. Nenhuma decisão acadêmica ou administrativa foi alterada pelo painel. Após a correção, os 143 testes, lint, typecheck e build passaram novamente. Resultado publicado da correção registrado no encerramento abaixo.

## Encerramento

Correção publicada no commit `2bad811b5e930914dfecb547a53f2f120b062a80`, execução [42165186022](https://github.com/edinaldoGit/mindshare/actions/runs/42165186022), build e deploy bem-sucedidos. Recarregamento público mostrou **✓ Solicitação recebida / ✓ Decisão administrativa** para a nova solicitação aprovada, preservando os dados anteriores. Os cinco cenários foram selecionados e suas orientações consultadas na interface pública; registro em `scenarios-public.json`.

Restauração pública confirmada pela interface: retornaram as seis contas iniciais, Sofia desapareceu e os indicadores do cenário A voltaram ao início. Antes do reset, cancelar a confirmação havia conservado os ensaios. Verificações aceleradas desativadas. Sessão encerrada; menu móvel operado até catálogo e navegação de retorno; viewport de teste removida. Console consultado ao terminar: zero erros/avisos. Evidências preservam a jornada anterior ao reset; os dados de apresentação são próprios do navegador utilizado.

Não há pendência de acesso, configuração, build ou publicação. A documentação final é enviada em commit posterior, sem alteração do aplicativo validado. Relatório, README, matriz, arquitetura, design system, Demo Studio, plano e validação foram alinhados ao estado público. SRS não foi reescrito; fonte/PDF v1.3 e versões anteriores preservados. `apresentacao.md` orienta uma apresentação de 12–15 minutos e restauração segura dos exemplos.

Limitações restantes são de escopo: protótipo local sem backend/identidade institucional, auditoria completa de acessibilidade, testes privados/cross-browser e ensaios de carga não executados. Não constituem configuração pendente do Pages e não são apresentados como verificações concluídas.

## Revisão definitiva de UX — 07/11/2026

Correções implementadas antes da publicação: Studio compacto com seleção direta ao login, frequência por encontro com assunto e salvamento atômico, playlist pública assíncrona, player com acompanhamento textual e duas ilustrações próprias integradas. Resultados locais e evidências em `validation/ux-final/` e `validation.md`. A publicação desta revisão será registrada abaixo somente após o workflow e o site público serem verificados.

Repositório confirmado novamente: `https://github.com/edinaldoGit/mindshare`, público, branch padrão/main. HEAD remoto antes do trabalho: `5387a81b31d2708352a0dbc540bf2a11993ba924`, igual à base local. Acesso de push verificado sem alterar o remoto. Workflow existente mantém instalação com npm ci, testes, lint, typecheck e build antes do deploy. Documentação oficial consultada em 07/11/2026: [Vite](https://vite.dev/guide/static-deploy.html) e [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Revisão de arquivos antes do push: nenhuma ocorrência dos padrões de token GitHub/OpenAI ou chave privada procurados; nenhum `.env`, chave ou log de credenciais entre os arquivos da entrega. Somente dados fictícios e evidências acadêmicas. A fotografia de referência não é redistribuída; as artes derivadas próprias são documentadas em `media-licenses.md`. MP4 e atribuição CC BY 3.0 preservados. Arquivos estáticos públicos não oferecem proteção real de conteúdo.

### Publicação definitiva confirmada

Aplicativo publicado no commit **`0d2e797bcc69fab530626d472a1dcf57989ab0fb`**, execução **[42417403052](https://github.com/edinaldoGit/mindshare/actions/runs/42417403052)**. Build e deploy concluídos com **success** em 07/11/2026. O workflow aprovou Test, Lint, Typecheck e Build antes de publicar o artefato. Branch main e repositório público preservados, sem force push ou alteração de visibilidade. As publicações intermediárias e a correção de vídeo encontrada durante a revisão estão documentadas em `validation.md`.

- Aplicação: https://edinaldogit.github.io/mindshare/
- Demo Studio: https://edinaldogit.github.io/mindshare/?demo=1#/
- Repositório: https://github.com/edinaldoGit/mindshare

**Entrega A:** Demo Studio sem cenários, atalhos ou fechamento definitivo; seleção direta para o login preenchido, com clique real em Entrar; restauração confirmada e sessão inicial preservada. Frequência por encontro com data, assunto, Presente/Ausente/Não registrado e salvamento atômico; consulta individual e regras de conclusão preservadas. Playlist pública com uma aula real e critérios resumidos; player com única barra nativa, progresso textual, estado da aula e prontidão/retomada corrigidas. Artes próprias de login e dos dois cadastros integradas, proporção preservada e falha opcional tratada.

**Entrega B:** publicação efetiva e verificações pela URL pública, sem servidor local. Os **24 arquivos do build** retornaram HTTP 200. HTML publicado corresponde exatamente ao build local final. Fontes, logo, monograma, poster, duas ilustrações, chunks e MP4 verificados. MP4: `video/mp4`, **4.718.180 bytes**, SHA256 `57c4fbfd9618ac685f9e7d50cb7fc64ec432670bb7e619eb31db95bc6af0a814`, igual ao local. Landing sem elemento de vídeo e Studio ausente na URL normal.

### Fluxos operados na versão pública

- Visitante consultou a playlist com um item, descrição, duração e “Acesso após inscrição”, sem elemento de vídeo ou link MP4. A tentativa de abrir a área inscrita foi direcionada ao login.
- Júlia, Alex, Marcos, Helena e Clara entraram pelo seletor e pelo botão normal Entrar. Seleção deixou a aplicação no formulário, sem login automático. Trocas conservaram inscrições, frequência, progresso e conclusões. Re-seleção da mesma conta já havia sido conferida localmente.
- Júlia inscreveu-se nas oficinas presencial/síncrona e na atividade assíncrona; vagas presenciais 20→19. Alex selecionou o encontro, confirmou data pelo controle nativo, salvou assunto e presença. No segundo encontro, ausência produziu **50%**, Não registrado produziu **100% parcial com uma pendência**, e presença produziu **100% com dois registros**. Ausência foi explícita, nunca padrão. Encerramento não concluiu automaticamente; confirmação na gestão atualizou o histórico.
- Oficina síncrona: assunto, presença, encerramento e confirmação também operados. Júlia consultou os encontros, assuntos, datas, percentual e o link autorizado da reunião, sem controles de edição. Como outro Instrutor, recebeu Acompanhamento indisponível na atividade de Alex.
- Histórico de Júlia passou a **3 horas / duas conclusões** após as duas oficinas. Comprovante presencial baixado efetivamente do site: A4, uma página, Júlia Torres, Alex Costa, título correto, duas horas, data 07/11/2026 e aviso RF23. PDF renderizado e inspecionado sem recortes/sobreposições; arquivos `comprovante-publico.pdf`, `.txt` e `.png` em `validation/ux-final/`.
- Marcos recebeu indisponibilidade na proposta atribuída a Helena. Helena abriu a mesma proposta e confirmou aprovação pelo diálogo normal; histórico anterior preservado. Clara acessou solicitações administrativas. Cadastros discente/docente recusaram envio vazio e conservaram os avisos de dados fictícios.

### Reprodução e persistência no Pages

Na versão definitiva, o diálogo pendente abriu **automaticamente**, sem iniciar reprodução, em **171,135999 s**, com **93,3%** e uma confirmação preservados. A mídia permaneceu pausada, sem loading permanente. Confirmar fechou o diálogo, retomou o vídeo e registrou a segunda confirmação. A reprodução chegou a **180 s / ended=true / nenhum erro**, com **98,0% validados** e status **Aula acompanhada**. O percentual não foi artificialmente completado: saltos/lacunas não validados continuam excluídos. Recarga recuperou **179,807404 s** (última posição validada), os mesmos **98,0%** e duas confirmações, sem spinner permanente.

O teste de busca retrocedeu de 90,206411 s para 79,4064 s sem alterar 50,9% de progresso. Confirmação normal, expiração com pausa, retorno e persistência foram efetivamente operados na hospedagem. O checkpoint pendente observado nesta rodada conservou 93,3% durante a espera; a inicialização foi corrigida para abrir a solicitação antes de qualquer nova reprodução. Os testes adicionais de reassistência garantem que a pendência persiste mesmo quando intervalos já acompanhados não aumentam o percentual.

Alex consultou o resultado e confirmou a conclusão assíncrona pelo comando existente. Júlia passou a **3,5 horas / três conclusões**, com o botão do comprovante assíncrono habilitado. O PDF presencial já havia sido baixado, renderizado e conferido. Não se afirma um segundo download assíncrono nesta rodada.

### Responsividade e estado de apresentação

**84 verificações públicas**: 60 páginas (dez rotas/estados × seis larguras), 12 Studio expandido/minimizado e 12 diálogos de vídeo/restauração. Larguras **360, 390, 768, 1024, 1440 e 1920 px**, altura 900 px. Páginas: landing, login, cadastros discente/docente, detalhes públicos assíncronos, Minha frequência, histórico, videoaula e frequências presenciais/síncronas do Instrutor. Nenhum overflow horizontal, título ausente, imagem quebrada ou painel/diálogo fora da viewport nos registros. Os ajustes finais de autenticação e player foram conferidos novamente. Não se confunde esse total com as 78 verificações locais ou com as 144 históricas.

Console público consultado ao terminar: **zero erros/avisos**. Restauração confirmada pela interface conservou a sessão de Júlia, retornou **seis contas únicas** e zerou as três conclusões da jornada, sem duplicar registros. Em seguida a sessão foi encerrada para deixar o Studio pronto para a apresentação. Viewport de teste removida. Evidências estruturadas e capturas em `validation/ux-final/`; `deploy.json` identifica a execução do aplicativo validado e `http-public.json` confirma identidade com o build local.

Nenhuma pendência de implementação, acesso ou publicação identificada nesta rodada. A documentação final é atualizada após as verificações, sem mudar o aplicativo validado.

### Qualidade, evidências e limites

**168 testes aprovados** (143 anteriores + 25 novos); npm test, lint, typecheck, build e revisão do diff aprovados após o último ajuste. Comandos completos e dados de execução em `validation/ux-final/`. SRS v1.3 e seus PDFs não foram alterados. A rastreabilidade registra os detalhamentos operacionais solicitados sem criar requisitos acadêmicos artificiais.

O site continua sendo protótipo acadêmico estático: dados fictícios locais, sem backend, identidade institucional, sincronização entre dispositivos ou proteção privada de mídia. O bloqueio da interface não protege arquivos estáticos públicos. Sem câmera/microfone/proctoring. Não foram realizados auditoria WCAG integral, matriz completa de navegadores, teste de carga ou estudo com cinco discentes. Esses limites não são falhas de configuração da publicação.
