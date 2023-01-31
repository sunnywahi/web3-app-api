## Stage One, Program Build
FROM node:16-alpine as builder
ARG APP_TO_BUILD=web3-app-api
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node package*.json tsconfig.json nest-cli.json tsconfig.build.json ./
COPY --chown=node:node src ./src
RUN echo ${APP_TO_BUILD}
RUN npm config set strict-ssl false \
    && npm install --force --verbose \
    && npm run build

## Stage Two, Program Execution Environment
FROM node:16-alpine
ARG APP_TO_BUILD=web3-app-api
ENV APP_NAME ${APP_TO_BUILD}
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node --from=builder /home/node/app /home/node/app
EXPOSE 9001
CMD ["sh", "-c","npm start ${APP_NAME}"]
