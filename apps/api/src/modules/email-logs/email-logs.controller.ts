import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { EmailLogsService } from './email-logs.service';

@UseGuards(JwtAuthGuard)
@Controller('email-logs')
export class EmailLogsController {
  constructor(private readonly emailLogsService: EmailLogsService) {}

  @Get()
  findAll(@CurrentUser() user: { id: string }, @Query('campaignId') campaignId?: string) {
    if (campaignId) {
      return this.emailLogsService.findForCampaign(user.id, campaignId);
    }
    return this.emailLogsService.findAll(user.id);
  }
}

