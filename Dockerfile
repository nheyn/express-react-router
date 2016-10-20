FROM node:5

# Get needed libraries
RUN apt-get update
RUN apt-get install -y libelf1

# Create node user
RUN groupadd node
RUN useradd -m -g node node

# Get express-react-router
WORKDIR /home/node/express-react-router/

COPY .flowconfig ./.flowconfig
COPY flowlib/ ./flowlib/
COPY .babelrc ./.babelrc
COPY package.json ./package.json
COPY index.es6.js ./index.es6.js
COPY src/ ./src/
COPY client/ ./client/
COPY example/ ./example/

RUN chown node:node ./
RUN chown -R node:node ./*

# Install Server
USER node

WORKDIR /home/node/express-react-router/
RUN npm install

WORKDIR /home/node/express-react-router/example/
RUN npm install

# Start Server
CMD npm run start

EXPOSE 8080
