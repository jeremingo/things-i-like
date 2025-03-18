FROM node:22

COPY ./package*.json ./

COPY ./apps/backend ./apps/backend

COPY ./libs ./libs

RUN npm install -g npm@10.5.1

RUN npm install

RUN npm run build --workspace=backend

EXPOSE 3000

CMD ["npm", "run", "start:backend"]
