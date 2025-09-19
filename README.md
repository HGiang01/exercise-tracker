# Exercise Tracker

A simple **in-memory** exercise tracker microservice. Built as part of the freeCodeCamp Back End Development and APIs curriculum.

📚 [Course link](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/exercise-tracker)

🦾 Based on this challenge you can develop a larger CRUD application later on.

## Overview

This API allows you to:
- Create users (register a username)
- Add exercises for a user (description, duration, date)
- List all users
> Note: Data is stored in memory (an array). All data will be lost when the server restarts. For persistent storage, connect a database (MongoDB, PostgreSQL, etc.)



## Feature

- Register user
- Get all users
- Add exercise for a user
- Filter user exercises by date range and limit



## Requirements

- Node.js >= (tested with Node 22)
- express
- cors
- dotenv (loads environment variables)
- uuid (creates user id)



## Quick Starts

```bash
# Clone repository
git clone https://github.com/HGiang01/exercise-tracker
cd exercise-tracker

# Install dependencies
npm install

# Start server
npm run start
# Default: Server listens on PORT 3000
```



## Configuration
- `PORT`: Port the HTTP server listens on (default: `3000`).
- Place environment variables in a `.env` file (or use `sample.env`) if you want to override the default port or add other configuration.



## API Usages

### Create username

`POST /api/users`

- Form data: `username` (string)

- Success:
  ```json
  {
    "username": "fcc_test_17582879675",
    "_id": "35e2924a-79db-48e0-8edc-28c8a595e464"
  }
  ```

- If `username` is missing or invalid:
  ```json
  {
    "error": "invalid username"
  }
  ```

- Example (curl):
  ```bash
  curl -X POST -d "username=fcc_test" http://localhost:3000/api/users
  ```

### Get all usernames

`GET /api/users`

Returns an array of users: 
```json
[
  {
    "username": "fcc_test_17582879670",
    "_id": "16ad0a7b-7722-4191-85ca-ffa719b14ce7"
  },
  {
    "username": "fcc_test_17582879670",
    "_id": "8a476bb2-dac5-4c90-b675-defd9f54be57"
  }
]
```

Example (curl):
```bash
curl http://localhost:3000/api/users
```

### Create user exercise

`POST /api/users/:_id/exercises`

- Path parameter: `_id` (UUID)

- Form data:
  - `description` (string) - **required**
  - `duration` (numeric string) - **required**
  - `date` (date string, e.g. 2025-01-01) - **optional**

- Success:
  ```json
  {
    "username": "fcc_test_17582879670",
    "_id": "16ad0a7b-7722-4191-85ca-ffa719b14ce7",
    "description": "Math",
    "duration": 34,
    "date": "Fri Sep 19 2025"
  }
  ```

- Possible error responses:
  - `"error": "invalid username"`: user not found
  - `"error": "missing description"`: `description` is missing
  - `"error": "missing duration"`: `duration` is missing

- Example (curl):
```bash
curl -X POST -d "description=run&duration=30&date=2020-01-01" http://localhost:3000/api/users/<user_id>/exercises
```

### Filter user exercises

`GET /api/users/:_id/logs`:

- Path parameter: `_id` (UUID)

- Query parameters:
  - `from` (date string) - start date
  - `to` (date string) - end date
  - `limit` (numeric string) - number of returned exercise logs

- Success:
  ```json
  {
    "username": "fcc_test_17582893421",
    "count": 1,
    "_id": "049f2587-f6b6-4446-bfe5-8de7c51ca06b",
    "log": [
      {
        "description": "test",
        "duration": 60,
        "date": "Fri Sep 19 2025"
      }
    ]
  }
  ```

- If `_id` is missing or invalid:
  - `"error": "invalid id"`: user not found

## License
MIT