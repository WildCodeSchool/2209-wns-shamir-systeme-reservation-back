import { Arg, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { ReservationType } from "../inputs/ReservationType";
import Order from "../models/Order";
import orderService from "../services/orderService";
import stripeService from "../services/stripeService";
import PaymentSheetType from "../inputs/PaymentSheetType";


@Resolver(Order)
export class OrderResolver {

  @Query(() => [Order])
  async getOrderByCustomer(
    @Arg("customerId") customerId: number,
  ): Promise<Order[]> {
    return await orderService.getByCustomer(customerId);
  }

  @Query(() => Order)
  async getOrderById(
    @Arg("orderId") orderId: number,
    @Arg("userId") userId: number,
  ): Promise<Order | null> {
    return await orderService.getById(orderId, userId);
  }

  @Query(() => [Order])
  @Authorized(["ADMIN"])
  async getAllOrders(): Promise<Order[]> {
    return await orderService.getAllOrders();
  }
  
  @Mutation(() => Int)
  async createOrder(
    @Arg("reservations", type => [ReservationType]) reservations: ReservationType[],
    @Arg("userId") userId: number,
  ): Promise<number | null> {
    return await orderService.create(reservations, userId);
  }
  
  @Mutation(() => Int)
  async validateOrder(
    @Arg("orderId") orderId: number,
  ): Promise<number | null> {
    return await orderService.validate(orderId);
  }
  
  @Mutation(() => String)
  async deleteOrder(
    @Arg("orderId") orderId: number,
  ): Promise <String> {
    try {
      await orderService.delete(orderId);
      return "ok"
    } catch (error) {
      console.log("DELETE ORDER ///////////////////////////////////////////////////////////", error)
      return "error delete order"
    }
  }
  
  @Query(() => String)
  async paymentOrder(
    @Arg("orderId") orderId: number,
    @Arg("userId") userId: number,
  ): Promise<string | null> {
    const order = await orderService.getById(orderId, userId);
    if (order) {
      return stripeService.orderPayment(order);
    }
    return null
  }

  @Mutation(() => PaymentSheetType)
  async paymentSheetMobile(@Arg("totalAmount") totalAmount: number,) : Promise<PaymentSheetType> {
    return stripeService.paymentSheetMobile(totalAmount)
  }
}
