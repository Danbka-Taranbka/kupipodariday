import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}
  async create(createWishDto: CreateWishDto, ownerId: number): Promise<Wish> {
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner: {id: ownerId},
    });
    return await this.wishesRepository.save(wish);
  }

  async findAll(id: number): Promise<Wish[]> {
    return await this.wishesRepository.find({
      relations: {
        owner: true,
      },
      where: {
        owner: { id },
      }
    });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOneBy({ id });

    if (!wish) throw new NotFoundException;

    return ;wish;
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishesRepository.findOneBy({ id });

    if (!wish) throw new NotFoundException;

    return await this.wishesRepository.update(id, updateWishDto);
  }

  async remove(id: number) {
    const wish = await this.wishesRepository.findOneBy({ id });

    if (!wish) throw new NotFoundException;

    return await this.wishesRepository.delete(id);
  }
}
