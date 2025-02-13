FROM node:22

COPY ./package*.json ./

COPY ./apps/frontend ./apps/frontend

COPY ./libs ./libs

RUN npm install -g npm@10.5.1

RUN npm install -g serve

RUN npm install

RUN npm run build --workspace=frontend

EXPOSE 3000

CMD ["npm", "run", "start:frontend"]
