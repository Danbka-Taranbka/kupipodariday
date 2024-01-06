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
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const { email, username } = user;
    const isEmailExist = await this.userRepository.findBy({
      email, 
    })
    const isUsernameExist = await this.userRepository.findBy({
      username
    })

    if (isEmailExist || isUsernameExist) throw new UserAlreadyExistsEception;

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new UserAlreadyExistsEception;

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundEception;

    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundEception;

    return await this.userRepository.delete(id);
  }
}
