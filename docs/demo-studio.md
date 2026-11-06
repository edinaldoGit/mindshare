# MindShare Demo Studio

Ferramenta auxiliar de apresentação, fora dos requisitos acadêmicos do produto. Desativada na URL normal. Para ativar, use `?demo=1` antes do hash: `https://edinaldogit.github.io/mindshare/?demo=1#/` ou, localmente, `http://127.0.0.1:4173/mindshare/?demo=1#/`.

O parâmetro da página permanece durante a navegação do HashRouter. `#/rota?demo=1` não ativa o Studio. Fechar oculta até recarregar; minimizar conserva um botão compacto. Minimize o painel para interagir com as telas abaixo dele. A interface do produto mantém navegação, dados e identidade próprios.

## Login normal e perfis

Escolha uma conta e clique em Preencher o login normal. O Studio sai da sessão anterior, preserva os dados e preenche e-mail/senha na tela normal; o apresentador clica Entrar. Erros, bloqueio de tentativas e guardas continuam ativos. Não há entrada silenciosa. Cada Discente alterna Participante/Instrutor na mesma identidade.

| Conta fictícia | E-mail                  | Uso                                                            |
| -------------- | ----------------------- | -------------------------------------------------------------- |
| Alex Costa     | discente@mindshare.test | Instrutor e Participante                                       |
| Júlia Torres   | julia@mindshare.test    | Participante para frequência, vídeo e comprovantes             |
| Helena Prado   | curador@mindshare.test  | Curadora das propostas legadas e de exemplos                   |
| Marcos Azevedo | marcos@mindshare.test   | Segundo Curador para isolamento e transferência                |
| Beatriz Lima   | beatriz@mindshare.test  | Curadora ativa sem atribuições iniciais                        |
| Clara Mendes   | admin@mindshare.test    | Administração de docentes e atribuições                        |
| Renata Barros  | renata@mindshare.test   | Solicitação inicialmente pendente; login apenas após aprovação |

Senha pública de todas as contas habilitadas: `demonstracao`. A lista de contas cresce após aprovações docentes; use apenas dados fictícios `.test`. Não há credencial institucional nem senha armazenada.

## Cenários agrupados

A: cadastro docente → Administração → aprovação/recusa → seleção de professor ativo.

B: Alex cria proposta → escolhe Curador → submete → professor designado solicita ajustes → Alex edita/reenvia → Curador aprova. Outro professor recebe indisponibilidade na URL.

C: Júlia inscreve-se na oficina presencial ou síncrona → Alex marca encontros realizados e lança presença/ausência → Júlia consulta cálculo parcial → Alex encerra, confere critérios e confirma conclusão.

D: Júlia inscreve-se em Introdução à Animação Digital → assiste ao vídeo local → confirma acompanhamento ou deixa o prazo expirar → retoma → atinge 90% e confirmações → Alex confere e confirma → Júlia consulta horas e PDF.

E: ciclo integral combinando proposta, curadoria atribuída, participação e conclusão. Os atalhos não decidem, lançam presença nem concluem automaticamente. Indicadores derivam do estado atual, incluindo exemplos existentes; não marcam uma etapa só por clicar em Próxima.

## Vídeo acelerado e restauração

A opção Verificações de vídeo a cada 15 s afeta apenas o intervalo de apresentação, fica em sessionStorage e aparece explicitamente no player. Não muda mínimo, intervalos assistidos, horas ou elegibilidade. Desativada, o vídeo curto usa 90 s. O prazo da resposta pode ser ajustado no painel de acessibilidade do player.

Preparar/restaurar cenário inicial abre confirmação e explica que solicitações, decisões, inscrições, presença e progresso serão substituídos pelos exemplos determinísticos. Cancelar preserva dados; confirmar não duplica registros. Todos os cenários partem do mesmo seed e não usam bases paralelas. A sessão de uma conta inicial é mantida; uma conta criada durante a apresentação desaparece com o reset e precisará ser cadastrada novamente.

Não usar documentos pessoais reais. Não há backend, consulta a SIAPE/gov.br, identidade institucional, segurança de produção ou sincronização entre abas. O objetivo é apresentar os fluxos reais do frontend com pessoas fictícias e resultados verificáveis.
