import { Injectable } from '@nestjs/common';
import { EventSeatType, Prisma, PrismaService } from '@ticket-app/database';

@Injectable()
export class EventSeatTypeService {
  constructor(private prisma: PrismaService) {}

  async eventSeatType(params: {
    where?: Prisma.EventSeatTypeWhereUniqueInput;
    include?: Prisma.EventSeatTypeInclude;
  }): Promise<EventSeatType | null> {
    const { where, include } = params;
    return this.prisma.eventSeatType.findUniqueOrThrow({
      where,
      include,
    });
  }

  async eventSeatTypes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EventSeatTypeWhereUniqueInput;
    where?: Prisma.EventSeatTypeWhereInput;
    orderBy?: Prisma.EventSeatTypeOrderByWithRelationInput;
    include?: Prisma.EventSeatTypeInclude;
  }): Promise<EventSeatType[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.eventSeatType.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include
    });
  }

  async createEvent(data: Prisma.EventSeatTypeCreateInput): Promise<EventSeatType> {
    return this.prisma.eventSeatType.create({
      data,
    });
  }

  async updateEvent(params: { where: Prisma.EventSeatTypeWhereUniqueInput; data: Prisma.EventSeatTypeUpdateInput }): Promise<EventSeatType> {
    const { where, data } = params;
    return this.prisma.eventSeatType.update({
      data,
      where,
    });
  }

  async deleteEvent(where: Prisma.EventSeatTypeWhereUniqueInput): Promise<EventSeatType> {
    return this.prisma.eventSeatType.delete({
      where,
    });
  }

  async countEvents(where: Prisma.EventSeatTypeWhereInput): Promise<number> {
    return this.prisma.eventSeatType.count({
      where
    });
  }
}
