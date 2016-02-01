FROM node:5

# Get needed libraries
RUN apt-get update
RUN apt-get install -y libelf1

# Create node user
RUN groupadd node
RUN useradd -m -g node node

# Get express-react-router
WORKDIR /home/node/
RUN git clone https://github.com/nheyn/express-react-router.git
RUN chown node:node ./express-react-router
RUN chown -R node:node ./express-react-router/*

# Get example site source
WORKDIR /home/node/express-react-router-example
RUN chown node:node .

COPY .babelrc ./.babelrc
COPY browserify.js ./browserify.js
COPY package.json ./package.json
COPY src/ ./src/
COPY public/ ./public/
RUN chown -R node:node ./*

# Start Server
USER node
RUN (cd ~/express-react-router && npm install)
RUN npm install
CMD npm run start

EXPOSE 8080
