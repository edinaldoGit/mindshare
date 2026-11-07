# MindShare

Protótipo acadêmico de aprendizagem colaborativa para a UFC Quixadá. Aplicação integrada com Participante, Instrutor, Professor Curador e Administrador, modalidades presenciais/síncronas/assíncronas, frequência, videoaula real, progresso, histórico e comprovantes PDF. Sem backend ou integração institucional real. Publicação estática por GitHub Actions; estado e evidências em [Publicação](docs/publicacao.md).

## Acesso

- [MindShare público](https://edinaldogit.github.io/mindshare/)
- [Demo Studio](https://edinaldogit.github.io/mindshare/?demo=1#/)
- [Repositório](https://github.com/edinaldoGit/mindshare)
- [Roteiro acadêmico](docs/apresentacao.md)

Os endereços foram retornados pela configuração do Pages. Consulte o relatório de publicação para o resultado efetivamente verificado.

## Tecnologias

React 19, TypeScript, Vite 8, React Router com HashRouter, Tailwind CSS 4, Lucide, fontes locais Fontsource e pdf-lib carregado sob demanda. Node.js 24 no workflow.

## Executar e verificar

Node >=22.12.0 e npm. Instale com `npm ci`, inicie com `npm run dev`. Verificações: `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, `git diff --check`. Para inspecionar a produção local: `npm run preview`. O resultado estático fica em `dist/`.

## Apresentação acadêmica

Adicione `?demo=1` antes do hash: `http://localhost:5173/mindshare/?demo=1#/`. A URL normal deixa o Demo Studio oculto. A ferramenta oferece seleção de contas fictícias que preenche automaticamente o login normal, mostra a sessão e restaura dados mediante confirmação. Pode ser minimizada e expandida; a navegação usa os menus do produto. O apresentador clica Entrar e realiza as ações nas interfaces reais. Credencial pública: `demonstracao`. Consulte [Demo Studio](docs/demo-studio.md) para contas e restauração.

Alex é a mesma identidade em Participante/Instrutor; Júlia permite testar a conclusão ponta a ponta. Helena, Marcos e Beatriz são Curadores; Clara é Administradora. Solicitações docentes aprovadas ficam disponíveis no login e na escolha de responsável. Dados usam apenas `.test`, sem senha persistida ou arquivo pessoal.

## Documentação

- [SRS completo v1.3, fonte editável](docs/MindShare_SRS_v1.3.md)
- [SRS v1.3 PDF](docs/MindShare_SRS_v1.3.pdf)
- [Arquitetura](docs/architecture.md)
- [Matriz de implementação e limites](docs/requirements-matrix.md)
- [Design system](docs/design-system.md)
- [Jornadas](docs/user-flows.md)
- [Marcos e publicação futura](docs/implementation-plan.md)
- [Verificações e evidências](docs/validation.md)
- [Licenças de mídia](docs/media-licenses.md)

Os SRS anteriores são preservados como histórico. A logo e o monograma originais permanecem em `public/brand`.

## Persistência e mídia

Snapshot `mindshare:demo:data:v3` em localStorage, com migração de v1/v2 sem apagar o legado. Estado único para propostas, atribuições, inscrições, presenças, progresso e conclusões. Sessão conserva só ID em sessionStorage da aba. Reset confirmado restaura exemplos e não remove chaves externas. Falhas de armazenamento permitem uso em memória com aviso.

Vídeo local: `public/media/big-buck-bunny-excerpt.mp4`, trecho de três minutos de Big Buck Bunny (Blender Foundation, CC BY 3.0), acompanhado de atribuição e descrição. Sem hotlink ou plataforma externa. Checkpoints pausam o elemento real, e união de intervalos evita contar saltos ou duplicar reassistência. Confirmações indicam interação, sem comprovar atenção/aprendizagem.

## GitHub Pages

Vite usa `base: "/mindshare/"`, correspondente ao repositório confirmado; assets usam BASE_URL e navegação usa HashRouter. O workflow `.github/workflows/deploy.yml` executa instalação pelo lockfile, testes, lint, typecheck e build antes de publicar somente `dist`. O caminho do build automatizado é obtido da configuração do Pages, inclusive para eventual domínio personalizado. Demo Studio usa a query antes do hash. Não há dependência de serviço local no código distribuído. Logs e resultado público em [Publicação](docs/publicacao.md).

Comprovantes continuam demonstrativos e não garantem reconhecimento de carga horária pela UFC. localStorage não é banco e não garante segurança, identidade, retenção institucional ou sincronização.

## Refinamento final de experiência

Encontros e frequência: **Minhas atividades → Encontros e frequência**. Selecione o encontro, confirme data/horário, informe o assunto, marque Presente/Ausente/Não registrado e salve. O Participante consulta **Minhas inscrições → atividade → Minha frequência**. O cálculo segue RF36 do SRS v1.3, sem transformar pendências em faltas; conclusão continua centralizada no comando existente.

Atividades assíncronas exibem a playlist pública antes da inscrição. Após inscrição, a área de aulas prioriza o vídeo, com uma única barra nativa de reprodução e acompanhamento acadêmico textual. O MP4 estático é público; o bloqueio da interface não constitui proteção real de mídia. Login e cadastros usam as duas ilustrações próprias de Quixadá em `public/brand`.
