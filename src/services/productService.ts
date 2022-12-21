import Product from "../models/Product";
import { dataSource } from "../tools/utils";

const repository = dataSource.getRepository(Product);

export default {
  getAll: async (): Promise<Product[]> => {
    const Products = await repository.find();
    return Products;
  },
};