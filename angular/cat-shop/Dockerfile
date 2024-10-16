FROM node AS build
WORKDIR /angular
COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g @angular/cli
COPY . .
RUN ng build --configuration=production
CMD ng serve --host 0.0.0.0 --port 4200
