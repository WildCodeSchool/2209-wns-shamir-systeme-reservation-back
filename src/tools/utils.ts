import { DataSource } from "typeorm";
export const dataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "wildRent",
  password: "wildRent",
  database: "wildRent",
  synchronize: true,
  entities: [],
});