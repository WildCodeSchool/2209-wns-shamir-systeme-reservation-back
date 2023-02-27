import { DataSource } from "typeorm";
import Category from "../models/Category";
import Order from "../models/Order";
import Product from "../models/Product";
import Reservation from "../models/Reservation";
import Role from "../models/Role";
import User from "../models/User";

export const dataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "wildRent",
  password: "wildRent",
  database: "wildRent",
  synchronize: true,
  entities: [Category, Order, Product, Reservation, Role, User],
  logging: ["query", "error"],
});