
# FROM node:12.19.0-alpine3.9 AS development

# FROM node:12-buster-slim AS development
#FROM node:10 as development
#WORKDIR C:/dev/university/ds-hw/apps/gateway/src
#
#COPY package*.json ./
#
#RUN npm install glob rimraf
#
#RUN npm install --only=development
#
#COPY . .
#
#RUN npm run build
#
#FROM node:12.19.0-alpine3.9 as production
#
#ARG NODE_ENV=production
#ENV NODE_ENV=${NODE_ENV}
#
#WORKDIR C:/dev/university/ds-hw/apps/gateway/src
#
#COPY package*.json ./
#
#RUN npm install --only=production
#
#COPY . .
#
#COPY --from=development C:/dev/university/ds-hw/apps/gateway/src/dist ./dist
#
#CMD ["node", "dist/main"]



FROM node:10 AS development
WORKDIR /
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:10-alpine
WORKDIR /
COPY --from=development /apps ./
CMD ["npm", "run", "all-services"]