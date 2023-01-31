import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import helmet from "helmet";
import {GlobalExceptionFilter} from "./common/exception.filter.js";
import {LoggingInterceptor} from "./common/interceptor/logging.interceptor.js";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {Web3AppModule} from "./web3-app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(Web3AppModule);
  const hstsOptions = {
    maxAge: 63072000,
    includeSubDomains: true
  }
  app.use(helmet({hsts: hstsOptions}));
  const configService = app.get(ConfigService);
  app.useLogger(configService.get(`logLevels`));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
      .setTitle("Web3 APP API")
      .setDescription("Services API")
      .setVersion("1.0")
      .addTag("API")
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("web3-app-api", app, document);

  const port = configService.get(`port`);
  Logger.log(`starting image worker service on port ${port}`);
  await app.listen(port);
}

bootstrap()
    .then(() => {
      Logger.log(`Web3 app application started`);
    })
    .catch((error) => {
      Logger.log(`${error}`);
      process.exit(-1);
    });
