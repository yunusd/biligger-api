FROM node:lts-alpine

ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN if [ "$NODE_ENV" = "development" ]; \
	then npm install;  \
	else npm install --only=production; \
	fi

# Bundle app source
COPY . .