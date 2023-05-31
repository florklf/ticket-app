import { Injectable } from '@nestjs/common';
import { Genre, Prisma, PrismaService } from '@ticket-app/database';

@Injectable()
export class GenreService {
  constructor(private prisma: PrismaService) {}

  async genre(genreWhereUniqueInput: Prisma.GenreWhereUniqueInput): Promise<Genre | null> {
    return this.prisma.genre.findUniqueOrThrow({
      where: genreWhereUniqueInput,
    });
  }

  async genres(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Genre[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.genre.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createGenre(data: Prisma.GenreCreateInput): Promise<Genre> {
    return this.prisma.genre.create({
      data,
    });
  }

  async updateGenre(params: { where: Prisma.GenreWhereUniqueInput; data: Prisma.GenreUpdateInput }): Promise<Genre> {
    const { where, data } = params;
    return this.prisma.genre.update({
      data,
      where,
    });
  }

  async deleteGenre(where: Prisma.GenreWhereUniqueInput): Promise<Genre> {
    return this.prisma.genre.delete({
      where,
    });
  }
}
