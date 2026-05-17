import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CampaignsService } from './campaigns.service';

@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.campaignsService.findAll(user.id);
  }

  @Get(':campaignId')
  findOne(@CurrentUser() user: { id: string }, @Param('campaignId') campaignId: string) {
    return this.campaignsService.findOne(user.id, campaignId);
  }

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(user.id, dto);
  }
}

