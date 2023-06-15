import { Injectable } from '@nestjs/common';
import { SeatType, Prisma, PrismaService } from '@ticket-app/database';

@Injectable()
export class SeatTypeService {
  constructor(private prisma: PrismaService) {}

  async seatType(params: {
    where?: Prisma.SeatTypeWhereUniqueInput;
    include?: Prisma.SeatTypeInclude;
  }): Promise<SeatType | null> {
    const { where, include } = params;
    return this.prisma.seatType.findUniqueOrThrow({
      where,
      include,
    });
  }

  async seatTypes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    include?: Prisma.SeatTypeInclude;
  }): Promise<SeatType[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.seatType.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async createSeatType(data: Prisma.SeatTypeCreateInput): Promise<SeatType> {
    return this.prisma.seatType.create({
      data,
    });
  }

  async updateSeatType(params: { where: Prisma.SeatTypeWhereUniqueInput; data: Prisma.SeatTypeUpdateInput }): Promise<SeatType> {
    const { where, data } = params;
    return this.prisma.seatType.update({
      data,
      where,
    });
  }

  async deleteSeatType(where: Prisma.SeatTypeWhereUniqueInput): Promise<SeatType> {
    return this.prisma.seatType.delete({
      where,
    });
  }
}
