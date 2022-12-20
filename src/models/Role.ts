import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export default class Role {
  
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar"})
  name: string

}

