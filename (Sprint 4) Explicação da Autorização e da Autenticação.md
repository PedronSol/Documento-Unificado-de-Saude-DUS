# Autorização e Autenticação

Para o Sprint 04 da matéria de Engenharia de Software foi solicitado que fossem implementados mecanismos simples de autorização e autenticação na aplicação. A explicação da implementação e do funcionamento destes conceitos está descrita a seguir.

## Autenticação

A autenticação na aplicação é feita na página de Login, em que o usuário informa o seu e-mail e a sua senha e a aplicação irá verificar se o e-mail fornecido existe e se a senha informada é a correta para aquele usuário. Isso é feito por meio de uma consulta ao Banco de Dados em que a API seleciona todos os pacientes cujo e-mail é igual ao fornecido, mas, como é uma condição do Banco que pacientes não tenha e-mails iguais, irá retornar apenas um único paciente. Este paciente tem então o campo de senha comparado com a senha fornecida ao formulário de login. Caso o e-mail e a senha estejam corretos, o usuário consegue entrar na aplicação, caso contrário, receberá uma mensagem de erro.

## Autorização

A autorização é feita com base na idade do paciente, tendo sido implementada uma autorização em modelo **ABAC** ou ***Attribute-Based Access Control***, em que a idade do paciente é calculada no Back-End de acordo com a sua data de nascimento fornecida no Banco de Dados e é definido se este paciente é maior ou menor de idade, ou seja, se a sua idade calculada no momento de seu login é maior ou igual ou menor do que 18 anos.

Caso a idade calculada seja maior, o usuário possui plenos poderes sobre a sua conta, podendo modificar os seus dados (no momento, esta modificação se dá pela capacidade de adicionar, alterar e deletar vacinas). Caso seja menor, porém, o usuário perde a capacidade de modificar os seus dados, partindo do pressuposto de que usuário menores de idade não possuem responsabilidade suficiente para se responsabilizar por seus próprios dados (no momento, esta "limitação de poderes" é implementada com o os botões de adição, modificação e deleção das vacinas desaparecendo e o usuário perdendo a capacidade de realizar estas ações diretamente no Front-End).

## Testes

Para testar a autenticação e a autorização simultâneamente, é possível utilizar as combinações "carlos.silva@email.com" (usuário) e "senha123" (senha) para o usuário Carlos Silva que possui 41 anos, e "mariana.souza@email.com" (usuário) e "senha123" (senha) para a usuário Mariana Souza que é uma criança de 4 anos.