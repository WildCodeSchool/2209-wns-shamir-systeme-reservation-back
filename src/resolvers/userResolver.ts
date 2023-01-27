import { Resolver, Query, Mutation, Arg, Authorized } from "type-graphql";
import User from "../models/User";
import authService from "../services/authService";
import userService from "../services/userService";
import userType from '../inputs/UserType';

@Resolver(User)
export class UserResolver {
  //   method: get
  @Authorized(["ADMIN"])
  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return await userService.getAll();
  }

  @Query(() => Boolean)
  async isAdmin(@Arg("token") token: string): Promise<Boolean> {
    return await userService.isAdmin(token);
  }
  
  @Query(() => User)
  async getUser(
    @Arg("token") token: string,
  ): Promise<any> {
    const userPayload = authService.verifyToken(token);
    return await userService.getByEmail(Object.values(userPayload)[0]);
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("userId") userId: number,
    @Arg("userData") userData: userType
  ): Promise<any> {
    return await userService.update(userId, userData);
  }

  @Mutation(() => String)
  async createUser(
    @Arg("firstname") firstname: string,
    @Arg("lastname") lastname: string,
    @Arg("phone") phone: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("passwordConfirm") passwordConfirm: string
  ): Promise<String> {
    console.log("user inscrit");

    // confirm double password
    if (password != passwordConfirm) {
      throw new Error("Password is not confirmed");
    }

    await userService.create(firstname, lastname, phone, email, password);
    return "User create";
  }

  //   method: post
  @Mutation(() => String)
  async getToken(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<String> {
    try {
      // get user in DB by email
      const user = await userService.getByEmail(email);

      // check password
      if (user && (await authService.verifyPassword(password, user.password))) {
        // Create new token
        const token = authService.signJwt({
          email: user.email,
          role: user.roles,
        });

        return token;
      } else {
        // if error direct catch
        throw new Error();
      }
      // Retour d'une erreur type pour eviter de renseigner que le user n'est pas en base
    } catch (error) {
      throw new Error("Invalid Auth");
    }
  }
}
