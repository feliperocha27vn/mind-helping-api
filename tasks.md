Módulo 1: Autenticação e Gestão de Perfis

Tarefa: Desenvolvimento do Cadastro de Usuário 

Sub-tarefa: Criar interface de cadastro.

Sub-tarefa: Implementar lógica de validação de dados (CPF, e-mail).

Sub-tarefa: Implementar armazenamento seguro de senha (senhaHash).



Tarefa: Desenvolvimento do Login 


Sub-tarefa: Criar interface de login.

Sub-tarefa: Implementar lógica de autenticação.

Sub-tarefa: O cadastro de usuário é um pré-requisito para o login.


Tarefa: Desenvolvimento da Edição de Perfil (Usuário e Profissional) 


Sub-tarefa: Criar interface para edição de dados pessoais.

Sub-tarefa: Implementar endpoint para atualizar as informações no banco de dados.

Módulo 2: Funcionalidades do Usuário (Paciente)

Tarefa: Gerenciamento de Metas 

Sub-tarefa: Interface para criar, editar e excluir metas.

Sub-tarefa: Lógica para registrar 

descricaoMeta, qtdeDias e dataCriacao.


Sub-tarefa: Implementar o 

contador para acompanhar o progresso.


Tarefa: Diário Pessoal

Sub-tarefa: Interface para o usuário escrever no diário (

conteudo e dataConteudo).


Sub-tarefa: Funcionalidade para cadastrar um novo registro no diário.

Sub-tarefa: Funcionalidade para excluir registros do diário.


Tarefa: Registro de Sentimentos 

Sub-tarefa: Interface para o usuário selecionar um sentimento e registrar 

motivo, data e hora.

Sub-tarefa: Vincular o registro ao 

Sentimento (com descricaoSentimento).


Tarefa: Geração de Relatórios (Humor e Variação de Sentimentos) 

Sub-tarefa: Desenvolver lógica para analisar os dados de 

SentimentoUsuario.

Sub-tarefa: Criar interface para visualização dos relatórios.


Tarefa: Busca de Profissionais 

Sub-tarefa: Criar interface de busca e filtros.

Sub-tarefa: Implementar a lógica de busca no backend.


Tarefa: Realizar Agendamento 

Sub-tarefa: Interface para visualizar horários disponíveis da agenda do profissional.



Sub-tarefa: Lógica para criar um registro de 

Agendamento vinculando 



Usuario e Profissional.

Tarefa: Integração com CVV

Sub-tarefa: Implementar funcionalidade de "Realizar Ligação CVV".

Sub-tarefa: Criar a entidade 

ChamadaCvv para registrar tempoLigacao e dataLigacao.

Módulo 3: Funcionalidades do Profissional

Tarefa: Cadastro de Profissional 

Sub-tarefa: Adicionar campos específicos como 

CRP e isSocial.




Tarefa: Gerenciamento de Agenda 


Sub-tarefa: Interface para o profissional definir 

horarioInicial, horarioFinal, intervalo e politicaCancelamento.

Sub-tarefa: Funcionalidades para criar, editar e excluir a agenda e horários.

Tarefa: Visualização de Pacientes e Agendamentos

Sub-tarefa: Criar tela para listar todos os pacientes vinculados (

Visualizar pacientes).

Sub-tarefa: Criar tela para listar todos os agendamentos (

Visualizar agendamentos).

Tarefa: Acesso aos Relatórios dos Pacientes

Sub-tarefa: Permitir que o profissional visualize o "relatório de humor" do paciente.

Sub-tarefa: Permitir que o profissional visualize o "relatório de variação de sentimentos" do paciente.

Módulo 4: Estrutura do Banco de Dados (Entidades)

Tarefa: Modelagem da Entidade Pessoa 


Atributos: 

idPessoa, nomePessoa, dataNascimento, CPF, telefone, email, senhaHash, endereço (logradouro, bairro, etc.).



Tarefa: Modelagem da Entidade Usuario 

Atributos: 

genero. Herda de 


Pessoa.


Tarefa: Modelagem da Entidade Profissional 


Atributos: 

CRP, isSocial. Herda de 

Pessoa.


Tarefa: Modelagem da Entidade Agenda 



Atributos: 

idAgenda, observacao, horarioInicial, horarioFinal, intervalo, politicaCancelamento, valorMedio.



Tarefa: Modelagem da Entidade Horario 



Atributos: 

idHorario, data, horario.


Tarefa: Modelagem da Entidade Agendamento 



Atributos: 

idAgendamento, status. Relaciona-se com 


Horario, Profissional e Usuario.

Tarefa: Modelagem das Entidades de Sentimentos

Entidade 

Sentimento: idSentimento, descricaoSentimento.


Entidade 

SentimentoUsuario: idSentimentoUsuario, motivo, data, hora. Relaciona-se com 


Usuario e Sentimento.


Tarefa: Modelagem da Entidade Meta 



Atributos: 

idMeta, descricaoMeta, qtdeDias, dataCriacao, contador.



Tarefa: Modelagem da Entidade Diario 


Atributos: 

idDiario, dataConteudo, conteudo.



Tarefa: Modelagem da Entidade ChamadaCvv 


Atributos: 

idChamada, tempoLigacao, dataLigacao.