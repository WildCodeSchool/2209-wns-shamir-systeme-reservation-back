import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { ProductType } from "../inputs/ProductType";
import Category from "../models/Category";
import Product from "../models/Product";
import productService from "../services/productService";

@Resolver(Product)
export class ProductResolver {
  @Query(() => [Product])
  async getAllProducts(): Promise<Product[]> {
    return await productService.getAll();
  }

  @Query(() => [Product])
  async getLastFourProducts(): Promise<Product[]> {
    return await productService.getLastFour();
  }

  @Query(() => [Product])
  async getProductsByDate(
    @Arg("dateFrom") dateFrom: string,
    @Arg("dateTo") dateTo: string
  ): Promise<Product[]> {
    return await productService.getByDate(dateFrom, dateTo);
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Product)
  async createProduct(@Arg("product") product: ProductType): Promise<Product> {
    return await productService.create(product);
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Product)
  async updateProduct(
    @Arg("id") id: number,
    @Arg("product") product: ProductType
  ): Promise<Product | null> {
    return await productService.update(id, product);
  }
  
  @Authorized(["ADMIN"])
  @Mutation(() => String)
  async deleteProduct(@Arg("id") id: number): Promise<string> {
    await productService.delete(id);
    return "ok";
  }
}
