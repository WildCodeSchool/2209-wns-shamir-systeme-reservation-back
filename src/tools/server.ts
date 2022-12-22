import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { ProductResolver } from "../resolvers/productResolver";
import { dataSource } from "./utils";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

async function createServer(): Promise<ApolloServer> {
    await dataSource.initialize();
    
    const schema = await buildSchema({
      resolvers: [ProductResolver],
      validate: { forbidUnknownValues: false }
    });
    
    return new ApolloServer({ 
      schema,
      csrfPrevention: true,
      cache: "bounded",
      plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })], 
    }); 
  
  };

export default createServer;