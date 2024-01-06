import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsEception extends HttpException {
  constructor() {
    super('User with this name or email already exists', HttpStatus.BAD_REQUEST);
  }
}