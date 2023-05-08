import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
  imports: [ClientsModule.register([{
    name: 'USER_CLIENT',
    options: {
      host: 'localhost',
      port: process.env.USER_TCP_PORT,
    }
  }]), JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '60s' }
  })],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}