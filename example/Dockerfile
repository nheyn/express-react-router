FROM node:5

# Get needed libraries
RUN apt-get update
RUN apt-get install -y libelf1

# Get express-react-router (use -v tag in 'docker run' for development)
WORKDIR /var/
RUN git clone https://github.com/nheyn/express-react-router.git

WORKDIR /var/express-react-router/
RUN npm install

# Create example server
WORKDIR /var/www/

COPY .babelrc /var/www/.babelrc
COPY package.json /var/www/package.json
COPY src/ /var/www/src/
COPY public/ /var/www/public/

RUN npm install --unsafe-perm

CMD npm run start

EXPOSE 80
