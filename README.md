# Nex Todo App

<!-- **Visit**: https://task-ease-flow.vercel.app/ -->

NEX Todo App is a full-stack applicationallows the user to read, create and update a to-do list.

This repository contains the backend API built with Node.js and Express, using PostgreSQL for data storage, as well as the frontend built with React and Ant Design.

## Features

### Completed

- **Todos CRUD**: Create, read, update, delete duties.
- **Responsive Design**: UI is responsive and works well on various devices.
- **Database Connection**: PostgreSQL connection properly configured and tested.
- **Error Handling**: Implemented error handling and validation.
- **Unit Tests**: Wrote unit tests for backend and frontend.
- **API Documentation**: All API endpoints documented.
- **README**: Detailed setup and usage instructions provided.

## Tech Stack

- **Frontend**: React, TypeScript, Ant Design
- **Backend**: Node.js, TypeScript, Express
- **Database**: PostgreSQL

## Directory Structure

```plaintext
nex-todo-app/
├── README.md
├── backend/
│   ├── package.json
│   ├── src/
├── frontend/
│   ├── package.json
│   ├── public/
│   ├── src/
└── package.json
```

## Architecture

```
    +---------------------+             +---------------------+
    |      Frontend       |             |      Backend        |
    |---------------------|             |---------------------|
    | +---------------+   |             | +---------------+   |
    | |  React App    |   |             | |  Express API  |   |
    | | (Ant Design)  |   |             | |               |   |
    | +---------------+   |             | +---------------+   |
    |        |            |             |        |            |
    |        | HTTP       |             |        |            |
    +---------------------+             +---------------------+
             |                                |
             |                                |
             |                                |
             +---------->+--------------------v---------------------+
                         |                Services                  |
                         |------------------------------------------|
                         | +--------------+  +--------------------+ |
                         | | UserService  |  |    TodosService    | |
                         | +--------------+  +--------------------+ |
                         +------------------+-----------------------+
                                        |
                                        |
                                        v
                         +---------------------------+
                         |        Data Access        |
                         |---------------------------|
                         | +-----------------------+ |
                         | |  TodoContext (PG)    | |
                         | +-----------------------+ |
                         +---------------------------+
                                        |
                                        |
                                        v
                         +---------------------------+
                         |       PostgreSQL          |
                         +---------------------------+
```

## Setup and Usage

### Clone the repository

```
git clone https://github.com/ijoshwang/nex-todo-app.git
cd nex-todo-app
```

### Backend Setup

```
cd backend
npm install
npm run setup-db
npm start
```

Rename `.env.example` to `.env`, modify the variable adhere to your own config.

```
PORT=3000
DB_HOST=localhost
DB_USER=nex_todo
DB_PASSWORD=your_password
DB_NAME=nex_todo_db
DB_PORT=5432
CLIENT_URL=http://localhost:5000
```

### Frontend Setup

```
cd frontend
npm install
npm start
```

Rename `.env.example` to `.env`, modify the variable adhere to your own config.

```
REACT_APP_API_BASE_URL=http://localhost:3000/api/v1
PORT	=5000
```

Visit the frontend at http://localhost:5000

## API Endpoints

#### POST /api/auth/login

- **Request Body**:
  ```json
  {
    "name": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "string"
  }
  ```

#### GET /api/todos

- **Query Parameters**:

  - status (optional): Filter by status (all, 0, 1, 2)
  - sortBy (optional): Sort by field (status, dueDate, name)
  - sortOrder (optional): Sort order (asc, desc)

- **Response**:

  ```json
  [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "dueDate": "2024-06-15T00:00:00Z",
      "status": 0,
      "userId": "string",
      "createTime": "2024-04-20T10:20:30Z"
    }
  ]
  ```

#### GET /api/todos/{id}

- **Response**:
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "dueDate": "2024-06-15T00:00:00Z",
    "status": 0,
    "userId": "string",
    "createTime": "2024-04-20T10:20:30Z"
  }
  ```

#### POST /api/todos

- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "dueDate": "2024-06-15T00:00:00Z"
  }
  ```
- **Response**:

  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "dueDate": "2024-06-15T00:00:00Z",
    "status": 0,
    "userId": "string",
    "createTime": "2024-04-20T10:20:30Z"
  }
  ```

#### PUT /api/todos/{id}

- **Request Body**:
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "dueDate": "2024-06-15T00:00:00Z",
    "status": 1
  }
  ```
- **Response**:
  - 204 No Content

#### DELETE /api/todos/{id}

- **Response**:
  - 204 No Content
