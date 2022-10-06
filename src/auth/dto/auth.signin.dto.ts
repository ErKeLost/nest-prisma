import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
export class AuthSigninDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string
}
