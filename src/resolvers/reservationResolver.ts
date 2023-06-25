import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import Reservation from "../models/Reservation";
import reservationService from "../services/reservationService";


@Resolver(Reservation)
export class ReservationResolver {
  @Authorized(["ADMIN"])
  @Query(() => [Reservation])
  async getAllReservations(): Promise<Reservation[]> {
    return await reservationService.getAll();
  }

}
