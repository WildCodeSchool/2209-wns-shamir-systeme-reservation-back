import { Repository } from "typeorm";
import User from "../models/User";
import { dataSource } from "../tools/utils";
import * as argon2 from "argon2";

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
};
