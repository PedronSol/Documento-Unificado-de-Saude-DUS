# Documento-Unificado-de-Saude-DUS

## Índice
- [Sobre o Projeto](#sobre-o-projeto)
- [Como clonar ou baixar](#como-clonar-ou-baixar)
- [Como Executar?](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Licença](#licença)

## Sobre o Projeto

### Título
Documento Unificado de Saúde (DUS)

### Descrição
Este é um projeto universitário para as disciplinas de Engenharia de Software e Banco de Dados do curso de Engenharia de Computação da UFRN, que busca criar uma aplicação para servir como um centralizador de dados pessoais e de saúde para auxiliar pessoas e pacientes na organização e utilização de seus dados de saúde e exames.

### Componentes
- Diogo Esthevão Silva de Oliveira
- Luis Gabriel Alves de Oliveira
- Pedro Nelson Nóbrega Monteiro Leite Fonseca
- Reinaldo Tavares da Silva Filho

## Como clonar ou baixar

### Clonar via HTTPS

```bash
git clone https://github.com/PedronSol/Documento-Unificado-de-Saude-DUS.git
```

Clonar por este método criará uma cópia local deste repositório em sua máquina.

### Clonar via SSH (Apenas se houver chave SSH configurada no GitHub)

```bash
git clone git@github.com:PedronSol/Documento-Unificado-de-Saude-DUS.git
```

Clonar por este método criará uma cópia local deste repositório em sua máquina.

### Baixar como ZIP

1. Acesse a página do repositório no GitHub:
   [https://github.com/PedronSol/Documento-Unificado-de-Saude-DUS](https://github.com/PedronSol/Documento-Unificado-de-Saude-DUS)
2. Clique no botão **Code** (verde).
3. Selecione **Download ZIP**.
4. Extraia o arquivo ZIP para o local desejado em seu computador.

## Como Executar?

Para executar a aplicação como um todo, deve-se entrar no diretório no qual o projeto foi clonado e executar o comando:
```Docker
docker compose up --build
```
Isso fará com que todos os contêineres da aplicação sejam criados e, após esse passo (e o carregamento de todos os contêineres), torna-se possível acessar a aplicação via http://localhost:3000. É válido citar que, para executar o comando Docker acima, deve-se ter instalado em sua máquina o "Docker" e o "Docker Compose".

Ao acessar a aplicação, será solicitado um login, e para fins de testes é possível utilizar os usuários "carlos.silva@email.com" e "mariana.souza@email.com", ambos com a senha "senha123".

Uma vez que os contêineres estiverem completamente montados e a aplicação funcionando, para executar os testes unitários, deve-se abrir um outro terminal, também no diretório do projeto, e executar o comando:
```Docker
docker exec -it saude_backend_container python -m pytest --cov=main test_main.py
```

Por fim, para finalizar a execução do projeto, basta utilizar o comando:
```Docker
docker compose down -v
```

## Estrutura do Projeto

### Banco de Dados
A primeira parte do projeto é o Banco de Dados, presente na pasta "db" que contém os scripts "01_tabelas.sql" que cria as tabelas utilizadas no projeto e "02_popular_bd.sql", que popula as tabelas criadas com dados fictícios de 10 pacientes gerados com auxílio de inteligência artificial.

### Front End

A segunda parte do Projeto é a sua interface, que, por hora, contém a página de login e a página principal além de seus componentes. A interface foi feita utilizando o framework NextJS e está presente na pasta "FrontEnd"

### Back End

A terceita parte é o BackEnd, responsável por todo o trabalho de criação de rotas e testes unitários. É dividido nos scripts "main.py" que rege toda a lógica da aplicação, e "main_test.py", que executa três testes unitários na classe "Pacientes"

### Docker

A última parte, por fim, é a conteinerização de cada uma das partes citadas acima, feitas utilizando dois arquivos "Dockerfile", um para o Back e outro para o Front e um arquivo "docker-compose.yml" para gerir os contêineres do Front, Back e Banco de Dados

## Licença
Este projeto está licenciado sob a **Licença MIT**. Veja o arquivo `LICENSE` para mais detalhes.
