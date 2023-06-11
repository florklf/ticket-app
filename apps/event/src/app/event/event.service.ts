import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Event, Prisma, PrismaService } from '@ticket-app/database';
import { catchError, lastValueFrom, throwError } from 'rxjs';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService, @Inject('SEARCH_CLIENT') private readonly searchClient: ClientProxy) { }

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
    const event = await this.prisma.event.create({
      data,
    });
    return lastValueFrom(await this.searchClient.send({ cmd: 'indexDocument' }, { event, type: 'create' })
      .pipe(catchError(error => throwError(() => new RpcException(error.response)))))
      .then(() => event);
  }

  async updateEvent(params: { where: Prisma.EventWhereUniqueInput; data: Prisma.EventUpdateInput }): Promise<Event> {
    const { where, data } = params;
    const event = await this.prisma.event.update({
      data,
      where,
    });
    return lastValueFrom(await this.searchClient.send({ cmd: 'indexDocument' }, { event, type: 'update' })
      .pipe(catchError(error => throwError(() => new RpcException(error.response)))))
      .then(() => event);
  }

  async deleteEvent(where: Prisma.EventWhereUniqueInput): Promise<Event> {
    const event = await this.prisma.event.delete({
      where,
    });
    return lastValueFrom(await this.searchClient.send({ cmd: 'deleteDocument' }, event.id )
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))))
    .then(() => event);
  }

  async countEvents(where: Prisma.EventWhereInput): Promise<number> {
    return this.prisma.event.count({
      where
    });
  }
}
