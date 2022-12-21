import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { dataSource } from "./tools/utils";
import { buildSchema } from "type-graphql";
import { ProductResolver } from "./resolvers/productResolver";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";


const port = 5000;

const start = async (): Promise<void> => {
  await dataSource.initialize();
  const schema = await buildSchema({
    resolvers: [ProductResolver],
  });
  
  const server = new ApolloServer({ 
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })], 
  }); 

  try {
    const { url }: { url: string } = await server.listen({ port });
    console.log(`Server ready at ${url}`);
  } catch (e) {
    console.error("Error starting the server");
  }
};

void start();





