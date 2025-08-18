# Tea Tracker API

## Project structure
```
│   app.module.ts
│   main.ts
│
├───config
│       configuration.ts
│
└───tea
│   tea.controller.ts
│   tea.module.ts
│   tea.service.ts
│
├───dto
│       tea.dto.ts
│
├───entities
│       tea.entity.ts
│
└───shared
├───decorators
│       public.ts
│       zbody.ts
│
├───guards
│       api-key.guard.ts
│
└───interceptors
        logging.interceptor.ts
```

### Install, run and compile

```
npm install

npm run start:dev

npm run build
```

## Docker

### Build image

```
docker build -t nest-tea-api .
```

### Run container

```
docker run -p 3000:3000 nest-tea-api
```

## Swagger

```
http://localhost:3000/docs
```

## REST

| Method | Path       | Description                              |
|--------|------------|------------------------------------------|
| GET    | `/tea`     | Get tea list with filters and pagination |
| GET    | `/tea/:id` | Get tea by id                            |
| POST   | `/tea`     | Create new tea                           |
| PUT    | `/tea/:id` | Update tea                               |
| DELETE | `/tea/:id` | Delete tea                               |

