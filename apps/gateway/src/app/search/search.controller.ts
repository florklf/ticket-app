import { Body, Controller, Inject, Post, Get, UseGuards, Param } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('search')
@ApiTags('search')
export class SearchController {
  constructor(@Inject('SEARCH_CLIENT') private readonly client: ClientProxy) { }

  @Post()
  async search(@Body('query') query: string, @Body('page') page: number, @Body('size') size: number) {
    return await lastValueFrom(await this.client.send({ cmd: 'search' }, { query, page, size })
      .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }
}
