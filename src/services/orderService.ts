import { ReservationType } from "../inputs/ReservationType";
import Order from "../models/Order";
import Product from "../models/Product";
import Reservation from "../models/Reservation";
import User from "../models/User";
import stripe from "./stripeService";
import { dataSource } from "../tools/utils";
import userService from "./userService";

const orderRepository = dataSource.getRepository(Order);
const reservationRepository = dataSource.getRepository(Reservation);
const userRepository = dataSource.getRepository(User);

const orderService = {
  getByCustomer: async (customerId: number): Promise<Order[]> => {
    const orders: Order[] = await orderRepository
    .createQueryBuilder('order')
    .leftJoinAndSelect('order.reservations', 'reservation') 
    .leftJoinAndSelect('reservation.product', 'product')
    .where('order.customer_id = :customerId', { customerId })
    .andWhere('order.status != 2')
    .orderBy("order.created_at", "DESC")
    .getMany();
  
    return orders;
  },

  getById : async (orderId: number, userId: number): Promise< Order | null> => {
  
    const order: Order | null = await orderRepository
    .createQueryBuilder('order')
    .leftJoinAndSelect('order.reservations', 'reservation') 
    .leftJoinAndSelect('reservation.product', 'product')
    .leftJoinAndSelect('order.user', 'user')
    .where('order.id = :orderId', { orderId})
    .getOne();

    if (userId == 0 || order?.user.id === userId ) {
       return order;
      } else {
       return null;
    }
   
  },

  getAllOrders: async (): Promise<Order[]> => {
    const Orders = await orderRepository.find({
      relations: {
        user: true,
        reservations : {product: true},
      },
      order: {
        id: "DESC",
      },
    });
    return Orders;
  },

  create : async (reservations: ReservationType[], userId: number) : Promise<number | null> => {
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
        status: 2,
        user : user,
      }
      // on crée la commande
      const order = await orderRepository.save(orderData);
      // on crée les réservations
      reservations.map(async (reservation) => {
        await reservationRepository.save({...reservation, status : 1, order : order})
      })
      return order.id;

    } else return null
  },

  validate: async (orderId: number) : Promise<number | null> => {
    const order = await orderRepository.update(orderId, {status: 1})
    return orderId;
  },

  delete: async (orderId: number) : Promise<void> => {
    await orderRepository.delete(orderId)
  }

}

export default orderService;