import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import CreateUserDto from '../dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('SECRET_JWT_KEY'),
        expiresIn: '1h',
      }),
    };
  }

  async signUp(user: CreateUserDto) {
    // check user doesn't already exist
    const existingUser = await this.usersService.findOne(user.username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const createdUser = await this.usersService.create(user);
    const payload = { username: createdUser.username, sub: createdUser.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('SECRET_JWT_KEY'),
        expiresIn: '1h',
      }),
    };
  }
}
