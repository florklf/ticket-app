import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ValidationPipe, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { EnumRole, Genre } from '@ticket-app/database';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateGenreDto, FindGenresDto, UpdateGenreDto } from '@ticket-app/common';
import { Role } from '../common/decorators/roles.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('genres')
@ApiTags('genres')
export class GenreController {
  constructor(@Inject('EVENT_CLIENT') private readonly client: ClientProxy) {}

  @Get('count')
  async countGenres(): Promise<Genre[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'countGenres' }, {})
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Genre> {
    return await lastValueFrom(await this.client.send({ cmd: 'findGenre' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Get()
  async findAll(@Query(ValidationPipe) query: FindGenresDto): Promise<Genre[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'findGenres' }, {
      type: query.type ?? undefined,
    })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Post()
  @ApiBody({ type: CreateGenreDto })
  async create(@Body(new ValidationPipe) createGenreDto: CreateGenreDto): Promise<Genre> {
    return await lastValueFrom(await this.client.send({ cmd: 'createGenre' }, createGenreDto)
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Patch(':id')
  @ApiBody({ type: UpdateGenreDto })
  async update(@Param('id') id: string, @Body(new ValidationPipe) updateGenreDto: UpdateGenreDto): Promise<Genre> {
    return await lastValueFrom(
      await this.client.send(
        { cmd: 'updateGenre' },
        {
          where: { id: +id },
          data: updateGenreDto,
        }
      )
      .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Genre> {
    return await lastValueFrom(await this.client.send({ cmd: 'removeGenre' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }
}
