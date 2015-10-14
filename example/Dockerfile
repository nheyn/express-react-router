FROM node:4

WORKDIR /var/www/

RUN npm install -g babel # Needed, but not sure why, only npm "scripts" are called w/ babel in deps

# FOR RE-BUILD SPEED #
RUN npm install babel
RUN npm install browserify
RUN npm install react
RUN npm install react-dom
RUN npm install react-router@1.0.0-rc3
RUN npm install history
RUN npm install express
# FOR RE-BUILD SPEED #

COPY startExample /var/www/startExample
RUN chmod u+x ./startExample

COPY index.js /var/www/index.js
COPY package.json /var/www/package.json
COPY src/ /var/www/src/
COPY public /var/www/public/

CMD ./startExample

EXPOSE 80
