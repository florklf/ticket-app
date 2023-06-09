import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '@ticket-app/database';

@Module({
  imports: [DatabaseModule, JwtModule.register({
      secret: process.env['JWT_SECRET'],
      signOptions: { expiresIn: '7 days' }
    }),
  ],
  controllers: [],
  providers: [],
  exports: [DatabaseModule, JwtModule],
})
export class CommonModule {}
