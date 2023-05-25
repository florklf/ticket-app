import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentDto implements Prisma.PaymentUpdateInput {
    @ApiProperty({ default: 'amount' })
    @IsNumber()
    @IsOptional()
    amount: number;

    @ApiProperty({ default: 'status' })
    @IsString()
    @IsOptional()
    status: string;

    @ApiProperty({
        default: {
            connect: {
                id: 1
            }
        }
    })
    @IsOptional()
    order: Prisma.OrderCreateNestedOneWithoutPaymentInput;

    @ApiProperty({ default: 'created_at' })
    @IsOptional()
    @IsDate()
    created_at?: Date;
}
