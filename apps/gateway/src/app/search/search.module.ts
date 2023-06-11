import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { SearchController } from './search.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SEARCH_CLIENT',
        options: {
          host: process.env.HOST,
          port: process.env.SEARCH_TCP_PORT,
        },
      },
    ]),
  ],
  controllers: [SearchController],
  providers: [],
})
export class SearchModule {}
