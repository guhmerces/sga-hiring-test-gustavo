FROM node:20
WORKDIR /gustavo-merces-teste-sga
COPY . .
RUN yarn install
RUN yarn run build
USER node
CMD yarn setup && yarn test:e2e && yarn start
