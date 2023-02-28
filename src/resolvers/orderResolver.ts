import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { ReservationType } from "../inputs/ReservationType";
import Order from "../models/Order";
import orderService from "../services/orderService";


@Resolver(Order)
export class OrderResolver {

  @Query(() => [Order])
  async getOrderByCustomer(
    @Arg("customerId") customerId: number,
  ): Promise<Order[]> {
    return await orderService.getByCustomer(customerId);
  }

  @Query(() => [Order])
  async getOrderById(
    @Arg("id") id: string,
  ): Promise<Order[] | null> {
    return await orderService.getById(id);
  }

  @Mutation(() => Order)
  async createOrder(
    @Arg("reservations") reservations: [ReservationType],
    @Arg("userId") userId: number,
  ): Promise<Order | null> {
    return await orderService.create(reservations, userId);
  }

}
