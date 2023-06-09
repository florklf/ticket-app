import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CommonModule } from '@ticket-app/common';

@Module({
  imports: [CommonModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}