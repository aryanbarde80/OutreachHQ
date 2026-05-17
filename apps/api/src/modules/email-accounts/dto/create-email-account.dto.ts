import { IsBoolean, IsEmail, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateEmailAccountDto {
  @IsString()
  label!: string;

  @IsEnum(['gmail', 'outlook', 'zoho', 'custom'])
  provider!: 'gmail' | 'outlook' | 'zoho' | 'custom';

  @IsString()
  fromName!: string;

  @IsEmail()
  fromEmail!: string;

  @IsString()
  host!: string;

  @IsInt()
  @Min(1)
  port!: number;

  @IsOptional()
  @IsBoolean()
  secure?: boolean;

  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  dailyLimit?: number;
}

