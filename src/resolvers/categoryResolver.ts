import { Arg, Mutation, Query, Resolver } from "type-graphql";
import Category from "../models/Category";
import categoryService from "../services/categoryService";


@Resolver(Category)
export class CategoryResolver {
  @Query(() => [Category])
  async getAllCategories(): Promise<Category[]> {
    return await categoryService.getAll();
  }

  @Mutation(() => String)
  async createCategory(@Arg("name") name: string): Promise<Category> {
    return await categoryService.create(name);
  }
}
