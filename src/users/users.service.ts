import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDto from 'src/dto/createUser.dto';
import { Repository } from 'typeorm';

import { User } from '../entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(user: User): Promise<CreateUserDto> {
    const createdUser = await this.userRepository.save(user);
    return createdUser;
  }
}
