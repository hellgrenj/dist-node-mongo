FROM node:6.9.1-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source and install app dependencies
COPY . /usr/src/app/
RUN npm install

EXPOSE 3000-4000
CMD [ "npm", "start" ]
