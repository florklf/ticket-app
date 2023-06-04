import { Controller, ValidationPipe } from '@nestjs/common';
import { Prisma, Genre } from '@ticket-app/database';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GenreService } from './genre.service';
import { CreateGenreDto, UpdateGenreDto } from '@ticket-app/common';

@ApiTags('genres')
@Controller()
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @MessagePattern({ cmd: 'findGenre' })
  async getGenre(data: Prisma.GenreWhereUniqueInput): Promise<Genre> {
    return await this.genreService.genre(data);
  }

  @MessagePattern({ cmd: 'findGenres' })
  async findAll(): Promise<Genre[]> {
    return await this.genreService.genres({});
  }

  @MessagePattern({ cmd: 'createGenre' })
  async createGenre(@Payload(new ValidationPipe()) data: CreateGenreDto): Promise<Genre> {
    return await this.genreService.createGenre(data);
  }

  @MessagePattern({ cmd: 'updateGenre' })
  async updateGenre(@Payload('where') where: Prisma.UserWhereUniqueInput, @Payload('data', new ValidationPipe()) data: UpdateGenreDto): Promise<Genre> {
    return this.genreService.updateGenre({where, data});
  }

  @MessagePattern({ cmd: 'removeGenre' })
  async removeGenre(data: Prisma.GenreWhereUniqueInput): Promise<Genre> {
    return await this.genreService.deleteGenre(data);
  }
}
