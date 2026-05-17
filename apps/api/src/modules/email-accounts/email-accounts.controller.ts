import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateEmailAccountDto } from './dto/create-email-account.dto';
import { UpdateEmailAccountDto } from './dto/update-email-account.dto';
import { EmailAccountsService } from './email-accounts.service';

@UseGuards(JwtAuthGuard)
@Controller('email-accounts')
export class EmailAccountsController {
  constructor(private readonly emailAccountsService: EmailAccountsService) {}

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.emailAccountsService.findAll(user.id);
  }

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateEmailAccountDto) {
    return this.emailAccountsService.create(user.id, dto);
  }

  @Patch(':accountId')
  update(
    @CurrentUser() user: { id: string },
    @Param('accountId') accountId: string,
    @Body() dto: UpdateEmailAccountDto,
  ) {
    return this.emailAccountsService.update(user.id, accountId, dto);
  }
}

