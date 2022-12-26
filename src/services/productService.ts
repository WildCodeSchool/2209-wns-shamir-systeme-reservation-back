import Product from "../models/Product";
import { dataSource } from "../tools/utils";

const repository = dataSource.getRepository(Product);

export default {
  getAll: async (): Promise<Product[]> => {
    const Products = await repository.find({
      relations: {
        category: true,
      }
    });
    return Products;
  },

  create: async (productData: Product): Promise<Product> => {
    const product = await repository.save(productData);
    return product;
  }
};