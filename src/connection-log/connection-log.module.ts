import { Module } from '@nestjs/common';
import { ConnectionLogService } from './connection-log.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { ConnectionLogController } from './connection-log.controller';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [ConnectionLogService],
  exports: [ConnectionLogService],
  controllers: [ConnectionLogController],
})
export class ConnectionLogModule {}
