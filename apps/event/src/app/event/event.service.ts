import { Injectable } from '@nestjs/common';
import { Event, Prisma, PrismaService } from '@ticket-app/database';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async event(params: {
    where?: Prisma.EventWhereUniqueInput;
    include?: Prisma.EventInclude;
  }): Promise<Event | null> {
    const { where, include } = params;
    return this.prisma.event.findUniqueOrThrow({
      where,
      include,
    });
  }

  async events(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EventWhereUniqueInput;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput;
    include?: Prisma.EventInclude;
  }): Promise<Event[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.event.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include
    });
  }

  async createEvent(data: Prisma.EventCreateInput): Promise<Event> {
    return this.prisma.event.create({
      data,
    });
  }

  async updateEvent(params: { where: Prisma.EventWhereUniqueInput; data: Prisma.EventUpdateInput }): Promise<Event> {
    const { where, data } = params;
    return this.prisma.event.update({
      data,
      where,
    });
  }

  async deleteEvent(where: Prisma.EventWhereUniqueInput): Promise<Event> {
    return this.prisma.event.delete({
      where,
    });
  }

  async countEvents(where: Prisma.EventWhereInput): Promise<number> {
    return this.prisma.event.count({
      where
    });
  }
}
