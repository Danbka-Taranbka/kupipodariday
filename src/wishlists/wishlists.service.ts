import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, ownerId: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: {id: ownerId},
    })
    return await this.wishlistsRepository.save(wishlist);
  }

  async findAll(id: number): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find({
      relations: {
        owner: true,
      },
      where: {
        owner: { id }
      }
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOneBy({ id });

    if (!wishlist) throw new NotFoundException;

    return wishlist; 
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.wishlistsRepository.findOneBy({ id });

    if (!wishlist) throw new NotFoundException;

    return await this.wishlistsRepository.update(id, updateWishlistDto);
  }

  async remove(id: number) {
    const wishlist = await this.wishlistsRepository.findOneBy({ id });

    if (!wishlist) throw new NotFoundException;

    return await this.wishlistsRepository.delete(id);
  }
}
