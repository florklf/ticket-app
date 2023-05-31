// prisma/seed.ts
import { PrismaClient, Prisma, EnumEventType, Place, EnumGenre } from '@prisma/client';
import { fakerFR as faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

const prisma  = new PrismaClient();


function getRandomProperty(obj: any) {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

const fakerUser = (): any => {
    const firstname = faker.person.firstName();
    const lastname = faker.person.lastName();
    const email = faker.internet.email({firstName: firstname, lastName: lastname});
    const password = bcrypt.hashSync('password', 10);
    return { firstname, lastname, email, password };
};

const fakerPlace = (): any => {
  const name = faker.location.street()
  const description = faker.lorem.paragraph();
  const address = faker.location.streetAddress();
  const city = faker.location.city();
  const zip = faker.location.zipCode();
  const capacity = faker.number.int({min: 1000, max: 5000})
  return { name, description, address, city, zip, capacity };
}

const fakerEvent = async (location_id: number): Promise<Prisma.EventCreateInput> => {
  const name = faker.person.fullName();
  const description = faker.lorem.paragraph();
  const date = faker.date.future();
  const type: EnumEventType = getRandomProperty(EnumEventType) as EnumEventType;
  const place = {
    connect: {
      id: location_id,
    },
  };
  const image = faker.image.url();
  const event = { name, description, date, place, type, image };
  if (type === EnumEventType.CONCERT) {
    const genresCount = await prisma.genre.count();
    const artistsCount = await prisma.genre.count();
    return { ...event,
      genre: {
        connect: {
          id: Math.floor(Math.random() * genresCount) + 1,
        }
      },
      artist: {
        connect: {
          id: Math.floor(Math.random() * artistsCount) + 1,
        }
      }
    }
  }
  return event;
}

const fakerSeatType = (placeParam: Place, seatTypeName: string): any => {
  const name = seatTypeName;
  const description = faker.lorem.sentence();
  const capacity = Math.floor(placeParam.capacity / 3);
  const place = {
    connect: {
      id: placeParam.id,
    },
  };
  return { name, description, capacity, place};
}

async function main() {
  const fakerRounds = 10;
  dotenv.config();
  console.log('Seeding...');

  /// --------- Users ---------------
  for (let i = 0; i < fakerRounds; i++) {
    await prisma.user.create({ data: fakerUser() });
  }

  /// --------- Genres ---------------
  for (const value in EnumGenre) {
    const genre = await prisma.genre.create({
      data: {
        name: value as EnumGenre,
      },
    });
    /// --------- Artists ---------------
    for (let i = 0; i < 10; i++) {
      await prisma.artist.create({
        data: {
          name: faker.person.fullName(),
          genre_id: genre.id,
        },
      });
    }
  }

  /// --------- Places ---------------
  for (let i = 0; i < 5; i++) {
    const place = await prisma.place.create({ data: fakerPlace() });

    /// --------- Seat types ---------------
  const seatTypeNames = ['VIP', 'CAT1', 'CAT2', 'CAT3', 'CAT4', 'CAT5', 'CAT6', 'CAT7', 'CAT8', 'CAT9', 'CAT10']
    for (let i = 0; i < 3; i++) {
      const name = seatTypeNames[Math.floor(Math.random() * seatTypeNames.length)];
      seatTypeNames.splice(seatTypeNames.indexOf(name), 1);
      await prisma.seatType.create({ data: fakerSeatType(place, name) });
    }
  }

  /// --------- Events ---------------
  for (let i = 0; i < 50; i++) {
    const location = await prisma.place.findMany({
      take: 1,
      skip: Math.floor(Math.random() * 5),
      include: {
        seatTypes: true,
      },
    });
    const event = await prisma.event.create({ data: await fakerEvent(location[0].id) });
  /// --------- SeatTypeForEvent ---------------
    for (let i = 0; i < 3; i++) {
      const seatType = location[0].seatTypes[Math.floor(Math.random() * location[0].seatTypes.length)];
      await prisma.eventSeatType.create({
        data: {
          price: +faker.commerce.price({min: 20, max: 200}),
          available_seats: seatType.capacity,
          event_id: event.id,
          seat_type_id: seatType.id,
        }
      });
    }
  }
};

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })