import Product from "../models/Product";
import Reservation from "../models/Reservation";
import { dataSource } from "../tools/utils";

const productRepository = dataSource.getRepository(Product);
const reservationRepository = dataSource.getRepository(Reservation);

export default {
  getAll: async (): Promise<Product[]> => {
    const Products = await productRepository.find({
      relations: {
        category: true,
      },
    });
    return Products;
  },

  getLastFour: async (): Promise<Product[]> => {
    const products = productRepository
      .createQueryBuilder("product")
      .orderBy("product.id", "DESC")
      .take(4)
      .getMany();
    return products;
  },

  getByDate: async (dateFrom: string, dateTo: string): Promise<Product[]> => {
    const allProducts: Product[] = await productRepository.find({
      relations: {
        category: true,
      },
    });

    const newDateFrom: Date = new Date(dateFrom);
    const newDateTo: Date = new Date(dateTo);

    // on récupère tous les produits réservés entre la date de début et de fin saisies par le client
    const reservationBooked = await reservationRepository
      .createQueryBuilder("reservation")
      .innerJoinAndSelect("reservation.product", "product")
      .where(
        "reservation.start BETWEEN :newDateFrom AND :newDateTo OR reservation.end BETWEEN :newDateFrom AND :newDateTo",
        { newDateFrom, newDateTo }
      )
      .orWhere(
        " :newDateFrom BETWEEN reservation.start AND reservation.end OR :newDateTo BETWEEN reservation.start AND reservation.end",
        { newDateFrom, newDateTo }
      )
      .getMany();

    // puis on récupère tous les id des produits réservés sur la période
    const productsBookedsIds = reservationBooked.map(
      (reservation: Reservation): number | undefined => {
        return reservation.product.id;
      }
    );

    // dans le tableau des id on compte combien de fois chaque id apparaît et on compare avec le stock initial
    const productsFilteredByDate = allProducts.filter(
      (product: Product): Product | undefined => {
        let productBookedQuantity = productsBookedsIds.filter(
          (id) => id === product.id
        ).length;
        // si le nombre de produits réservés est inférieur à la quantité initiale on renvoie le produit
        if (productBookedQuantity < product.quantity) {
          // on récupère le stock restant et on l'attribue au champ quantity des produits filtrés
          product.quantity = product.quantity - productBookedQuantity;
          return product;
        }
      }
    );

    return productsFilteredByDate;
  },

  create: async (productData: Product): Promise<Product> => {
    const product = await productRepository.save(productData);
    return product;
  },

  update: async (id: number, product: Product): Promise<Product | null> => {
    await productRepository.update(id, product);
    return await productRepository.findOneBy({ id });
  },

  delete: async (id: number): Promise<void> => {
    await productRepository.delete(id);
  },
};
