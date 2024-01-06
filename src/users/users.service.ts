import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserAlreadyExistsEception } from 'src/exceptions/user-exist.exception';
import { NotFoundEception } from 'src/exceptions/not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const { email, username } = user;
    const isEmailExist = await this.usersRepository.findBy({
      email, 
    })
    const isUsernameExist = await this.usersRepository.findBy({
      username
    })

    if (isEmailExist || isUsernameExist) throw new UserAlreadyExistsEception;

    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new UserAlreadyExistsEception;

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundEception;

    return await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundEception;

    return await this.usersRepository.delete(id);
  }
}
