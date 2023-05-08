import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '@ticket-app/database';

@Module({
  imports: [DatabaseModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}