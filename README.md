# SGA TESTE BACKEND 

Sou Gustavo e essa é a implementação do teste técnico da SGA System


## Setup

Este projeto vem com um docker-compose.yml e um Dockerfile prontos, para ajudá-lo a configurar um ambiente de desenvolvimento muito rapidamente.

Primeiro siga as instruções para instalar o Docker e o Docker Compose em seu sistema operacional, você pode encontrar a documentação oficial no [Site do Docker](https://docs.docker.com).

Depois de ter o Docker e o Docker Compose instalados e funcionando, você pode iniciar o servidor de desenvolvimento com um único comando:

    docker-compose up

Adaptado para este desafio, esse comando irá levantar todos os containers descritos no docker-compose.yml e rodar scripts como :
* Migrations
* Seeds, para popular o banco com 150 Tutoriais
* Testes e2e

## Considerações Técnicas

### Design

O projeto poderia ter sido feita de maneira mais simples e menos burocrática. Porém, a situação pensada é a de um projeto profissional equipado para ter continuidade e suportar complexidade (Escalabilidade, Clean Arc, Hexagonal Arc, Abstrações, Estrutura pra eventos)

### Arquitetura e Escalabilidade

O cenário do teste não tem informações o suficiente para a criação de Contextos delimitados (Bounded Contexts).

Assim, optei por criar somente um Módulo do Nest. Para escalar com microserviços, seria eficiente primeiro passar por <b>monolíticos modulares</b>, e, toda vez que identificado um bounded context novo, seria necessário criar outro Módulo Nest e facilmente mover o registro dos services para esse novo módulo.

Depois disso, para avançar como microsserviços de fato, seria necessário chamar a função <b>bootstrap()</b> para cada módulo, criando um novo processo no sistema operacional.

Para armazenar os dados, usei Postgres - um banco separado para testes

Para mensageria, usei RabbitMQ. Não foi utilizado no teste (não há necessidade), porém uma conexão TCP é aberta entre o APP e o RabbitMQ com <b>connectMicroservice()</b> e uma fila é registrada, chamada exampleQueue. 

Fiz isso para simular uma situação real, onde há emissão de eventos de domínio (TutorialUpdatedDomainEvent.ts) onde os Handlers (na camada de Application) poderiam enviar mensagens para a fila examplo criada.

### Design, Desacoplamento e SOLID

Um código escalável acontece via comunicação assíncrona. Por esse motivo optei por orientação a eventos. 

Para manter a integridade dos modelos de entidade e uma boa separação de serviços, optei por DDD e Arquitetura Limpa (Agregados, Repositórios, Mappers, Portas, Adapters).

Para acessar os dados usei o query builder Kysely.

O container de injeção de dependência do Nest também foi utilizado.

### Performance

Para cache, Redis foi utilizado

### Obervabilidade e Confiabilidade

Eventos possuem tracing para rastrear uma cascata de acontecimentos desordenados, que é algo comum em arquitetura desacopladas.
Todos os erros foram tratados com os respectivos códigos HTTP

<b>Testes e2e foram incluídos</b>

### Segurança

Para autorização, tokens JWT gerados a partir de RSA.
Além disso, algumas configurações básicas para servidores http foram adicionadas: rate limiting, cors, http headers com helmet 

### Documentação

O projeto possui documentação inicial no path /docs
O teste não solicita incluir autorização em todas as requisições

## Curiosidades e observações importantes
Levando em conta que o teste seria um projeto profissional, todas as considerações acima podem ser refatoradas para se tornarem mais robustas.
Porém, essa robustez costuma ser implementada com o tempo e foge bastante do escopo desse teste. 
Alguns exemplos que deixariam o APP mais robusto:

* Documentação do swagger mais rica em detalhes
* Mais tipos de testes
* Logs de diferentes níveis em arquivos, armazenamento de eventos em um hub
* Cache por id
* Atualização do cache após modificar uma entidade
* Utilização de CQRS

## Usando a API

### Abaixo, alguns exemplos de requisições seguidas das respostas (utilizado HTTPie)

#### Listar tutorials com paginação
```
```

#### Criar usuário:
```
POST /user/signup HTTP/1.1
Accept: application/json, */*;q=0.5
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 89
Content-Type: application/json
Host: localhost:8000
User-Agent: HTTPie/3.2.2

{
    "email": "foobar@email.com",
    "password": "12344321",
    "passwordConfirmation": "12344321"
}


HTTP/1.1 201 Created
... alguns muitos headers aqui :D

f9b6b902-9cf7-4791-a34b-08ae43fa14bc

```

#### Gerar JWT

```
POST /user/login HTTP/1.1
Accept: application/json, */*;q=0.5
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 53
Content-Type: application/json
Host: localhost:8000
User-Agent: HTTPie/3.2.2

{
    "email": "foobar@email.com",
    "password": "12344321"
}


HTTP/1.1 201 Created
... alguns muitos headers aqui :D

eyJhbGciOiJSUzI1NiIsImtpZCI6IjE3NGY1M2YzLWQ0YzQtNDc2Yi05ZTA4LWY2MDQ3NzI0ODgxOSJ9.eyJzdWIiOiJmOWI2YjkwMi05Y2Y3LTQ3OTEtYTM0Yi0wOGFlNDNmYTE0YmMiLCJhdWQiOiJmOWI2YjkwMi05Y2Y3LTQ3OTEtYTM0Yi0wOGFlNDNmYTE0YmMiLCJpYXQiOjE3MjUwNjI3NTIsImV4cCI6MTcyNTA2NjM1Mn0.XOcCmYFVVBBx6EqvprbZD2pDLk3OXnfFLq_RvhuaQC45m7BfwEGURww-griO2uqjZkpmMFXeNkSKNWqcTWq0ZxayWED1FVW2qCa0I_d1fAXqptMcgdDhugv6Mg54l6Lcybk_kruFTf1AHxTel0YFX1gt4iXzXRDihoOJ-N-B1bw

```

#### Criar Tutorial
```
POST /tutorial HTTP/1.1
Accept: application/json, */*;q=0.5
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 40
Content-Type: application/json
Host: localhost:8000
User-Agent: HTTPie/3.2.2

{
    "title": "Meu impressionante tutorial"
}


HTTP/1.1 201 Created
... alguns muitos headers aqui :D

552fd453-4566-4d1e-ac91-9424a393e3d4

```
#### Atualizar um Tutorial
```
PATCH /tutorial/552fd453-4566-4d1e-ac91-9424a393e3d4 HTTP/1.1
Accept: application/json, */*;q=0.5
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 28
Content-Type: application/json
Host: localhost:8000
User-Agent: HTTPie/3.2.2

{
    "title": "meu novo titulo"
}


HTTP/1.1 200 OK
...alguns muitos headers aqui :D
```

#### Deletar Tutorial
```
DELETE /tutorial/552fd453-4566-4d1e-ac91-9424a393e3d4 HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 0
Host: localhost:8000
User-Agent: HTTPie/3.2.2

HTTP/1.1 200 OK
...alguns muitos headers aqui :D

```

#### Tentando interagir com um tutorial deletado 

```
PATCH /tutorial/552fd453-4566-4d1e-ac91-9424a393e3d4 HTTP/1.1
Accept: application/json, */*;q=0.5
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 36
Content-Type: application/json
Host: localhost:8000
User-Agent: HTTPie/3.2.2

{
    "title": "meu segundo novo titulo"
}


HTTP/1.1 404 Not Found
Connection: keep-alive
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Date: Sat, 31 Aug 2024 00:13:15 GMT
Keep-Alive: timeout=72
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
access-control-allow-credentials: true
access-control-allow-origin: *
content-length: 111
content-type: application/json; charset=utf-8

{
    "error": "Not Found",
    "message": "Tutorial with 552fd453-4566-4d1e-ac91-9424a393e3d4 not found",
    "statusCode": 404
}
```

