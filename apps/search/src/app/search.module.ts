import { Module, OnModuleInit } from '@nestjs/common';

import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { CommonModule } from '@ticket-app/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    CommonModule,
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: process.env.ELASTICSEARCH_NODE,
        auth: {
          username: process.env.ELASTIC_USERNAME,
          password: process.env.ELASTIC_PASSWORD,
        },
        maxRetries: 10,
        requestTimeout: 60000,
        // sniffOnStart: true
      }),
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule implements OnModuleInit {
  constructor(private readonly searchService: SearchService) { }

  async onModuleInit() {
    try {
      await this.searchService.createIndex();
      await this.searchService.indexAll();
    } catch (error) {
      console.error(error);
    }
  }
}
