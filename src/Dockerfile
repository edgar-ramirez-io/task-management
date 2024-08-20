# syntax=docker/dockerfile:1
FROM node:10-alpine

ENV NODE_ENV="production"
ENV APP_HOME=/home/node/app
RUN mkdir -p ${APP_HOME}
WORKDIR ${APP_HOME}

COPY . .

USER node
RUN npm install -g yarn
RUN yarn install --production --frozen-lockfile

COPY --chown=node:node . .

COPY dist/ dist/
COPY docs/ docs/

EXPOSE 8080

CMD ["dumb-init"]
