import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Body } from '@nestjs/common';
@Controller('users')
export class UsersController {
  constructor(private userServices: UsersService) {}

  @Public()
  @Post('signup')
  async createUser(@Body() signupDto: SignupDto) {
    return await this.userServices.createUser(signupDto);
  }
}
