import Reservation from "../models/Reservation";
import { dataSource } from "../tools/utils";

const reservationRepository = dataSource.getRepository(Reservation);

export default {
  getAll: async (): Promise<Reservation[]> => {
    const Reservations = await reservationRepository.find({
      relations: {
        order: { user: true },
        product: true,
      },
      order: {
        start: "ASC",
      },
    });
    return Reservations;
  },
};
