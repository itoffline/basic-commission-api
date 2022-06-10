import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { CreateUserDto } from './dto/createUser.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/signup')
  public async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
