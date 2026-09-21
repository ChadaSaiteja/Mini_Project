# Employee Management API

A TypeScript-based REST API for managing employees, employee details, locations, and projects. The application is built with Express and TypeORM and uses Microsoft SQL Server for persistence.

## Features

- Create, list, search, update, and delete employees.
- Store employee details such as salary, phone number, experience, and timestamps.
- Create and list locations, and remove locations by city and country.
- Create, list, search, and delete projects.
- Assign employees to projects by ID or by name.
- Find employees by location.
- Find the projects assigned to an employee.
- Request validation with `express-validator`.
- Database migrations managed through TypeORM.

## Technology Stack

- **Node.js**
- **TypeScript**
- **Express**
- **TypeORM**
- **Microsoft SQL Server**
- **express-validator**
- **ts-node** and **nodemon**

## Project Structure

```text
.
├── migrations/             # TypeORM database migrations
├── src/
│   ├── entities/           # Employee, employee details, location, and project entities
│   ├── router/             # REST API route handlers
│   └── app.ts              # Express application entry point
├── DatabaseSchema.png      # Database schema diagram
├── ormconfig.ts            # TypeORM and SQL Server configuration
├── package.json
└── tsconfig.json
```

## Prerequisites

Make sure the following are installed and available:

- Node.js 18 or later
- npm
- Microsoft SQL Server
- A SQL Server database for the application

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ChadaSaiteja/Mini_Project.git
   cd Mini_Project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root. Do not commit credentials or other secrets to source control.

   ```env
   HOST=localhost
   USER=your_sql_server_user
   PASSWORD=your_sql_server_password
   DB=your_database_name
   port=3000
   ```

   The database connection is configured in `ormconfig.ts`. Ensure the SQL Server instance is running and the database already exists.

## Database Setup

Run the existing TypeORM migrations after configuring the database:

```bash
npm run migration:run
```

To revert the latest migration:

```bash
npm run migration:revert
```

Additional migration commands:

```bash
npm run migration:create    # Create an empty migration
npm run migration:generate  # Generate a migration from entity changes
```

> Review generated migrations before applying them to a shared or production database.

## Running the Application

Start the development server with automatic reloads:

```bash
npm start
```

The server listens on the port configured by the `port` environment variable. If `port=3000`, the API is available at:

```text
http://localhost:3000
```

## API Endpoints

### Employees

Base path: `/employee`

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/employee` | Create an employee with details and location. Required body fields include `name`, `city`, `country`, `salary`, and `phno`. |
| `GET` | `/employee` | Get all employees and their details. |
| `GET` | `/employee/id/:id` | Get an employee by employee ID. |
| `GET` | `/employee/name?name=...` | Get an employee by name. |
| `GET` | `/employee/getEmpByLocation?location=...` | Get employee names for a city. |
| `GET` | `/employee/projectsByEmpName?ename=...` | Get projects assigned to an employee. |
| `PUT` | `/employee?eid=...` or `/employee?ename=...` | Update employee details. Send fields to update in the JSON body. |
| `DELETE` | `/employee?eid=...` or `/employee?ename=...` | Delete an employee by ID or name. |

Example employee request:

```json
{
  "name": "Alex Johnson",
  "city": "New York",
  "country": "United States",
  "salary": "75000",
  "phno": "5551234567",
  "experience": 4
}
```

### Locations

Base path: `/location`

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/location` | Create a location. Requires `city` and `country`. |
| `GET` | `/location` | Get all locations. |
| `DELETE` | `/location?city=...&country=...` | Delete a location by city and country. |

Example location request:

```json
{
  "city": "New York",
  "country": "United States"
}
```

### Projects

Base path: `/project`

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/project` | Create a project. Requires `name`. |
| `GET` | `/project` | Get all projects. |
| `GET` | `/project/id/:pid` | Get a project by ID. |
| `GET` | `/project/name?pname=...` | Get a project by name. |
| `PUT` | `/project/addEmpToProject?pid=...&eid=...` | Assign an employee to a project by IDs. |
| `PUT` | `/project/addEmpToProject?pname=...&ename=...` | Assign an employee to a project by names. |
| `DELETE` | `/project?pid=...` or `/project?pname=...` | Delete a project by ID or name. |

Example project request:

```json
{
  "name": "Employee Portal"
}
```

## Data Model

The application uses the following main entities:

- **Employee** — stores the employee ID and unique name.
- **EmployeeDetails** — stores experience, salary, phone number, creation/update timestamps, and the employee's location.
- **Location** — stores a unique city and its country.
- **Project** — stores a unique project name and its many-to-many employee assignments.

The entity relationships are represented in [`DatabaseSchema.png`](./DatabaseSchema.png).

## Development Notes

- `synchronize` is disabled in the TypeORM configuration; use migrations for schema changes.
- The SQL Server configuration enables `trustServerCertificate`, which is convenient for local development. Review this setting before deploying to production.
- The current `package.json` does not include an automated test command. Add tests before using the API in production.

## License

No license has been specified for this repository yet. Add a license file if you plan to distribute or reuse the project.
