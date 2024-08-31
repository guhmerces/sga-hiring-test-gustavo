FROM node:20
WORKDIR /gustavo-merces-teste-sga
COPY . .
RUN npm install
RUN npm run build
USER node
CMD yarn setup && yarn test:e2e && yarn start
