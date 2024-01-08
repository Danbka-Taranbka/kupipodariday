import { IsOptional, IsUrl, Length, ValidateNested } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";

export class CreateWishlistDto {

  @Length(1, 250)
  name: string;

  @Length(0, 1500)
  @IsOptional()
  description: string;

  @IsUrl()
  image: string;

  @ValidateNested()
  items: Wish[];

  @ValidateNested()
  owner: User;
}
