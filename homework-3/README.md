# KV-Server & Redis-like Services

## Description

- **redis-like** — server for saving key-value through HTTP:
    - `GET /get?key=foo` → `{ "value": "bar" | null }`
    - `POST /set` з JSON `{ "key": "foo", "value": "bar" }` → `{ "ok": true }`

- **kv-server** — proxy-server that use `redis-like` through HTTP:
    - `GET /kv/:key` та `POST /kv` (like `redis-like` endpoints)
---

# Docker
Docker image from p.3 https://hub.docker.com/repository/docker/annazab22/node-lts-alpine/general

## compose 
compose.yml run three server -- redis, kv-server and kv-server-dev(with hot reload)
Command to run all services
```
docker-compose up --build
```

run redis and kv-server

```
docker-compose up kv-server redis  
```

run redis and kv-server-dev with hot reload
```
docker-compose up kv-server-dev redis
```

# Test
POST
```
curl -X POST -H "Content-Type: application/json" -d '{"key":"test", "value":"Hello, Redis!"}' localhost:8080/kv

PowerShell:
curl -Method POST http://localhost:8080/kv -Headers @{ "Content-Type" = "application/json" } -Body '{"key":"hi","value":"Hi"}'

```

GET
```
curl localhost:8080/kv/test

PowerShell
curl http://localhost:8080/kv/hi
```
