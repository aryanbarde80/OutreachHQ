import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailLog, EmailLogSchema } from './schemas/email-log.schema';
import { EmailLogsController } from './email-logs.controller';
import { EmailLogsService } from './email-logs.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: EmailLog.name, schema: EmailLogSchema }])],
  controllers: [EmailLogsController],
  providers: [EmailLogsService],
  exports: [EmailLogsService, MongooseModule],
})
export class EmailLogsModule {}
