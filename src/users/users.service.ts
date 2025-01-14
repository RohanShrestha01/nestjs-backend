import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingProvider } from '../auth/providers/hashing.provider';
import { PaginationQueryDto } from '../common/pagination/dtos/pagination-query.dto';
import { Paginated } from '../common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from '../common/pagination/providers/pagination.provider';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { GoogleUser } from './interfaces/google-user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly paginationProvider: PaginationProvider,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) throw new BadRequestException('User already exists');
    const user = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });
    return await this.usersRepository.save(user);
  }

  async createGoogleUser(googleUser: GoogleUser) {
    const user = this.usersRepository.create(googleUser);
    return await this.usersRepository.save(user);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<User>> {
    return await this.paginationProvider.paginateQuery(
      paginationQueryDto,
      this.usersRepository,
    );
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async findOneByGoogleId(googleId: string) {
    return await this.usersRepository.findOneBy({ googleId });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {}

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return await this.usersRepository.remove(user);
  }
}
