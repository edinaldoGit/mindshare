# Design system MindShare

A identidade oficial é preservada nos arquivos de `public/brand`: logo completa e monograma dS. A marca não é redesenhada. Os tokens e estilos reais estão em `src/styles/globals.css`, `participant.css`, `instructor.css` e `curation.css`.

## Fundamentos

| Papel                           | Token ou aplicação            |
| ------------------------------- | ----------------------------- |
| Fundo Ghost White               | `--background: #F7F5FB`       |
| Texto principal                 | `--foreground: #172D3B`       |
| Marca Steel Blue                | `--brand-blue: #3F88C5`       |
| Marca Ocean Mist                | `--brand-mist: #44BBA4`       |
| Ação principal com texto branco | `--primary: #245F91`          |
| Fundo de destaque suave         | `--accent: #DDF4ED`           |
| Cartões                         | `--card: #FFFFFF`             |
| Texto secundário                | `--muted-foreground: #526473` |
| Bordas                          | `--border: #D9E0E7`           |
| Ação destrutiva                 | `--destructive: #AB303C`      |

Manrope Variable nos títulos e Inter Variable no texto/interface, carregadas localmente por Fontsource. Hierarquia responsiva com `clamp`, entrelinhas confortáveis e largura de leitura controlada. Ícones Lucide complementam rótulos; ícones decorativos usam `aria-hidden`.

## Componentes e estados

`Button` é a primitiva única, com variantes principal, contorno e discreta; suporta composição com links. As áreas internas reutilizam cartões, campos, `FeedbackMessage` (status/alerta), `EmptyState`, estados textuais de proposta e diálogos nativos.

Os cinco estados de proposta são Rascunho, Em análise, Ajustes solicitados, Aprovada e Rejeitada. `ProposalStatus` preserva uma indicação textual em todas as telas; as cores semânticas suaves já existentes são reutilizadas na Curadoria. Inscrições usam somente Inscrito/Concluída.

Campos têm label associado, instruções e erro próximo, com `aria-invalid` e `aria-describedby`. Erros não apagam valores preenchidos. O formulário de proposta foca o primeiro erro depois da atualização do DOM. Links e botões têm foco visível, e o título principal recebe foco a cada mudança de rota.

## Layouts internos e responsividade

Participante mantém o layout próprio. Instrutor e Professor Curador compartilham `WorkspaceFrame`: identidade, sidebar, navegação, saída e reset confirmado no desktop; seletor nativo rotulado no mobile. Os destinos variam por perfil. A mudança de contexto do Discente mantém sua identidade; troca de persona usa o login demonstrativo.

Métricas derivadas do estado usam grade de quatro colunas, reduzida para duas. Listas são cartões adaptativos, sem tabelas que precisem de rolagem horizontal. O corpo principal usa `min-width: 0`, quebra de textos longos e organização vertical em telas pequenas. As amostras verificadas em 360, 390, 768, 1024, 1440 e 1920 px estão em `validation.md`.

## Curadoria: leitura e decisões

Dashboard prioriza a fila e não apresenta gráficos artificiais. A borda Ocean Mist destaca discretamente a próxima leitura. Os cartões mostram título, autor, submissão, horas, formato e acesso à análise. O histórico distingue o resultado registrado da situação atual.

Na análise, ementa e informações ocupam a coluna principal; o painel lateral contém três decisões identificadas por texto/ícone. Abaixo de 1100 px, o painel passa ao fluxo vertical. A ementa usa entrelinha maior e largura legível, com parágrafos preservados.

`DecisionDialog` reutiliza o estilo do diálogo compartilhado, com ícone coerente com a ação, título da proposta e consequência. Aprovação exige confirmação; rejeição/ajustes acrescentam textarea obrigatória. Rejeição usa o token destrutivo apenas na confirmação final. O diálogo tem altura máxima relativa a `100dvh`, rolagem interna e botões empilhados em smartphones. Escape/cancelamento fecha antes de desmontar e devolve foco ao acionador; sucesso foca a mensagem de resultado.

A timeline é compartilhada com o Instrutor e apresenta somente eventos derivados do estado, preservando as decisões anteriores. `prefers-reduced-motion` continua respeitado pelas regras existentes do shell. As revisões feitas não constituem certificação WCAG; auditoria completa e matriz de navegadores ficam registradas para a Etapa 6.

## Evolução final: Administração, frequência, vídeo e Demo Studio

Administração reutiliza WorkspaceFrame, cartões de proposta, métricas derivadas, botões e formulários. Cadastro docente usa AuthLayout. DeliveryFields integra o mesmo formulário do Instrutor; DeliveryInfo organiza os dados publicados e de curadoria. Encontros e lançamentos usam cartões verticais responsivos, com texto explícito para Presente, Ausente e Não registrado.

Player HTML5 conserva controles nativos e proporção 16:9, ocupa a coluna principal com lista/progresso ao lado em desktop e empilha abaixo de 900 px. Barra nativa `progress` possui nome acessível. Confirmação de acompanhamento usa diálogo com altura limitada à viewport, foco, teclado, prazo ajustável e retomada sem penalidade irreversível. Erro de mídia possui texto e nova tentativa.

As novas regras estão em `evolution.css`, reutilizando os tokens Ghost White, Steel Blue, Ocean Mist e componentes existentes. Apenas o Demo Studio possui aparência escura própria, identificada como ferramenta externa de apresentação, carregada sob demanda, oculta na URL normal e minimizável. Seus controles especiais substituem os botões de persona e restauração das telas normais. O aviso acadêmico permanece no rodapé e os avisos necessários permanecem no cadastro docente, player e PDF.
