import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { CommonModule } from '@ticket-app/common';

@Module({
    imports: [CommonModule],
    providers: [GenreService],
    controllers: [GenreController],
  })
export class GenreModule {}
