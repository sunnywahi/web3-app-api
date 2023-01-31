import * as process from "process";

export default () => ({
  port: parseInt(process.env.PORT as string, 10),
  logLevels: process.env.LOG_LEVELS
    ? process.env.LOG_LEVELS.split(",")
    : ["error", "warn", "log", "debug"],
  graph: {
    url: process.env.SUBGRAPH_URL
  }
})
