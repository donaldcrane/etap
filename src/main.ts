import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientKnownRequestErrorFilter } from './filters/prismaError.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  // enable global prisma error filter
  app.useGlobalFilters(new PrismaClientKnownRequestErrorFilter());
  await app.listen(process.env.PORT);
  // await app.listen(3000);
}
bootstrap();
