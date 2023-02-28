import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import userType from "../inputs/UserType";
import Order from "../models/Order";
import User from "../models/User";
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


}
