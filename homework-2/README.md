# Project structure
```
homework-2/
│   database.json
│   index.js
│
├───controllers
│       users.controller.js
│
├───lib
│       router.js
│
├───models
│       users.model.js
│
├───routes
│   └───users
│       │   route.js
│       │
│       └───[id]
│               route.js
│
└───services
        users.service.js
```

# Run server
Run command via Node.js (in project folder \homework-1v\src)

`node index.js`
or 
` "npm run server"`

# REST endpoints
| Method                                                    | URL         | Params        | Description   |
|-----------------------------------------------------------|-------------|---------------|---------------|
| GET                                                       | /users      | -             | list of users |
| GET                                                       | /users/:id  | -             | user by id    |
| POST                                                      | /users      | {'name': ''}  | create        |
| PUT                                                       | /users/:id  | {'name': ''}  | update        |
| DELETE                                                    | /users/:id  | -             | delete        |
 
# Examples

```
curl http://localhost:3000/users

curl http://localhost:3000/users/<id>

curl -X POST -H "Content-Type: application/json" \
     -d '{"name":"Alice"}' http://localhost:3000/users
     
curl -X PATCH -H "Content-Type: application/json" \
     -d '{"name":"Bob"}' http://localhost:3000/users/<id>
     
curl -X DELETE http://localhost:3000/users/<id>
```