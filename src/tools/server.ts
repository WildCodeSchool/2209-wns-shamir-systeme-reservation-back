import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { ProductResolver } from "../resolvers/productResolver";
import { dataSource } from "./utils";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { UserResolver } from "../resolvers/userResolver";
import authService from "../services/authService";
import * as dotenv from "dotenv";
import { CategoryResolver } from "../resolvers/categoryResolver";
import { ReservationResolver } from "../resolvers/reservationResolver";
import { OrderResolver } from "../resolvers/orderResolver";

async function createServer(): Promise<ApolloServer> {
  // get the .env
  dotenv.config();

  await dataSource.initialize();

  const schema = await buildSchema({
    resolvers: [ProductResolver, UserResolver, CategoryResolver, ReservationResolver, OrderResolver],
    validate: { forbidUnknownValues: false },

    // lié au décorateur @Authorized(["ADMIN"])
    authChecker: ({ context }, roles) => {
      const rolesUser = [];
      for (const role in context.user.role) {
        rolesUser.push(context.user.role[role].name);
      }
      // si user pas connecté
      if (context.user === undefined) {
        return false;
      }
      // si pas de role définit par @Auth ou role du user connecté
      if (roles.length === 0 || roles.includes(rolesUser[0])) {
        return true;
      }
      return false;
    },
  });

  return new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    // context return a object
    context: ({ req }) => {
      // if neither token neither key decodage jwt
      if (
        req?.headers.authorization === undefined ||
        process.env.JWT_SECRET_KEY === undefined
      ) {
        return {};
      } else {
        try {
          // get token in headers.authorization
          const bearer = req?.headers.authorization?.split("Bearer ")[1];
          // get user content from payload from token
          const userPayload = authService.verifyToken(bearer);

          return { user: userPayload };
        } catch (error) {
          console.log(error);
        }
      }
    },
  });
}

export default createServer;
