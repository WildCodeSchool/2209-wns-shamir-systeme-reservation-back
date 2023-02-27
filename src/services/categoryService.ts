import Category from "../models/Category";
import { dataSource } from "../tools/utils";

const repository = dataSource.getRepository(Category);

const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const categories = await repository.find({
      relations: {
        products: true,
      },
      order: {
        id: "ASC",
      },
    });
    return categories;
  },

  getByName: async (name: string) => {
    return await repository.findOneBy({
      name,
    });
  },

  create: async (name: string): Promise<Category> => {
    const category = await categoryService.getByName(name);
    if (category !== null) {
      throw new Error("category already exists");
    }
    return await repository.save({ name });
  },

  delete: async (id: number): Promise<string> => {
    const categoryToDelete = await repository.findOneBy({
      id,
    });
    if (!categoryToDelete) {
      return "Cette catégorie n'existe pas.";
    }
    if (categoryToDelete.products && categoryToDelete.products.length > 0) {
      return "Des produits sont rattachés à cette catégorie. Impossible de la supprimer.";
    } else {
      await repository.delete(id);
      return "Catégorie supprimée.";
    }
  },
};

export default categoryService;
