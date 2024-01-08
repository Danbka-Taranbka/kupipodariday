import { IsBoolean, IsNumber, Min, ValidateNested } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";

export class CreateOfferDto {
  
  @IsNumber()
  @Min(1)
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @ValidateNested()
  user: User;

  @ValidateNested()
  item: Wish;
}
