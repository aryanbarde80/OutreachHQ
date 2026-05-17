import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateResumeDto } from './dto/create-resume.dto';
import { ResumesService } from './resumes.service';

@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.resumesService.findAll(user.id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateResumeDto,
    @UploadedFile() file: any,
  ) {
    return this.resumesService.create(user.id, dto, file);
  }
}
