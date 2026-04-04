# smol 

Small Express API plus a static UI, backed by PostgreSQL and Prisma. Short codes are derived from numeric IDs with base62 encoding and a configurable offset.

## Local setup

```bash
git clone <repository-url>
cd smol
cp .env.example .env
# Edit .env: set DATABASE_URL, OFFSET, and PORT

npm install
npx prisma migrate dev
npm run dev

```mermaid 
flowchart LR
  subgraph client [Client]
    Browser
  end

  subgraph server [Server]
    Static["express.static"]
    Router["Routes / Controllers"]
    Service["Business Logic (validation, SSRF, encoding)"]
  end

  subgraph data [Data]
    PG[(PostgreSQL)]
  end

  Browser -->|GET /| Static
  Browser -->|POST / JSON| Router
  Browser -->|GET /:smol| Router
  Router --> Service
  Service --> PG
```
