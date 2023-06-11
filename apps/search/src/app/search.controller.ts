import { Controller, Get } from '@nestjs/common';

import { SearchService } from './search.service';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('search')
@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @MessagePattern({ cmd: 'indexDocument' })
  async indexDocument(request: any) {
    const { event, type } = request;
    return await this.searchService.indexDocument(event, type);
  }

  @MessagePattern({ cmd: 'deleteDocument' })
  async deleteDocument(id: string) {
    return await this.searchService.deleteDocument(id);
  }


  @MessagePattern({ cmd: 'search' })
  async search({query, page, size}: {query: string, page: number, size: number}) {
    return await this.searchService.search(query, page, size);
  }
}
