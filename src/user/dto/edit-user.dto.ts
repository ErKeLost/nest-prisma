import { IsEmail, IsOptional, IsString } from 'class-validator'

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  email?: string
  @IsString()
  @IsOptional()
  username?: string
  @IsString()
  @IsOptional()
  profileImage?: string
  @IsString()
  @IsOptional()
  name?: string
}
