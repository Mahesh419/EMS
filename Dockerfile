FROM node:14.0.0

WORKDIR /usr/src/app

RUN npm install -g typescript

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000 5000

#Build to project
RUN npm run build

# Run node server
CMD npm start
