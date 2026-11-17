# Protótipo Interativo — MindShare

Protótipo funcional de alta fidelidade do sistema **MindShare**, desenvolvido como artefato de validação de interface e fluxos para a disciplina de **Requisitos de Software (QXD0251)** da UFC Quixadá. Em vez de um protótipo estático no Figma, esta versão foi construída por meio de prompts com IA para permitir testes interativos reais dos requisitos especificados no [SRS v1.3](../docs/04-especificacao/MindShare_SRS_v1.3.md).

> [!NOTE]
> Este aplicativo é um protótipo acadêmico **sem backend ou integração institucional real**. Dados, autenticações, aprovações docentes e comprovantes em PDF são demonstrativos e armazenados apenas localmente no navegador (`localStorage` / `sessionStorage`).

## Acesso online

- [MindShare público (GitHub Pages)](https://edinaldogit.github.io/mindshare/)
- [Demo Studio (modo de apresentação)](https://edinaldogit.github.io/mindshare/?demo=1#/)
- [Roteiro de apresentação acadêmica](../docs/05-validacao/apresentacao.md)

## Tecnologias

React 19, TypeScript, Vite 8, React Router (`HashRouter`), Tailwind CSS 4, Lucide, fontes locais Fontsource e `pdf-lib` carregado sob demanda.

## Executar e verificar localmente

Pré-requisitos: Node.js `>= 22.12.0` e `npm`.

```bash
cd prototipo
npm ci
npm run dev
```

Comandos de verificação:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Para inspecionar o build de produção localmente: `npm run preview` (saída gerada em `prototipo/dist/`).

## Apresentação e Demo Studio

Adicione `?demo=1` antes do hash (`http://localhost:5173/mindshare/?demo=1#/`). A URL padrão mantém o Demo Studio oculto. Consulte [Demo Studio](docs/demo-studio.md) para detalhes de contas fictícias e restauração de estado.

## Documentação técnica do protótipo

- [Arquitetura do protótipo](docs/architecture.md)
- [Design system](docs/design-system.md)
- [Demo Studio](docs/demo-studio.md)
- [Marcos e plano de implementação](docs/implementation-plan.md)
- [Licenças de mídia](docs/media-licenses.md)
