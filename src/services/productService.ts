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

  getByDate: async (dateFrom: string, dateTo: string): Promise<Product[]> => {
    const allProducts: Product[] = await productRepository.find({
      relations: {
        category: true,
      },
    });

    const newDateFrom: Date = new Date(dateFrom);
    const newDateTo: Date = new Date(dateTo);

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

    const productsBookedsIds = reservationBooked.map(
      (reservation: Reservation): number | undefined => {
        return reservation.product.id;
      }
    );

    const productsFilteredByDate = allProducts.filter(
      (product: Product): Product | undefined => {
        let productBookedQuantity = productsBookedsIds.filter(
          (id) => id === product.id
        ).length;
        if (productBookedQuantity < product.quantity) {
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
