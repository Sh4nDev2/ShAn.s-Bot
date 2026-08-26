FROM node:16
COPY . .
RUN npm install & npm run build:go
EXPOSE 3000
CMD [ "node" ,"index.js" ]
