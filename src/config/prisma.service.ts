import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// import { writeFileSync } from 'fs';

function getExtendedClient() {
  const client = () =>
    new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });

  return class {
    // wrapper with type-safety 🎉
    constructor() {
      const prisma = client();
      // prisma.$on('query', (e) => {
      //   writeFileSync(
      //     'query.log',
      //     `${e.timestamp.toISOString()}\n${e.query}\n${e.params}\n\n`,
      //     {
      //       flag: 'a+',
      //     },
      //   );
      // });
      return prisma;
    }
  } as new () => ReturnType<typeof client>;
}

@Injectable()
export class PrismaService extends getExtendedClient() {}
