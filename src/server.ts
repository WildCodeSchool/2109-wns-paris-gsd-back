import * as dotenv from 'dotenv';

import 'reflect-metadata';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import {  buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import TaskResolver  from './modules/Task/Task.resolver';
import CommentResolver from './modules/Comment/Comment.resolver';

dotenv.config();

const start = async () => {
 await createConnection({
    type: 'postgres',
    url: process.env.DB_URL,
    synchronize: true,
    logging: true,
    entities: ['src/entity/*.*'],
  });

  const schema = await buildSchema({
    resolvers: [TaskResolver, CommentResolver],
  });

  const apolloServer = new ApolloServer({ schema });

  const app = express();

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(process.env.PORT || 3000, () => {
    console.log(
      `server started at http://localhost:${process.env.PORT || 3000}/graphql`
    );
  });
};

start();
