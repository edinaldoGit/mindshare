# MindShare — Requisitos de Software (QXD0251)

Repositório do projeto da disciplina **Requisitos de Software (QXD0251 · Turma 02A)** da **Universidade Federal do Ceará (UFC) — Campus Quixadá**.

O foco deste repositório é o processo de **Engenharia de Requisitos** (visão, elicitação, análise, especificação, rastreabilidade e validação) aplicado ao **MindShare**, uma plataforma web de aprendizagem colaborativa para discentes da UFC Quixadá. Como artefato complementar de validação, o repositório inclui também um **protótipo interativo** desenvolvido por meio de prompts com IA (em substituição a um protótipo estático no Figma).

## Equipe

- Daniely Maia
- Fº Edinaldo dos Santos
- Lara Mª Gurgel
- Mª Tatiane Dias
- Viviane Araújo

## Sobre o sistema especificado

O **MindShare** tem como objetivo conectar discentes participantes e instrutores na oferta de aulas, minicursos, oficinas e grupos de estudo (presenciais, remotos síncronos e remotos assíncronos), com curadoria docente, acompanhamento de frequência/progresso e emissão de comprovantes demonstrativos de carga horária.

> [!IMPORTANT]
> Este projeto tem caráter **estritamente acadêmico**. O protótipo não possui backend, banco de dados ou integração institucional real (SIGAA, gov.br, SIAPE) e não substitui o sistema oficial de registro de horas complementares da UFC.

## Estrutura do repositório

O repositório está organizado segundo as etapas da Engenharia de Requisitos:

```text
mindshare/
├── docs/
│   ├── 01-visao/                 # Visão do produto, problema, stakeholders e escopo
│   ├── 02-elicitacao/            # Técnicas de elicitação, personas e levantamento inicial
│   ├── 03-analise-e-modelagem/   # Jornadas, fluxos, casos de uso / histórias e regras
│   ├── 04-especificacao/         # SRS (ISO/IEC/IEEE 29148) e matriz de rastreabilidade
│   └── 05-validacao/             # Validação de requisitos, evidências, roteiro e publicação
├── prototipo/                    # Protótipo interativo (gerado via IA em vez de Figma)
│   ├── docs/                     # Arquitetura, design system, Demo Studio e licenças
│   ├── src/                      # Código-fonte React/TypeScript do protótipo
│   ├── tests/                    # Testes automatizados de verificação dos requisitos
│   └── ...
└── .github/workflows/            # Pipeline de publicação do protótipo no GitHub Pages
```

## Principais artefatos

| Etapa | Artefato | Descrição |
|---|---|---|
| **01 · Visão** | [Visão e Escopo](docs/01-visao/README.md) | Espaço para o Documento de Visão (`10/09/2026`). |
| **02 · Elicitação** | [Elicitação](docs/02-elicitacao/README.md) | Espaço para registro das técnicas de elicitação e personas. |
| **03 · Análise** | [Jornadas integradas](docs/03-analise-e-modelagem/user-flows.md) | Fluxos ponta a ponta entre os perfis do sistema. |
| **04 · Especificação** | [SRS v1.3 (Markdown)](docs/04-especificacao/MindShare_SRS_v1.3.md) · [PDF](docs/04-especificacao/MindShare_SRS_v1.3.pdf) | Especificação completa de RF, RNF, glossário e verificação. |
| **04 · Rastreabilidade** | [Matriz de requisitos](docs/04-especificacao/requirements-matrix.md) | Mapeamento entre SRS v1.3, protótipo e limites acadêmicos. |
| **05 · Validação** | [Roteiro de apresentação](docs/05-validacao/apresentacao.md) · [Verificações](docs/05-validacao/validation.md) · [Publicação](docs/05-validacao/publicacao.md) | Evidências de validação, PDFs gerados e guia de apresentação. |
| **Protótipo** | [Documentação do protótipo](prototipo/README.md) | Instruções técnicas para executar e testar o protótipo localmente. |

## Protótipo interativo (alternativa ao Figma)

Para validar os fluxos especificados no SRS de forma interativa, o protótipo está publicado no GitHub Pages:

- **Protótipo público:** https://edinaldogit.github.io/mindshare/
- **Modo apresentação (Demo Studio):** https://edinaldogit.github.io/mindshare/?demo=1#/

Caso precise executar ou verificar o protótipo localmente, acesse a pasta [`prototipo/`](prototipo/README.md):

```bash
cd prototipo
npm ci
npm run dev
```
