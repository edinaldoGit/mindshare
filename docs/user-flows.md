# Jornadas integradas do MindShare

Fonte: SRS v1.3 e matriz de implementação. Todas as alterações usam um único snapshot v3. Dados anteriores e PDFs históricos permanecem preservados; as operações atuais são locais e fictícias.

## Entrada e cadastro docente

Visitante pode explorar catálogo, cadastrar Discente ou solicitar acesso docente em `/cadastro/professor`. Solicitação administrativa registra dados `.test` e declaração fictícia; estado Pendente não cria permissão. Clara entra pelo formulário normal → Solicitações docentes → lê comprovação → aprova ou rejeita com motivo obrigatório. Aprovação cria Curador ativo e o disponibiliza na seleção do Instrutor e no login; rejeição mantém ausência de acesso. A alternativa institucional é identificada como consulta simulada com resultado positivo/negativo explícito; não consulta sistemas externos nem usa SIAPE como prova isolada.

## Proposta e curadoria individual

Alex, na área de Instrutor, cria proposta completa com modalidade, organização e professor ativo. Salva Rascunho → confirma submissão → Em análise. A atribuição aparece no detalhe e fica bloqueada na edição após envio. Só professor designado/ativo vê fila, detalhe e histórico pertinente. Outro Curador não acessa por URL e não decide pelo comando.

Professor designado solicita ajustes com descrição → Alex edita no mesmo formulário, mantendo ID, comentários e professor → reenvia → professor aprova → o mesmo registro aparece no catálogo. Rejeição exige justificativa e não publica nem habilita edição. Administração pode transferir pendência por indisponibilidade, com motivo e registro; o professor anterior perde acesso, o novo recebe, sem alterar status ou mérito. Professor inativo não decide nem recebe nova submissão.

## Inscrição e modalidades

Visitante/Discente consulta modalidade, mínimo e planejamento antes da inscrição. Inscrever cria uma relação Inscrito e consome uma vaga, sem somar horas. Duplicação/lotação são recusadas. Presencial mostra local e encontros; síncrona mostra link externo convencional na área dos inscritos; assíncrona abre aulas e player após inscrição e sessão Discente. Um Instrutor não gerencia atividade de outro.

## Presença e encerramento

Instrutor responsável abre `/instrutor/atividades/:activityId/frequencia` → marca encontro realizado/cancelado → lança presença ou ausência de cada inscrito. Até lançamento, o estado é Não registrado, sem inventar falta. Participante consulta `/participante/atividades/:activityId/frequencia`, sem controles de edição.

Acumulado considera somente presenças/ausências em encontros realizados. Encontros planejados/cancelados e lançamentos pendentes ficam fora da proporção parcial. Sem lançamentos, exibir Sem dados. Instrutor registra todos os encontros e encerra atividade → serviço verifica lançamentos completos e mínimo → botão de conclusão fica elegível. Encerrar não conclui ninguém automaticamente.

## Videoaula real

Júlia se inscreve em Introdução à Animação Digital → abre `/participante/atividades/animacao-digital/aulas` → reproduz MP4 local com controles nativos → trechos efetivos são validados. Pausa, erro, busca na barra, aba oculta e espera de confirmação não avançam progresso. Reassistência não duplica. A posição e os intervalos pertencem ao participante, atividade e aula e persistem ao recarregar.

Aos 90 segundos validados de reprodução do vídeo de três minutos, a reprodução pausa e abre confirmação acessível. No Demo Studio, opção explícita reduz intervalo para 15 s. Prazo padrão de 30 s pode ser ajustado; expirar mantém a pausa e permite confirmar depois. Confirmar retoma o elemento real e registra checkpoint, sem conceder segundos extras. Progresso geral considera duração dos vídeos obrigatórios; mínimo da atividade é 90%, com confirmação por vídeo. A indicação não comprova atenção ou aprendizagem.

## Conclusão e comprovante

Instrutor abre participantes, consulta resumo de frequência ou progresso, confere os critérios e confirma no diálogo. Serviço único exige dono, inscrição, data, critérios e ausência de conclusão prévia. Status Concluída e data atualizam histórico, soma de horas e disponibilidade de comprovante PDF. Vaga continua ocupada. PDF conserva nomes, atividade, horas, conclusão e aviso de que a emissão não garante reconhecimento pela UFC. Participante e Curador não confirmam sua própria conclusão.

Registros legados sem critérios preservam compatibilidade explícita, sem inventar frequência ou revogar conclusões. Fornecer nova organização ao editar proposta legada ativa os critérios atuais.

## Apresentação e restauração

`?demo=1` antes do hash ativa o Demo Studio. A ferramenta preenche o formulário normal e orienta cenários; não decide, lança presença nem conclui automaticamente. Troca de conta preserva dados; navegação contextual muda com o perfil. Restaurar exige confirmação, substitui todas as entidades locais pelos exemplos determinísticos e não duplica registros. Cancelar preserva o snapshot. Detalhes e contas em `demo-studio.md`.
