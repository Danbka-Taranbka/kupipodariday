import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password } = createUserDto;
    const isEmailExist = await this.usersRepository.findBy({
      email, 
    })
    const isUsernameExist = await this.usersRepository.findBy({
      username
    })

    if (isEmailExist || isUsernameExist) throw new UserAlreadyExistsEception;

    const hash = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hash,
    });

    await this.usersRepository.insert(user);

    return user;
  };

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  };

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundEception;

    return user;
  };

  async findMany(query: any): Promise<User[] | undefined> {
    const result = await this.usersRepository.find({

      where: [
        { username: query },
        { email: query }
      ],
    });
    return result;
  };

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });

    if (!user) throw new NotFoundEception;

    return user;
  };

  async findByEmail(email: string) {
    const user = await this.usersRepository.findBy({ email });

    if (!user) throw new NotFoundEception;

    return user;
  };

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundEception;

    return await this.usersRepository.update(id, updateUserDto);
  };

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundEception;

    return await this.usersRepository.delete(id);
  };
}
