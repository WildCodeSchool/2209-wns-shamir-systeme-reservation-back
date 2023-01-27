import { Repository } from "typeorm";
import User from "../models/User";
import { dataSource } from "../tools/utils";
import * as argon2 from "argon2";
import authService from "../services/authService";
import { JwtPayload } from "jsonwebtoken";

const repository: Repository<User> = dataSource.getRepository(User);

const getByEmail = async (email: string): Promise<User | null> => {
  return await repository.findOne({
    relations: { roles: true, orders: true },
    where: { email: email },
  });
};

const getAll = async (): Promise<User[]> => {
  return await repository.find({
    relations: { roles: true, orders: true },
    order: {
      id: "DESC",
    },
  });
};

const isAdmin = async (token: string): Promise<Boolean> => {
  const payload = JSON.parse(JSON.stringify(authService.verifyToken(token)));
  const roles = payload.role;
  const isAdmin = roles.find((role: {id: string, name: string}) => role.name === "ADMIN")
  return (isAdmin !== undefined);
};

const create = async (
  firstname: string,
  lastname: string,
  phone: string,
  email: string,
  password: string
): Promise<User> => {
  const newUser = new User();
  newUser.email = email;
  newUser.firstname = firstname;
  newUser.lastname = lastname;
  newUser.phone = phone;
  newUser.password = await argon2.hash(password);
  newUser.roles = [{ id: 2, name: "CUSTOMER" }];
  return await repository.save(newUser);
};

export default {
  getByEmail,
  create,
  getAll,
  isAdmin,
};
