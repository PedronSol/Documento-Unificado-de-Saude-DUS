# Histórias de Usuário do Projeto Documento Unificado de Saúde

## US1 - Adicionar dados pessoais

Descrição: Eu como usuário, gostaria de armazenar os meus dados pessoais, sendo eles Nome, Foto, CPF, data de nascimento (idade) e tipo sanguíneo.

Prioridade: Alta

Estimativa: 3 US

Critérios de Aceitação:
1. O usuário deve ser capaz de visualizar estruturadamente esses dados
2. Os dados precisam, cada um, ser armazenados em seus doimínio (tipos) específicos.
3. Dados devem passar por uma validação (como e-mail, CPF e número de contato)

## US2 - Modificar Dados Pessoais

Descrição: Eu como usuário, gostaria de modificar os meus dados inseridos.

Prioridade: Alta

Estimativa: 2 US

Critérios de Aceitação:
1. Não devem haver campos vazios
2. Os dados alterados precisam substituir os dados antigos, tanto na visualização quanto no banco

## US3 - Autenticação do Usuário na Aplicação

Descrição: Eu como usuário, gostaria de acessar os meus dados de forma segura, de modo que apenas eu, pessoas autorizadas por mim ou meus guardiões consigam fazer esse acesso.

Prioridade: Alta

Estimativa: 3 US

Critérios de Aceitação:
1. Cada usuário deve ter associado a si um login (e-mail) e uma senha
2. Um usuário não deve conseguir acessar os dados de outro sem que haja autorização
3. O Login é único e não pode ser repetido.
4. A sessão de conexão do usuário deve ser mantida até que ele se desconecte
