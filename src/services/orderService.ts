import { ReservationType } from "../inputs/ReservationType";
import Order from "../models/Order";
import Product from "../models/Product";
import Reservation from "../models/Reservation";
import stripe from "../resolvers/stripe";
import { dataSource } from "../tools/utils";
import userService from "./userService";

const orderRepository = dataSource.getRepository(Order);
const reservationRepository = dataSource.getRepository(Reservation);

const orderService = {
  getByCustomer: async (customerId: number): Promise<Order[]> => {
    const orders: Order[] = await orderRepository
    .createQueryBuilder('order')
    .leftJoinAndSelect('order.reservations', 'reservation') 
    .leftJoinAndSelect('reservation.product', 'product')
    .where('order.customer_id = :customerId', { customerId })
    .orderBy("order.created_at", "DESC")
    .getMany();
  
    return orders;
  },

  getById : async (id: string): Promise< Order[] | null> => {
    const order: Order[]  = await orderRepository
    .createQueryBuilder('order')
    .leftJoinAndSelect('order.reservations', 'reservation') 
    .leftJoinAndSelect('reservation.product', 'product')
    .where('order.id = :id', { id })
    .getMany();

    return order;
  },

  create : async (reservations: ReservationType[], userId: number) : Promise<any[] | null> => {
    // on comptabilise le total de toutes les réservations
    let totalOrder: number = 0
    reservations.forEach(reservation => {
      totalOrder += reservation.price;
    });

    // on récupère un objet client
    const user = await userService.getById(userId)
    if (user !== null) {
      const now = new Date(Date.now())
      const orderData = {
        created_at : now,
        total_price : totalOrder,
        status: 1,
        user : user,
      }
      // on crée la commande
      const order = await orderRepository.save(orderData);
      // on crée les réservations
      reservations.map(async (reservation) => {
        await reservationRepository.save({...reservation, status : 1, order : order})
      })

      return reservations;

    } else return null
  }
}

export default orderService;