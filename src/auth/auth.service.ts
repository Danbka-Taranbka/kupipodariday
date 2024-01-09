import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User) {
    return {
      access_token: this.jwtService.sign(
        { sub: user.id },
        {
          expiresIn: '1d',
        },
      ),
    };
  }

  async validatePassword(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);

    if (user) {
      const isMatched = await bcrypt.compare(pass, user.password);
      const { password, ...result } = user;

      return isMatched ? result : null;
    }

    return null;
  }
}
