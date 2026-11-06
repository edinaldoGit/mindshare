# Publicação do MindShare — etapa 6

## Destino confirmado

- Repositório público existente: https://github.com/edinaldoGit/mindshare
- Branch padrão e local: `main`. Remoto inicialmente vazio e checkout sem commits; nenhum histórico remoto sobrescrito.
- GitHub Pages habilitado via API com `build_type: workflow`, HTTPS e sem domínio personalizado. A visibilidade não foi alterada.
- Endereço retornado pelo Pages: https://edinaldogit.github.io/mindshare/
- Demo Studio: https://edinaldogit.github.io/mindshare/?demo=1#/

**Status neste registro inicial: aguardando primeiro push/deploy e validação pública.** A configuração de um endereço não comprova disponibilidade. Os resultados finais serão acrescentados após a execução.

## Preparação e verificações locais

Inspeção de estrutura, package/lock, rotas, HashRouter, scripts, marca, MP4, Studio, armazenamento, testes e documentos. SRS 1.3 completo e PDF correspondente preservados, assim como versões anteriores. PDF consolidado tem 15 páginas, 44 RF e 22 RNF; texto extraído e metadados conferidos. Revisão visual integral das páginas do PDF registrada na evolução final; não houve alteração de requisitos nesta etapa.

`npm ci --no-audit --no-fund` reproduziu a instalação. `npm test`: 143 aprovados, zero falhas. Lint, typecheck e build passaram; logs em `validation/publication/`. `npm audit` retornou zero vulnerabilidades conhecidas, inclusive desenvolvimento (consulta em 06/11/2026); isso não representa auditoria de segurança integral.

Revisão por padrões e inspeção dos arquivos: nenhum token GitHub, chave privada, chave AWS ou chave de API encontrado. URL com user:pass é caso negativo fictício de teste; não é credencial real. `.env*`, dependências e dist ignorados. Removido caminho absoluto da máquina em evidência antiga. Não há uploads, backend ou documentos docentes reais; contas usam `.test`, senha pública `demonstracao`, sem senha persistida. Login reforça aviso contra senhas pessoais/institucionais; cadastro não solicita salvamento de senha no navegador. Não foram adicionadas credenciais ao workflow. Evidências e PDFs de exemplo contêm personas fictícias e contexto acadêmico; não contêm dados de participantes reais.

## Build e hospedagem

Base local `/mindshare/`; workflow lê base_path do Pages. HashRouter conserva rotas internas sem rewrites. Metadados pt-BR, descrição acadêmica, theme-color e favicon original dS; título inicial corrigido para MindShare · Conhecimento que conecta. Sem logo UFC não autorizado ou marca nova.

JS principal 494,36 kB / 146,41 kB gzip; PDF sob demanda 422,59 / 176,96 kB; Studio sob demanda 8,26 / 3,13 kB; CSS 93,72 / 20,55 kB. Fontes locais divididas em subconjuntos e carregadas pelo navegador conforme uso. Maior arquivo: MP4 4.718.180 bytes; maiores fontes: Inter Latin Ext 85,06 kB e Latin 48,25 kB. Mídia só aparece na rota de videoaulas, com preload metadata, sem download obrigatório na landing. Não foi introduzida dependência nova nem refatoração de risco para otimização marginal. Cache HTTP é administrado pelo Pages; assets compilados possuem hash.

Workflow **MindShare · GitHub Pages**, `.github/workflows/deploy.yml`: push em main e execução manual, Node 24, cache npm, instalação limpa, testes/lint/typecheck/build, upload exclusivo de dist, deploy dependente do build no ambiente github-pages. Concorrência serial, credenciais de checkout não persistidas, Actions oficiais fixadas por SHA e permissões limitadas por job. Configuração baseada na documentação oficial consultada em 06/11/2026: https://vite.dev/guide/static-deploy.html e https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site.

## Limites

O Pages hospeda arquivos estáticos. localStorage é próprio do navegador/origem; sessionStorage guarda a conta da aba. Dispositivos e navegadores não compartilham dados. Guardas e decisões são demonstrativos, sem segurança/autenticação institucional. Migração, dados incompatíveis, quota/armazenamento indisponível e reset possuem testes; isso não comprova funcionamento em toda sessão privada ou política corporativa. Não foram realizados estudo com usuários, carga, matriz de navegadores, auditoria WCAG integral ou Lighthouse. Navegação, foco, labels, diálogos, redução de movimento e controles nativos de vídeo são revisados proporcionalmente ao protótipo.
