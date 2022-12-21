import { Query, Resolver } from "type-graphql";
import Product from "../models/Product";
import productService from "../services/productService";

@Resolver(Product)
export class ProductResolver {
  @Query(() => [Product])
  async getAllProducts(): Promise<Product[]> {
    return await productService.getAll();
  }
}
