# 2109-wns-paris-gsd-back

## Setup

[Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable) ` v1.22.15`

[Node](https://nodejs.org/en/) `v14 or latest`

[Postgresql](https://www.postgresql.org/download/) `v12 or latest`

[TypeScript](https://www.typescriptlang.org/)

## Principales Dependencies

[GraphQL](https://graphql.org/)

[Apollo-server-express](https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express)

[Express](http://expressjs.com/)

## Create database in local

After you have installed postgresql in your setup, in the shell terminal please type this commands, make sure you logged with postgres user.

```bash
user@name-of-your-machine ~ psql -U postgres

#You must see this command line to await a new typing
postgres=# |
```

In this shell please type this commands, don't forget the semi-colons

```bash
CREATE user "usernane" WITH password 'password';
ALTER role "username" WITH SUPERUSER CREATEDB;
CREATE DATABASE "dbname" OWNER "username";
```

Please following the file .env.example and create a copy of this and change in POSTGRES_URL your credentials.

## Start Project

First time `yarn` to install dependencies or update dependencies

`yarn start` to start project, enjoy...

## Docker

To launch the project in docker

`docker-compose --build -f ./docker-compose.dev.yml up`
