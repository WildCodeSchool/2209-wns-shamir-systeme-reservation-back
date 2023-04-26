import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { ReservationType } from "../inputs/ReservationType";
import Order from "../models/Order";
import orderService from "../services/orderService";
import stripe from "./stripe";


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
    @Arg("orderId") orderId: number,
    @Arg("userId") userId: number,
  ): Promise<Order[] | null> {
    return await orderService.getById(orderId, userId);
  }

  // @Mutation(() => Order)
  // async createOrder(
  //   @Arg("reservations", type => [ReservationType]) reservations: ReservationType[],
  //   @Arg("userId") userId: number,
  // ): Promise<Order | null> {
  //   return await orderService.create(reservations, userId);
  // }
  
  @Mutation(() => String)
  async createOrder(
    @Arg("reservations", type => [ReservationType]) reservations: ReservationType[],
    @Arg("userId") userId: number,
  ): Promise<Order | null> {
    const result = await orderService.create(reservations, userId);
    return stripe.orderPayment(result);
  }


}
