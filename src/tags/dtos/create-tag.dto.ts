import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(256)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  imageUrl?: string;
}
