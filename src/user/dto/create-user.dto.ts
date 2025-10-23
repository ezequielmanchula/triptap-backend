import { IsEmail, IsString, IsInt, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  phone: number;

  @IsString()
  @MinLength(8)
  password: string;
}
