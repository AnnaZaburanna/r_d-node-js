# Project structure
```
homework-4/src
│   app.js
│   container.js
│   server.js
│
├───config
│       index.js
│
├───controllers
│       brews.controller.js
│
├───docs
│       index.js
│       merge-specs.js
│       openapi.js
│       swagger.js
│
├───dto
│       brews.dto.js
│
├───middlewares
│       asyncHandler.js
│       validate.js
│       validateParams.js

```

# Run server
Run command (in project folder \homework-4)
```
"npm run dev"
```

or run 
```
docker run -p 3000:3000 brew-api
```

# REST endpoints
| Method                                                    | URL            | Params                                                    | Body                                                                                                                                                            | Description    |
|-----------------------------------------------------------|----------------|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| GET                                                       | /api/brews     | method:  v60, aeropress, chemex, espresso, ratingMin: 1-5 | -                                                                                                                                                               | list of brews  |
| GET                                                       | /api/brews/:id | -                                                         | -                                                                                                                                                               | brew by id     |
| POST                                                      | /api/brews     | -                                                         | {<br/>  "beans": "new beans 3", <br/> "method": "espresso", <br/>  "rating": 2, <br/>  "notes": "string", <br/>  "brewed_at": "2025-07-01T15:58:47.231Z" <br/>} | create         |
| PUT                                                       | /api/brews/:id | -                                                         | {<br/>  "beans": "new beans 3", <br/> "method": "espresso", <br/>  "rating": 2, <br/>  "notes": "string", <br/>  "brewed_at": "2025-07-01T15:58:47.231Z" <br/>} | update         |
| DELETE                                                    | /api/brews/:id | -                                                         | -                                                                                                                                                               | delete         |
 