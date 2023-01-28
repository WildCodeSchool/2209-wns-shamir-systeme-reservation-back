import Category from "../models/Category";
import { dataSource } from "../tools/utils";

const repository = dataSource.getRepository(Category);

const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const categories = await repository.find({
      relations: {
        products: true,
      }
    });
    return categories;
  },

  getByName: async (name: string) => {
    return await repository.findOneBy({
      name
    });
  },

  
  create: async (name: string): Promise<Category> => {
    const category = await categoryService.getByName(name);
    if (category !== null) {
      throw new Error('category already exists');
    }
    return await repository.save({ name });
  }

};

export default categoryService;