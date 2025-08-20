## Project setup

```bash
$ npm install
```

## Compile and run the project

start Kafka
```bash
docker compose up -d
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Send event example
```bash
curl -X POST http://localhost:3000/signup \
-H "Content-Type: application/json" \
-d '{"email":"alice@example.com"}'
```

