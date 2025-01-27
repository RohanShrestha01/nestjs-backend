import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEventMetadataDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: any;
}
