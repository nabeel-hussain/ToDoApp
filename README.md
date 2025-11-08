# To-Do Task Application

A simple task management app built with .NET 8 and React. Lets you create, edit, and organize your tasks.

## What's This About?

This is a full-stack todo app using .NET 8 for the backend and React with TypeScript for the frontend. Uses PostgreSQL as the database. The backend follows Clean Architecture and CQRS pattern and uses API key authentication.

## Live Demo

The application is deployed and available at:
- **Live Site**: [http://168.119.175.92/](http://168.119.175.92/)

## Features

- Create tasks (title needs to be at least 10 chars)
- Edit and update tasks
- Set due dates
- Mark tasks as done
- Delete tasks
- Filter by status (All, Completed, Pending, Overdue)
- Show/hide table columns
- Overdue tasks get highlighted

## Tech Stack

**Backend:**
- .NET 8
- PostgreSQL
- Entity Framework Core
- MediatR, FluentValidation, AutoMapper (for CQRS, validation, mapping)

**Frontend:**
- React + TypeScript
- Vite
- nginx (for production serving)

**Deployment:**
- Docker (for containerized deployment)

## Getting Started

**Backend:**
1. Open `td-backend/To Do.sln` in Visual Studio 2022
2. Update the connection string in `TD.Web/appsettings.json` with your PostgreSQL details
3. Set `TD.Web` as the startup project
4. Run it (F5)
5. Should be available at `https://localhost:7049`

**Frontend:**
1. Go to `td-frontend` folder
2. Create `.env.local` file and add:
   ```
   VITE_API_BASE_URL=https://localhost:7049
   ```
3. Run `npm install`
4. Run `npm run dev`
5. Should be available at `http://localhost:5001` (or whatever port Vite gives you)

## API Endpoints

All endpoints are under `/api/ToDoTask` and require an API key in the `X-Api-Key` header.

**Local Development Base URL:** `https://localhost:7049/api/ToDoTask`  
**Production Base URL:** `http://168.119.175.92/api/ToDoTask`

### 1. Get Task by ID
- **GET** `/api/ToDoTask/GetById?id={guid}`
- Returns a single task by its ID

### 2. Get All Tasks
- **GET** `/api/ToDoTask/Get`
- Optional query params: `PageNumber`, `PageSize`
- Returns list of all tasks

### 3. Create Task
- **POST** `/api/ToDoTask/Create`
- Body:
  ```json
  {
    "title": "Task title (min 10 chars)",
    "description": "Optional description",
    "dueDate": "2024-12-31T23:59:59Z"
  }
  ```
- Title is required and needs to be at least 10 chars

### 4. Update Task
- **PUT** `/api/ToDoTask/Update`
- Body:
  ```json
  {
    "id": "guid-here",
    "title": "Updated title",
    "description": "Updated desc",
    "isDone": false,
    "dueDate": "2024-12-31T23:59:59Z"
  }
  ```

### 5. Mark as Done
- **PUT** `/api/ToDoTask/MarkAsDone`
- Body:
  ```json
  {
    "id": "guid-here"
  }
  ```

### 6. Delete Task
- **DELETE** `/api/ToDoTask/Delete?Id={guid}`
- Deletes the task

## Authentication

All endpoints need an API key. Add it to the request header:
```
X-Api-Key: your-api-key-here
```

You can test it in Swagger using the "Authorize" button at the top.

## Project Structure

```
ToDoApp/
├── td-backend/          # .NET 8 backend
│   ├── TD.Domain/       # Domain entities
│   ├── TD.Application/ # Business logic (CQRS)
│   ├── TD.Infrastructure/ # DB, repos
│   └── TD.Web/         # API controllers
└── td-frontend/        # React frontend
```

## Future Improvements

Some ideas for later:
- User management & JWT auth
- Unit tests
- Support for other databases (SQLite, etc.)
- Better UI/UX
- Notifications for due dates
- Task notes/attachments

---

**Note:** This is mainly assignment purposes. For production use, would want to add more security, logging, monitoring, etc.
