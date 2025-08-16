# Generic TypeScript ORM Demo (PostgreSQL + pg-pool)

## Project Structure

```
src/
├─ orm/
│  └─ orm.ts              # Orm<T> implementation
├─ repositories/
│  └─ user.repo.ts        # Users repository (id, firstName, lastName, age, gender)
└─ demo.ts  
└─ utils.ts             
```

---

## Quick Start

### 1) Install

```bash
npm i
```

### 2) Run Postgres

**Option A — Docker (recommended for local dev):**

```bash
docker run -d --name pg \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 postgres:16
```

**Option B — Local installation:** make sure the server runs on `localhost:5432`, and note your username/password.

### 3) Set `DATABASE_URL`

**macOS/Linux**

```bash
export DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres"
```

**Windows PowerShell**

```powershell
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres"
```


### 4) Run the demo

```bash
npm run demo
```
