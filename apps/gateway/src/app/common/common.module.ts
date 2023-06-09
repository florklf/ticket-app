import { Module } from '@nestjs/common';
import { CommonModule } from '@ticket-app/common';

@Module({
    imports: [CommonModule],
    controllers: [],
    providers: [],
  })
  export class CommonAppModule {}