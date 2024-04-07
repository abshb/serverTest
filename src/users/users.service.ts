import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'; // Your User entity
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(signupDto: SignupDto): Promise<User> {
    //deconstruct the signupDto

    // Check if username is already taken
    const existingUser = await this.usersRepository.findOneBy({
      username: signupDto.username,
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      signupDto.password.toString(), // for dev
      salt,
    );
    const email = signupDto.email;
    const user = this.usersRepository.create({
      username: signupDto.username,
      password: hashedPassword,
      email: email,
    });

    return await this.usersRepository.save(user);
  }
}
