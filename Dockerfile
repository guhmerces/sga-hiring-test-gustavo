FROM node:18-alpine
WORKDIR /gustavo-merces-teste-sga
COPY . .
RUN yarn build
USER node
CMD yarn setup && yarn start