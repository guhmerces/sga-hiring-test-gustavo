FROM node:18-alpine
WORKDIR /gustavo-merces-teste-sga
COPY . .
RUN npm run build
USER node
CMD yarn setup && yarn test:e2e && yarn start