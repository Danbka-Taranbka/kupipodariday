import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor (
    private readonly dataSource: DataSource,
    @InjectRepository(Offer) 
    private offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<any> {
    const { amount, hidden, itemId } = createOfferDto;

    const wish = await this.wishesRepository.findOne({
      where: {
        id: itemId,
      },
      relations: {
        owner: true,
      },
      select: {
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        }
      }
    });

    if (!wish) throw new NotFoundException('There is no wish with such id!');
    if (wish.owner.id === user.id) throw new ForbiddenException('You are not allowed to fund your own wish!');
    
    const { raised, price } = wish;

    if (raised >= price) throw new ForbiddenException('Other users have already raised enough money!');

    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    wish.raised+=amount;

    if (wish.raised > wish.price) throw new ForbiddenException(`Only ${-(wish.price - amount)} left to raise!`);

    try {
      await this.wishesRepository.save(wish);

      const newOffer = await this.offersRepository.save({
        amount,
        hidden,
        item: wish,
        user: user
      });

      await queryRunner.commitTransaction();
      console.log(newOffer);
      return newOffer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err.detail;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Offer[]> {
    return await this.offersRepository.find();
  }

  async findOne(id: number): Promise<Offer | object> {
    const offer = await this.offersRepository.findOneBy({ id });

    if (!offer) throw new NotFoundException('There is no offer with such id!');
    if (offer.hidden) return new Object();

    return offer;
  }
}
