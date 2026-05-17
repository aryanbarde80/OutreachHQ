import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CampaignsService } from '../campaigns/campaigns.service';
import { EmailAccountsService } from '../email-accounts/email-accounts.service';
import { EmailLogsService } from '../email-logs/email-logs.service';
import { LeadsService } from '../leads/leads.service';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly emailAccountsService: EmailAccountsService,
    private readonly emailLogsService: EmailLogsService,
    private readonly leadsService: LeadsService,
  ) {}

  @Get('summary')
  async summary(@CurrentUser() user: { id: string }) {
    const [campaigns, emailAccounts, logs, leads] = await Promise.all([
      this.campaignsService.findAll(user.id),
      this.emailAccountsService.findAll(user.id),
      this.emailLogsService.aggregateCounts(user.id),
      this.leadsService.findAll(user.id, {}),
    ]);

    return {
      campaigns: campaigns.slice(0, 5),
      metrics: {
        totalCampaigns: campaigns.length,
        totalLeads: leads.length,
        activeAccounts: emailAccounts.filter((account) => account.active).length,
        sent: logs.find((item) => item._id === 'SENT')?.count ?? 0,
        failed: logs.find((item) => item._id === 'FAILED')?.count ?? 0,
        pending: logs.find((item) => item._id === 'PENDING')?.count ?? 0,
      },
    };
  }
}

