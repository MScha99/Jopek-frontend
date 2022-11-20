# pull official base image
FROM node:16.18.0


WORKDIR /app


ENV PATH /app/node_modules/.bin:$PATH


COPY package.json ./
COPY package-lock.json ./
RUN npm install 
RUN npm install react-scripts@3.4.1 -g 


COPY . ./

EXPOSE 3000

CMD ["npm", "start"]