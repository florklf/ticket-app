import { MappingTypeMapping } from "@elastic/elasticsearch/lib/api/types";

export const Mapping: MappingTypeMapping = {
  properties: {
    id: { type: 'keyword' },
    name: { type: 'text' },
    description: { type: 'text' },
    image: { type: 'text' },
    eventArtists: {
      properties: {
        artist: {
          properties: {
            name: { type: 'text' },
            bio: { type: 'text' },
          },
        },
      },
    },
    eventGenres: {
      properties: {
        genre: {
          properties: {
            name: { type: 'text' },
          },
        },
      },
    },
    type: { type: 'text' },
    place: {
      properties: {
        name: { type: 'text' },
        address: { type: 'text' },
        city: { type: 'text' },
        zip: { type: 'text' },
      },
    },
    date: { type: 'date' },
  }
};
