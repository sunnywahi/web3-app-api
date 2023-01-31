import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import configuration from './config/configuration';
import {sep} from 'path';
import {EnvUtil} from './util/env.util';
import {Web3AppController} from "./controller/web3-app.controller";
import {Web3AppService} from "./service/web3-app.service";
import {GraphService} from "./service/graph.service";

const envResourceFile: string = EnvUtil.getEnvPath(
    `${__dirname}${sep}resources`,
);
console.log(envResourceFile);
@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: [envResourceFile],
    isGlobal: true,
    load: [configuration],
  })],
  controllers: [Web3AppController],
  providers: [Web3AppService, GraphService],
})
export class Web3AppModule { }
