import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto implements Prisma.PaymentCreateInput {
    @ApiProperty({ default: 'amount' })
    @IsNumber()
    amount: number;

    @ApiProperty({ default: 'status' })
    @IsString()
    status: string;

    @ApiProperty({
        default: {
            connect: {
                id: 1
            }
        }
    })
    order: Prisma.OrderCreateNestedOneWithoutPaymentInput;

    @ApiProperty({ default: 'created_at' })
    @IsOptional()
    @IsDate()
    created_at?: Date;
}
