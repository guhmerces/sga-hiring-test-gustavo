# SGA TESTE BACKEND 

Sou Gustavo e essa é a implementação do teste técnico da SGA System


## Setup

Este projeto vem com um docker-compose.yml e um Dockerfile prontos, para ajudá-lo a configurar um ambiente de desenvolvimento muito rapidamente.

Primeiro siga as instruções para instalar o Docker e o Docker Compose em seu sistema operacional, você pode encontrar a documentação oficial no [Site do Docker](https://docs.docker.com).

Depois de ter o Docker e o Docker Compose instalados e funcionando, <b>entre na raiz do projeto e use os comandos</b>:

    docker build --tag "backend" .

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

Assim, optei por criar somente um Módulo do Nest. Para escalar com microserviços, seria eficiente primeiro passar por <b>monolíticos modulares</b> antes de separar em microserviços (se houver necessidade), e, toda vez que identificado um bounded context novo, seria necessário criar outro Módulo Nest e facilmente mover o registro dos services para esse novo módulo.

Para mensageria, usei RabbitMQ. Não foi utilizado no teste (não há necessidade), porém uma conexão TCP é aberta entre o APP e o RabbitMQ com <b>connectMicroservice()</b> e uma fila é registrada, chamada exampleQueue. Também há exemplo de evento (TutorialUpdatedDomainEvent.ts)

### Design, Desacoplamento e SOLID

Um código escalável acontece via comunicação assíncrona. Por esse motivo optei por orientação a eventos. 

Para manter a integridade dos modelos de entidade e uma boa separação de serviços, optei por DDD e Arquitetura Limpa (Agregados, Repositórios, Mappers, Portas, Adapters).

Para acessar os dados usei o query builder Kysely.

O container de injeção de dependência do Nest também foi utilizado.

### Performance

Para cache, Redis foi utilizado

### Obervabilidade e Confiabilidade

Eventos possuem tracing para rastrear uma cascata de acontecimentos desordenados.

Todos os erros foram tratados com os respectivos códigos HTTP

#### <b> Uso de transações e seus logs </b>

#### <b>Testes e2e foram incluídos</b>

### Segurança

Para autorização, tokens JWT gerados a partir de RSA.
Além disso : uso de libs para rate limiting, cors, http headers com helmet 

### Documentação

O projeto possui documentação inicial no path /docs ( O teste não solicita incluir autorização em todas as requisições)

## Curiosidades e observações importantes
Levando em conta que o teste seria um projeto profissional, todas as considerações acima podem ser refatoradas para se tornarem mais robustas. Alguns exemplos:

* Documentação do swagger mais rica em detalhes
* Mais tipos de testes
* Logs de diferentes níveis em arquivos, armazenamento de eventos em um hub
* Cache por id
* Atualização do cache após modificar uma entidade
* Utilização de CQRS

## Usando a API

### Abaixo, alguns exemplos de requisições seguidas das respostas (utilizado HTTPie)

#### Listar Tutorials - com paginação (data de criação 25/08/2024, page 0, limit 3)
```
GET /tutorial?creationDate=30/08/2024&page=0&limit=3 HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:8000
User-Agent: HTTPie/3.2.2



HTTP/1.1 200 OK
... alguns response headers aqui

{
    "count": 3,
    "data": [
        {
            "createdAt": "2024-08-31T00:34:41.269Z",
            "creationDate": "30/08/2024",
            "id": "23c8db46-ee01-4d22-bc2e-f3122b4f0e53",
            "title": "My awesome tutorial of number 0"
        },
        {
            "createdAt": "2024-08-31T00:34:41.269Z",
            "creationDate": "30/08/2024",
            "id": "38662a91-568e-4d7b-a3e8-60d768b42f1b",
            "title": "My awesome tutorial of number 1"
        },
        {
            "createdAt": "2024-08-31T00:34:41.269Z",
            "creationDate": "30/08/2024",
            "id": "486eda93-9c08-48e9-8700-1b0e84c0ced1",
            "title": "My awesome tutorial of number 2"
        }
    ],
    "limit": 3,
    "page": 0
}
```

#### Listar Tutorials - com paginação (data de criação 30/08/2024, page 1, limit 3)

```
GET /tutorial?creationDate=30/08/2024&page=1&limit=3 HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:8000
User-Agent: HTTPie/3.2.2



HTTP/1.1 200 OK
... alguns response headers aqui

{
    "count": 3,
    "data": [
        {
            "createdAt": "2024-08-31T00:34:41.269Z",
            "creationDate": "30/08/2024",
            "id": "c0b6d7e2-4d2c-4d6d-a6f4-2e06dfbd9aa6",
            "title": "My awesome tutorial of number 3"
        },
        {
            "createdAt": "2024-08-31T00:34:41.270Z",
            "creationDate": "30/08/2024",
            "id": "bc28456b-569f-48d0-97cc-0df0bdb7445a",
            "title": "My awesome tutorial of number 4"
        },
        {
            "createdAt": "2024-08-31T00:34:41.270Z",
            "creationDate": "30/08/2024",
            "id": "a382af66-cfd9-4b01-a54d-41356c9ee540",
            "title": "My awesome tutorial of number 5"
        }
    ],
    "limit": 3,
    "page": 1
}
```

#### Listar Tutorials - com paginação (título "My awesome tutorial of number 55", page 0, limit 3)

```
GET /tutorial?title=My%20awesome%20tutorial%20of%20number%2055&page=0&limit=3 HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:8000
User-Agent: HTTPie/3.2.2



HTTP/1.1 200 OK
... alguns response headers aqui

{
    "count": 1,
    "data": [
        {
            "createdAt": "2024-08-31T00:34:41.272Z",
            "creationDate": "30/08/2024",
            "id": "908b187d-8089-41e8-a954-647199c40ec7",
            "title": "My awesome tutorial of number 55"
        }
    ],
    "limit": 3,
    "page": 0
}
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
... alguns response headers aqui:D

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
... alguns response headers aqui:D

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
... alguns response headers aqui:D

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
... alguns response headers aqui:D
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
... alguns response headers aqui:D

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

#### Tentando criar um Usuário com um email já cadastrado
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


HTTP/1.1 403 Forbidden
... alguns response headers aqui :D

{
    "error": "Forbidden",
    "message": "The email foobar@email.com is already registered.",
    "statusCode": 403
}
```

#### Tentando utilizar uma data incorreta
```
GET /tutorial?creationDate=30-13/2024&page=1&limit=3 HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:8000
User-Agent: HTTPie/3.2.2


HTTP/1.1 422 Unprocessable Entity
... alguns response headers aqui :D

{
    "error": "Unprocessable Entity",
    "message": [
        {
            "code": "custom",
            "message": "Format should be one of the following : dd/mm/yyyy or dd.mm.yyyy or dd-mm-yyyy",
            "params": {
                "price": "invalid"
            },
            "path": [
                "creationDate"
            ]
        }
    ],
    "statusCode": 422
}

```

#### Utilizando senha e confirmação de senha divergentes
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
    "passwordConfirmation": "12345678"
}


HTTP/1.1 422 Unprocessable Entity
... alguns response headers aqui :D

{
    "error": "Unprocessable Entity",
    "message": "[\n  {\n    \"code\": \"custom\",\n    \"message\": \"password, passwordConfirmation : Password fields dont match\",\n    \"path\": [\n      \"password\",\n      \"passwordConfirmation\"\n    ]\n  }\n]",
    "statusCode": 422
}
```

