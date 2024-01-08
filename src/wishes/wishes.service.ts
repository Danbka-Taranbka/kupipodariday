import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { DataSource, Repository } from 'typeorm';
import { WishAlreadyExistsEception } from 'src/exceptions/wish-exist.exception';

@Injectable()
export class WishesService {
  constructor(
    private readonly dataSource: DataSource,
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

  async findAll(): Promise<Wish[]> {
    return await this.wishesRepository.find({});
  }

  // Get 40 last wishes
  async getLastWishes(): Promise<Wish[]> {
    const result = await this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });

    return result;
  }

  // Get 20 top wishes
  async getTopWishes(): Promise<Wish[]> {
    const result = await this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 20,
    });

    return result;
  }

  // Get a wish by id
  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOneBy({ id });

    if (!wish) throw new NotFoundException;

    return wish;
  }

  // Edit a wish
  async update(id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishesRepository.findOneBy({ id });

    if (!wish) throw new NotFoundException;

    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const newWish = { 
      ...updateWishDto
    };

    try {
      await this.wishesRepository.update(id, newWish);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return await this.wishesRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const wish = await this.wishesRepository.findOneBy({ id });

    if (!wish) throw new NotFoundException;

    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.wishesRepository.delete(id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  
  async copyWish(userId: number, wishId: number) {
    const wish = await this.wishesRepository.findOne({ 
      where: { id: wishId },
      relations: {
        owner: {
          wishes: true,
        }
      } 
    });

    const wishExists = await this.wishesRepository.find({
      where: {
        owner: {
          id: userId,
          wishes: {
            name: wish.name,
          }
        },
        
      },
    });

    if (wishExists) throw new WishAlreadyExistsEception;

    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    wish.copied++;

    const { name, link, image, price, description } = wish;

    const newWish = { 
      name, 
      link, 
      image, 
      price, 
      description, 
      owner: {id: userId} 
    };

    try {
      await this.wishesRepository.save(wish);
      await this.wishesRepository.create(newWish);
      await this.wishesRepository.save(newWish);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
