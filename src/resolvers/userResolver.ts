import { Resolver, Query, Mutation, Arg, Authorized } from "type-graphql";
import User from "../models/User";
import authService from "../services/authService";
import userService from "../services/userService";
import userType from '../inputs/UserType';
import mailjet from "./mailjet";

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

  @Query(() => String)
  async checkTokenResetPassword(@Arg("token") token: string): Promise<String> {
    const user = await userService.getByTokenReset(token);
    if (user !== null) {
      // @ts-ignore
      const updateReset = new Date(user.update_reset).getTime();

      const diff = Math.abs(updateReset - Date.now());
      const minutes = Math.floor((diff / 1000) / 60)

      // if time update_reset > + 15 minutes
      if (minutes > 15) {
        return "Le temps a expiré, veuillez refaire la procédure de réinitialisation du mot de passe";
      } else {
        return token;
      }
    } else {
      return "Une erreur est survenue…";
    }
  }

  //   method: post
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

  @Mutation(() => String!)
  async resetPassword(
    @Arg("email") email: string,
  ): Promise<String> {
    try {
      // get user in DB by email
      const user = await userService.getByEmail(email);
      // @ts-ignore
      const userId = user.id;
      // generate token
      const token = Date.now() + Math.floor(Math.random() * 1000) + Math.random().toString(35).substring(2, 12);
      const date = new Date();
      // update field token_reset of user
      await userService.updateToken(userId, token, date.toString());

      // @ts-ignore
      // send mail with link + token
      mailjet.sendResetPassword(email, user?.firstname, user?.lastname, token);
      return `Un email a bien été envoyé à l'adresse suivante : ${email}`

    } catch (error) {
      console.log('====================================');
      console.log('error dans le BACK ', error);
      console.log('====================================');
      throw new Error("Une erreur est survenue, assurez-vous de renseigner un email valide.");
    }
  }

  @Mutation(() => String)
  async modifyPassword(
    @Arg("token") token: string,
    @Arg("password") password: string,
    @Arg("passwordConfirm") passwordConfirm: string
  ): Promise<any> {
    try {
      // get user in DB by token
      const user = await userService.getByTokenReset(token);
      // @ts-ignore
      const userId = user.id;
      // confirm double password
      if (password != passwordConfirm) {
        throw new Error("Le mot de passe est incorrect.");
      } else {
        await userService.modifyPassword(userId, password)
        return "Le mot de passe a bien été modifié."
      }
    } catch (error) {
      throw new Error("Une erreur est survenue.");
    }
  }

  @Mutation(() => String!)
  async makingContact(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("subject") subject: string,
    @Arg("message") message: string,
  ): Promise<String> {
    try {
      // send mail with informations from contact form
      mailjet.fromContactForm(name, email, subject, message);
      return 'Votre email a bien été envoyé.'
    } catch (error) {
      console.log('====================================');
      console.log('error dans la mutation makingContact ', error);
      console.log('====================================');
      throw new Error("Une erreur est survenue, veuillez réessayer ultérieurement.");
    }
  }

}

