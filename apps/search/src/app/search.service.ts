import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Mapping } from './mapping';
import { SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';
import { PrismaService } from '@ticket-app/database';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService, private readonly prisma: PrismaService) { }

  async createIndex() {
    try {
      const index = process.env.ELASTIC_EVENT_INDEX;
      const exists = await this.elasticsearchService.indices.exists({ index });
      if (!exists) {
        await this.elasticsearchService.indices.create({
          index,
          body: {
            mappings: Mapping,
          },
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async indexDocument(document: any, type: string) {
    const event = await this.prisma.event.findUniqueOrThrow({ where: { id: document.id }, include: { eventArtists: true, eventGenres: true, place: true } });
    const artists = (await this.prisma.eventArtist.findMany({ where: { event_id: event.id }, include: { artist: true } })).map((eventArtist) => ({
      artist: {
        name: eventArtist.artist.name,
        bio: eventArtist.artist.bio,
      }
    }));
    const genres = (await this.prisma.eventGenre.findMany({ where: { event_id: event.id }, include: { genre: true } })).map((eventGenre) => ({
      genre: {
        name: eventGenre.genre.name,
      }
    }));
    const toIndex = {
      id: event.id,
      name: event.name,
      description: event.description,
      artists: artists,
      genres: genres,
      type: event.type,
      place: {
        name: event.place.name,
        address: event.place.address,
        city: event.place.city,
        zip: event.place.zip,
      },
      date: event.date,
    };
    if (type === 'create') {
      try {
        const index = process.env.ELASTIC_EVENT_INDEX;
        await this.elasticsearchService.index({
          index,
          id: document.id,
          body: toIndex,
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    else if (type === 'update') {
      try {
        const index = process.env.ELASTIC_EVENT_INDEX;
        await this.elasticsearchService.update({
          index,
          id: document.id,
          body: {
            doc: toIndex,
          },
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    return true;
  }

  async deleteDocument(id: string) {
    try {
      const index = process.env.ELASTIC_EVENT_INDEX;
      await this.elasticsearchService.delete({
        index,
        id,
      });
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async search(query: string, page: number, size: number) {
    try {
      const index = process.env.ELASTIC_EVENT_INDEX;
      const body = await this.elasticsearchService.search({
        size: size ?? 10000,
        from: page ? page * size : 0,
        index,
        body: {
          stored_fields: [],
          query: {
            multi_match: {
              query,
              fields: ['name', 'description', 'artist.name', 'artist.bio', 'genre.name', 'type', 'place.name', 'place.address', 'place.city', 'place.zip'],
              fuzziness: 'AUTO',
              prefix_length: 0,
            },
          },
        },
        sort: [
          { _score: { order: 'desc' } },
          { date: { order: 'asc' } },
        ],
      });
      return {
        total: (body.hits.total as SearchTotalHits).value,
        results: body.hits.hits.map((hit) => +hit._id),
      }
    } catch (error) {
      throw error;
    }
  }
}
