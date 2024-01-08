import { PartialType } from '@nestjs/mapped-types';
import { CreateWishlistDto } from './create-wishlist.dto';
import { IsOptional, IsUrl, Length, ValidateNested } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  
  @Length(1, 250)
  @IsOptional()
  name: string;

  @Length(0, 1500)
  @IsOptional()
  description: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @ValidateNested()
  @IsOptional()
  items: Wish[];
}
