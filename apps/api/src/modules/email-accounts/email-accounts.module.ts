import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailAccount, EmailAccountSchema } from './schemas/email-account.schema';
import { EmailAccountsController } from './email-accounts.controller';
import { EmailAccountsService } from './email-accounts.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: EmailAccount.name, schema: EmailAccountSchema }])],
  controllers: [EmailAccountsController],
  providers: [EmailAccountsService],
  exports: [EmailAccountsService, MongooseModule],
})
export class EmailAccountsModule {}
