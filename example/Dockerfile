FROM node:5

WORKDIR /var/
RUN git clone https://github.com/nheyn/express-react-router.git

WORKDIR /var/express-react-router/
RUN npm install

WORKDIR /var/www/

COPY .babelrc /var/www/.babelrc
COPY package.json /var/www/package.json
COPY src/ /var/www/src/
COPY public/ /var/www/public/

RUN npm install

CMD npm run start

EXPOSE 80
