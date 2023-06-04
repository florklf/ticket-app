import { Module } from '@nestjs/common';
import { DatabaseModule } from '@ticket-app/database';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';

@Module({
    imports: [DatabaseModule],
    providers: [GenreService],
    controllers: [GenreController],
  })
export class GenreModule {}
