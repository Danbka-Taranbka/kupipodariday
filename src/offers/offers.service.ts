import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundEception } from 'src/exceptions/not-found.exception';

@Injectable()
export class OffersService {
  constructor (
    @InjectRepository(Offer) 
    private offersRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto, ownerId: number): Promise<Offer> {
    const offer = await this.offersRepository.create({
      ...createOfferDto,
      user: {id: ownerId}
    })
    return await this.offersRepository.save(offer);
  }

  async findAll(id: number): Promise<Offer[]> {
    return await this.offersRepository.find({
      relations: {
        user: true
      },
      where: {
        user: { id },
      }
    });
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offersRepository.findOneBy({ id });

    if (!offer) throw new NotFoundEception;

    return offer;
  }

  async update(id: number, updateOfferDto: UpdateOfferDto) {
    const offer = await this.offersRepository.findOneBy({ id });

    if (!offer) throw new NotFoundEception;

    return await this.offersRepository.update(id, updateOfferDto);
  }

  async remove(id: number) {
    const offer = await this.offersRepository.findOneBy({ id });

    if (!offer) throw new NotFoundEception;

    return await this.offersRepository.delete(id);
  }
}
