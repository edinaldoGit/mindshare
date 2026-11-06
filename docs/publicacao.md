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
