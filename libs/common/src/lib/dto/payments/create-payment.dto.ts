import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString, IsInt } from 'class-validator';

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

    @ApiProperty({ default: 'payment_method' })
    @IsString()
    payment_method: string;

    @ApiProperty({ default: 'card_type' })
    @IsString()
    card_type: string;

    @ApiProperty({ default: 'card_last4' })
    @IsInt()
    card_last4: number;

    @ApiProperty({ default: 'created_at' })
    @IsOptional()
    @IsDate()
    created_at?: Date;
}
