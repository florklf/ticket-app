import { Injectable } from '@nestjs/common';
import { User, Prisma, PrismaService } from '@ticket-app/database';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(params: {
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
  }): Promise<User | null> {
    const { where, include } = params;
    return this.prisma.user.findUniqueOrThrow({
      where,
      include,
    });
  }

  async users(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip: isNaN(skip) ? undefined : Number(skip),
      take: isNaN(take) ? undefined : Number(take),
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  async countUsers(where: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({
      where
    });
  }

  async currentUser(id: number): Promise<Omit<User, 'password'>> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        created_at: true,
        Order: true,
      },
    });
  }
}
