import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  segment?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}

