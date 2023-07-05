// prisma/seed.ts
import { PrismaClient, Prisma, EnumEventType, Place, EnumRole } from '@prisma/client';
import { fakerFR as faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const concertCategories = [
  'POP',
  'ROCK',
  'RAP',
  'JAZZ',
  'CLASSIQUE',
  'ELECTRO',
  'METAL',
  'REGGAE',
  'BLUES'
];

const spectacleCategories = [
  'THEATRE',
  'CIRQUE',
  'OPERA',
  'DANSE',
  'HUMOUR',
  'BALLET',
];

const festivalCategories = [
  'MUSIQUE',
  'CINEMA',
  'LIVRE',
  'ARTS',
  'GASTRONOMIE',
  'ENFANTS'
];

const conferenceCategories = [
  'TECHNOLOGIE',
  'SCIENCE',
  'ECONOMIE',
  'POLITIQUE',
  'SANTE',
  'ENVIRONNEMENT'
];

function getRandomProperty(obj: any) {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

async function getRandomRow(model: string, where: any = null) {
  //@ts-ignore
  const count = await prisma[model].count()
  const randomNumber = Math.floor(Math.random() * count)
  //@ts-ignore
  const randomUser = await prisma[model].findMany({
    skip: randomNumber,
    take: 1,
  })
  return randomUser[0]
}

const fakerUser = (scopeRole: EnumRole | null = null): any => {
  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  const email = faker.internet.email({ firstName: firstname, lastName: lastname });
  const password = bcrypt.hashSync('admin', 10);
  const role = scopeRole ?? getRandomProperty(EnumRole) as EnumRole;
  const created_at = faker.date.recent({days: 45});
  return { firstname, lastname, email, password, role, created_at };
};

const fakerPlace = (): any => {
  const name = faker.location.street()
  const description = faker.lorem.paragraph();
  const address = faker.location.streetAddress();
  const lat = faker.location.latitude();
  const lng = faker.location.longitude();
  const city = faker.location.city();
  const zip = faker.location.zipCode();
  return { name, description, address, city, zip, lat, lng };
}

const fakerEvent = async (location_id: number, type_id: number): Promise<Prisma.EventCreateInput> => {
  const name = faker.person.fullName();
  const description = faker.lorem.paragraph();
  const date = faker.date.future();
  const type = {
    connect: {
      id: type_id,
    }
  }
  const place = {
    connect: {
      id: location_id,
    },
  };
  const image = faker.image.url();
  const event = { name, description, date, place, image, type };
  return event;
}

const fakerSeatType = (placeParam: Place, seatTypeName: string): any => {
  const name = seatTypeName;
  const description = faker.lorem.sentence();
  const capacity = faker.number.int({ min: 50, max: 1000 })
  const place = {
    connect: {
      id: placeParam.id,
    },
  };
  return { name, description, capacity, place };
}

async function main() {
  dotenv.config();
  console.log('Seeding...');

  /// --------- Admin ---------------
  const firstname = 'admin'
  const lastname = 'doe'
  const email = 'admin@test.com'
  const password = bcrypt.hashSync('password', 10);
  const role = EnumRole.ADMIN
  await prisma.user.create({ data: { firstname, lastname, email, password, role } });
  /// --------- Users ---------------
  for (let i = 0; i < 20; i++) {
    await prisma.user.create({ data: fakerUser('USER') });
  }

  /// --------- Types ---------------
  for (const value in EnumEventType) {
    const type = await prisma.type.create({
      data: {
        name: value as EnumEventType,
      },
    });

    /// --------- Categories ---------------
      const lowerName = type.name.toLowerCase();
      for (const category of eval(`${lowerName}Categories`)) {
        const genre = await prisma.genre.create({
          data: {
            name: category,
            type_id: type.id,
            },
          },
        );
        /// --------- Artists ---------------
        if (type.name === EnumEventType.CONCERT) {
          for (let i = 0; i < 5; i++) {
            await prisma.artist.create({
              data: {
                name: faker.person.fullName(),
                genre_id: genre.id,
              },
            });
          }
        }
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
    const type = await prisma.type.findMany({
      take: 1,
      skip: Math.floor(Math.random() * 4),
    });
    const event = await prisma.event.create({ data: await fakerEvent(location[0].id, type[0].id) });
    /// --------- SeatTypeForEvent ---------------
    location[0].seatTypes.forEach(async seatType => {
      await prisma.eventSeatType.create({
        data: {
          price: +faker.commerce.price({ min: 20, max: 200 }),
          available_seats: seatType.capacity,
          event_id: event.id,
          seat_type_id: seatType.id,
        }
      });
    });
    /// --------- ArtistsForEvent ---------------
    for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
      const artist = await prisma.artist.findMany({
        take: 1,
        skip: Math.floor(Math.random() * 10),
      });
      await prisma.eventArtist.create({
        data: {
          event_id: event.id,
          artist_id: artist[0].id,
        }
      });
    }
    /// --------- GenresForEvent ---------------
    const genres = await prisma.genre.findMany({
      take: Math.floor(Math.random() * 3),
      skip: Math.floor(Math.random() * 6),
      where: {
        type_id: event.type_id,
      }
    });
    for (const genre of genres) {
      await prisma.eventGenre.create({
        data: {
          event_id: event.id,
          genre_id: genre.id,
        }
      });
    }

    /// --------- Orders ---------------
    const user = await getRandomRow('user', { role: 'USER' });
    const created_at = faker.date.recent({days: 45});
    const order = await prisma.order.create({
      data: {
        user_id: user.id,
        snipcart_id: faker.string.uuid(),
        billing_address: faker.location.streetAddress(),
        billing_city: faker.location.city(),
        billing_zip: faker.location.zipCode(),
        billing_country: faker.location.countryCode(),
        shipping_address: faker.location.streetAddress(),
        shipping_city: faker.location.city(),
        shipping_zip: faker.location.zipCode(),
        shipping_country: faker.location.country(),
        created_at: created_at
      },
    });
    /// --------- OrderItems ---------------
    const orderItems = [];
    for (let j = 0; j < faker.number.int({ min: 1, max: 3 }); j++) {
    const eventSeatType = await getRandomRow('EventSeatType');
      const orderItem = await prisma.orderItem.create({
        data: {
          order_id: order.id,
          seat_type_id: eventSeatType.id,
          quantity: faker.number.int({ min: 1, max: 3 }),
        },
        select: {
          id: true,
          quantity: true,
          seatType: true,
        }
      });
      const qrCode = await prisma.qRCode.create({
        data: {
          order_item_id: orderItem.id,
          qr_code: faker.string.alphanumeric(20),
          qr_code_decoded: faker.string.alphanumeric(20),
        },
      });
      orderItems.push(orderItem);
    }
    /// --------- Payments ---------------
    const payment = await prisma.payment.create({
      data: {
        order_id: order.id,
        amount: orderItems.reduce((total, curr) => total + curr.quantity * curr.seatType.price, 0),
        status: 'Processed',
        payment_method: 'CreditCard',
        card_type: 'Visa',
        card_last4: +faker.string.numeric(4),
        created_at: created_at
      },
    });
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
