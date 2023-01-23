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

  
  @Mutation(() => Product  )
  async createProduct( 
  @Arg('product') product : ProductType
    ): Promise<Product> {
    
    return await productService.create(product);
  }
}
