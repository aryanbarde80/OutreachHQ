import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsService } from './leads.service';

@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  findAll(@CurrentUser() user: { id: string }, @Query() query: Record<string, string>) {
    return this.leadsService.findAll(user.id, query);
  }

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateLeadDto) {
    return this.leadsService.create(user.id, dto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@CurrentUser() user: { id: string }, @UploadedFile() file: any) {
    return this.leadsService.importCsv(user.id, file);
  }

  @Patch()
  update(
    @CurrentUser() user: { id: string },
    @Query('leadId') leadId: string,
    @Body() dto: UpdateLeadDto,
  ) {
    return this.leadsService.update(user.id, leadId, dto);
  }
}
