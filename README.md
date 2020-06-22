For production run the following commands:
- ```cd docker-compose-prod/hgf```
- ```docker-compose up --build -d```

For development run the following commands:
- ```docker-compose up --build -d && docker exec -it hgf-dev-express sh -c "cd /var/www/data && npm run start:docker:dev"```
- ```docker-compose up --build -d && docker exec -it hgf-dev-express sh -c "npm run start:docker:dev"```
