import { IsUrl, Length } from "class-validator";
import { Offer } from "src/offers/entities/offer.entity";
import { User } from "src/users/entities/user.entity";
import { Wishlist } from "src/wishlists/entities/wishlist.entity";
import {
  Column, 
  CreateDateColumn, 
  Entity, 
  ManyToMany, 
  ManyToOne, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

@Entity()
export class Wish {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;
  
  @Column()
  @IsUrl()
  image: string;

  @Column()
  price: number;

  @Column({default: 0})
  raised: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column({default: 0})
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (list) => list.items)
  wishlists: Wishlist[]
};
