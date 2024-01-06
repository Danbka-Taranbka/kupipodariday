import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundEception extends HttpException {
  constructor() {
    super('User with this name or email already exists', HttpStatus.NOT_FOUND);
  }
}