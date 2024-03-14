FROM 0868124511/ubuntu20.04-node18:v2
RUN apt-get update
WORKDIR /app
COPY . .
RUN rm -rf node_modules
RUN npm install
EXPOSE 3000 3001 3002 30000 30010 30020
CMD ["pm2", "start", "pm2-config.json", "--no-daemon"]