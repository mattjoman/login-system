FROM node:latest
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
COPY ./routes /app/routes
CMD ["npm", "start"]
