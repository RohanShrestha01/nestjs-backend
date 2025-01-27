import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { EventType } from '../enums/event-type.enum';
import { CreateEventMetadataDto } from './create-event-metadata.dto';

export class CreateEventDto {
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  description: string;

  @IsISO8601()
  @IsNotEmpty()
  startDateTime: Date;

  @IsISO8601()
  @IsNotEmpty()
  endDateTime: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  location: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  ticketPrice: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  totalTickets: number;

  @IsEnum(EventType)
  @IsOptional()
  eventType: EventType = EventType.OFFLINE;

  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventMetadataDto)
  metadata?: CreateEventMetadataDto[];
}
