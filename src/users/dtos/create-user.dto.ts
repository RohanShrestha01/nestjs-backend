import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Please provide a name' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Please provide a valid email' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email: string;

  @ApiProperty()
  @IsStrongPassword(
    {},
    {
      message:
        'Password must be strong (8 characters minimum, 1 uppercase, 1 lowercase, 1 number, 1 special character)',
    },
  )
  @MaxLength(100, { message: 'Password must not exceed 100 characters' })
  password: string;
}
