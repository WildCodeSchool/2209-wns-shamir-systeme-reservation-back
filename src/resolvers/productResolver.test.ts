import { ApolloServer, gql } from "apollo-server";
import createServer from "../tools/server";

describe("Product resolver", () => {
  let server: ApolloServer;

  beforeAll(async () => {
    server = await createServer();
  });

  it("should retrieve all products", async () => {
    const getAllProducts = gql`
      query GetAllProducts {
        getAllProducts {
          id
          name
          price
          description
          image
          quantity
        }
      }
    `;

    const response = await server.executeOperation({
      query: getAllProducts,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.getAllProducts).toBeDefined();
  });

  it("should not retrieve the products", async () => {
    const getAllProducts = gql`
      query GetAllProducts {
        getAllProducts {
          product
        }
      }
    `;

    const response = await server.executeOperation({
      query: getAllProducts,
    });

    expect(response.errors).toBeDefined();
  });
});
