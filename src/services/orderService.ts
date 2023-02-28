import Order from "../models/Order";
import { dataSource } from "../tools/utils";

const orderRepository = dataSource.getRepository(Order);

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
  }
}

export default orderService;