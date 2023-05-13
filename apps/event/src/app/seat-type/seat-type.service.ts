import { Injectable } from '@nestjs/common';
import { SeatType, Prisma, PrismaService } from '@ticket-app/database';

@Injectable()
export class SeatTypeService {
  constructor(private prisma: PrismaService) {}

  async seatType(seatTypeWhereUniqueInput: Prisma.SeatTypeWhereUniqueInput): Promise<SeatType | null> {
    return this.prisma.seatType.findUniqueOrThrow({
      where: seatTypeWhereUniqueInput,
    });
  }

  async seatTypes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<SeatType[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.seatType.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
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
