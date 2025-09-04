Plano de Tarefas do Projeto: Mind Helping
Este documento detalha as tarefas de desenvolvimento para a plataforma Mind Helping, dividido em épicos, histórias e subtarefas para fácil importação em um sistema de gerenciamento.

Épico 1: Autenticação e Gestão de Contas
Engloba todas as funcionalidades de criação, acesso e gerenciamento de perfis de usuários e profissionais.

[História] Cadastro de novos usuários (Pacientes)
[ ] API: Criar endpoint POST /auth/register/user.


[ ] API: Implementar validação para campos obrigatórios: Nome, E-mail, senha, telefone, endereço, CPF, data de nascimento e identidade de gênero.


[ ] API: Implementar regra de negócio para senha (mínimo de 8 caracteres, um caractere especial e um número).


[ ] API: Implementar criptografia para o armazenamento da senha.


[ ] API: Implementar validação de formato e existência para o CPF.


[ ] API: Implementar integração com a API dos Correios para preenchimento de endereço via CEP.


[ ] API: Adicionar suporte ao cadastro via Google.


[ ] Mobile: Desenvolver a interface da tela de cadastro (conforme protótipo da Figura 9).


[ ] Mobile: Integrar a tela de cadastro com o endpoint da API.

[História] Cadastro de novos profissionais
[ ] API: Criar endpoint POST /auth/register/professional.


[ ] API: Implementar validação para campos obrigatórios: Nome, senha, E-mail, telefone, endereço, CPF, data de nascimento e registro do conselho (CRP).


[ ] API: Implementar validação para verificar se o CRP está ativo.


[ ] API: Incluir o campo booleano isSocial para indicar se o profissional realiza consultas sociais.


[ ] Web: Desenvolver a interface da tela de cadastro de profissional (conforme protótipo da Figura 23).


[ ] Web: Integrar a tela de cadastro com o endpoint da API.

[História] Login de usuários e profissionais
[ ] API: Criar endpoint POST /auth/login unificado para ambos os perfis.


[ ] API: Implementar a lógica de verificação de credenciais (e-mail e senha).


[ ] API: Gerar e retornar um token de autenticação (JWT) em caso de sucesso.


[ ] Mobile: Desenvolver a interface da tela de login (conforme protótipo da Figura 10).

[ ] Mobile: Integrar a tela de login com a API e salvar o token localmente.


[ ] Web: Desenvolver a interface da tela de login (conforme protótipo da Figura 21).


[ ] Web: Integrar a tela de login com a API e gerenciar a sessão.

[História] Edição e exclusão de perfis
[ ] API: Criar endpoint GET /me para buscar dados do perfil logado.

[ ] API: Criar endpoint PUT /me para atualizar dados do perfil.


[ ] API: Criar endpoint DELETE /me para excluir a conta do usuário.



[ ] Mobile: Desenvolver a tela "Editar Perfil" (conforme protótipo da Figura 20).

[ ] Mobile: Integrar a tela com os endpoints GET /me, PUT /me e DELETE /me.


[ ] Web: Desenvolver a tela "Editar Perfil" para o profissional (conforme protótipo da Figura 27).

[ ] Web: Integrar a tela com os endpoints da API.

Épico 2: Módulo do Paciente (Core App)
Funcionalidades centrais do aplicativo mobile voltadas para o bem-estar do usuário.

[História] Registro de Sentimentos e Diário

[ ] API: Criar endpoint POST /sentiments/records para registrar um sentimento.


[ ] API: Criar endpoints para o Diário: POST /diary, GET /diary e DELETE /diary/:id.


[ ] API: Implementar regra que impede a edição de entradas do diário já concluídas.


[ ] Mobile: Desenvolver a interface de registro de sentimento na tela inicial (conforme protótipo da Figura 12).


[ ] Mobile: Desenvolver as telas de listagem e criação de entradas no diário (conforme protótipo da Figura 13).

[ ] Mobile: Integrar as telas com os endpoints da API.

[História] Gerenciamento de Metas Pessoais

[ ] API: Criar endpoints para Metas: POST /goals, GET /goals e DELETE /goals/:id.


[ ] API: Criar endpoint POST /goals/:id/progress para registrar a execução de uma meta.


[ ] API: Implementar regra que impede a edição da meta após a primeira execução.


[ ] Mobile: Desenvolver as telas de criação e gerenciamento de metas (conforme protótipo da Figura 14).

[ ] Mobile: Integrar as telas com os endpoints da API.

[História] Relatórios de Humor e Conteúdo Informativo

[ ] API: Criar endpoint GET /reports/user/sentiment-variation para o relatório de variação diária.


[ ] API: Criar endpoint GET /reports/user/mood-history para o relatório mensal de humor.


[ ] Mobile: Desenvolver a tela de Relatório de Variação de Sentimentos (conforme protótipo da Figura 16).


[ ] Mobile: Desenvolver a tela de Relatório Mensal de Sentimentos (conforme protótipo da Figura 17).


[ ] Mobile: Desenvolver a interface para exibir conteúdos informativos (conforme protótipo da Figura 18).

[História] Integração com CVV

[ ] API: Criar endpoint POST /cvv/calls para registrar uma ligação efetuada.


[ ] API: Criar endpoint GET /cvv/calls para listar o histórico de chamadas.


[ ] Mobile: Desenvolver a tela de chamada para o CVV (conforme protótipo da Figura 15).

[ ] Mobile: Implementar a funcionalidade de discagem nativa para o número do CVV.

[ ] Mobile: Realizar a chamada à API para registrar a ligação após o término da chamada.

Épico 3: Módulo do Profissional (Sistema Web)
Funcionalidades da plataforma web para gerenciamento dos profissionais.

[História] Gerenciamento da Agenda Profissional

[ ] API: Criar endpoint POST /schedules para o profissional cadastrar sua agenda.


[ ] API: Implementar a lógica de geração de horários (manual e automática, com base em hora inicial, final e intervalo).


[ ] API: Implementar a regra de desabilitar o valor da consulta para profissionais sociais.


[ ] Web: Desenvolver a tela de "Gerenciar Agenda" (conforme protótipo da Figura 22).


[ ] Web: Integrar a interface com o endpoint de criação de agenda.

[História] Visualização de Pacientes e Agendamentos

[ ] API: Criar endpoint GET /professionals/me/patients para listar os pacientes de um profissional.


[ ] API: Criar endpoint GET /professionals/me/appointments para listar os agendamentos.


[ ] Web: Desenvolver a tela "Visualizar Pacientes" (conforme protótipo da Figura 26).


[ ] Web: Desenvolver a tela "Visualizar Agendamentos" (conforme protótipo da Figura 25).


[ ] Web: Integrar as telas com os respectivos endpoints da API.

[História] Dashboard de Acompanhamento do Paciente

[ ] API: Criar endpoint GET /reports/patient/:id/dashboard que consolida os dados de relatórios e histórico do CVV de um paciente.


[ ] Web: Desenvolver a tela de "Dashboard de Acompanhamento" (conforme protótipo da Figura 24).


[ ] Web: Integrar os componentes do dashboard (gráficos, listas) com o endpoint da API.


[ ] Web: Implementar os filtros de data no dashboard.

Épico 4: Interação Paciente-Profissional
Funcionalidades que conectam os dois tipos de usuários da plataforma.

[História] Busca e Agendamento de Consultas

[ ] API: Criar endpoint GET /professionals com suporte a filtros (nome, social, localização).

[ ] API: Criar endpoint GET /professionals/:id/availability para o usuário ver os horários disponíveis de um profissional.


[ ] API: Criar endpoint POST /appointments para o usuário marcar uma consulta.


[ ] Mobile: Desenvolver a tela de "Buscar Profissionais" (conforme protótipo da Figura 11).


[ ] Mobile: Desenvolver a tela de "Realizar Agendamento" com o calendário e horários (conforme protótipo da Figura 19).

[ ] Mobile: Integrar todo o fluxo de busca e agendamento com os endpoints da API.

Épico 5: Infraestrutura e Requisitos Não-Funcionais
Tarefas técnicas essenciais para a sustentação e qualidade do projeto.


[ ] Infra: Configurar o ambiente de desenvolvimento usando Docker para padronização.



[ ] Infra: Estruturar o banco de dados PostgreSQL (produção) e SQLite (mobile).



[ ] Backend: Implementar o sistema de sincronização para permitir o uso offline do aplicativo.


[ ] Segurança: Implementar medidas de segurança de dados para conformidade com a LGPD, como criptografia de senhas e uso consciente do CPF.


[ ] Frontend: Garantir que o sistema web e o aplicativo sejam responsivos e intuitivos (Usabilidade).