import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { Logger, Injectable } from "@nestjs/common";
@Injectable()
export class EnvUtil {
  static getEnvPath(dest: string): string {
    const env: string | undefined = process.env.NODE_ENV;
    Logger.log(
      `for given configuration of env ${env} checking which .env to load`
    );
    const fallback: string = resolve(`${dest}/properties.env`);
    const filename: string = env
      ? `${env}/properties.env`
      : "local/properties.env";
    let filePath: string = resolve(`${dest}/${filename}`);
    if (!existsSync(filePath)) {
      filePath = fallback;
    }
    Logger.log(`loading file from path ${filePath}`);
    return filePath;
  }
}
