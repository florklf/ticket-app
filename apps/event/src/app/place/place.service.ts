import { Injectable } from '@nestjs/common';
import { Place, Prisma, PrismaService } from '@ticket-app/database';

@Injectable()
export class PlaceService {
  constructor(private prisma: PrismaService) {}

  async place(params: {
    where?: Prisma.PlaceWhereUniqueInput;
    include?: Prisma.PlaceInclude;
  }): Promise<Place | null> {
    const { where, include } = params;

    return this.prisma.place.findUniqueOrThrow({
      where, include
    });
  }

  async places(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Place[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.place.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createPlace(data: Prisma.PlaceCreateInput): Promise<Place> {
    return this.prisma.place.create({
      data,
    });
  }

  async updatePlace(params: { where: Prisma.PlaceWhereUniqueInput; data: Prisma.PlaceUpdateInput }): Promise<Place> {
    const { where, data } = params;
    return this.prisma.place.update({
      data,
      where,
    });
  }

  async deletePlace(where: Prisma.PlaceWhereUniqueInput): Promise<Place> {
    return this.prisma.place.delete({
      where,
    });
  }
}
