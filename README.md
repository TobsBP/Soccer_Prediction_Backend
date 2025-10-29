# Soccer Prediction Backend

This is the backend for a soccer prediction application. It provides a RESTful API to manage and retrieve data about soccer matches and teams.

## Features

*   **Team Management:**
    *   Get a list of all teams.
    *   Get a specific team by its ID.
*   **Match Management:**
    *   Get a list of all matches.
    *   Upload new match data from an external API (SoccerDataAPI).
*   **API Documentation:**
    *   The API is documented using Swagger, available at the `/docs` endpoint.

## Technologies Used

*   **[Node.js](https://nodejs.org/)**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **[Fastify](https://www.fastify.io/)**: A fast and low overhead web framework for Node.js.
*   **[TypeScript](https://www.typescriptlang.org/)**: A typed superset of JavaScript that compiles to plain JavaScript.
*   **[Prisma](https://www.prisma.io/)**: A next-generation ORM for Node.js and TypeScript.
*   **[Zod](https://zod.dev/)**: A TypeScript-first schema declaration and validation library.
*   **[Supabase](https://supabase.io/)**: An open source Firebase alternative.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v22.0.0 or later)
*   [npm](https://www.npmjs.com/)

### Installation

1.  Clone the repo:
    ```sh
    git clone https://github.com/TobsBP/soccer_prediction_backend.git
    ```
2.  Install NPM packages:
    ```sh
    npm install
    ```
3.  Set up your environment variables by creating a `.env` file in the root of the project with the following content:
    ```
    DATABASE_URL=""
    DIRECT_URL=""
    SUPABASE_KEY=""
    API_SOCCER_KEY=
    GEMINI_API_KEY=
    API_UPLOAD_KEY=
    ```
4.  Run the database migrations:
    ```sh
    npx prisma migrate dev --name init
    ```

### Running the Server

To run the server in development mode, use the following command:

```sh
npm run dev
```

The server will start on `http://localhost:3333`.

## API Endpoints

The API endpoints are documented using Swagger. Once the server is running, you can access the documentation at `http://localhost:3333/docs`.

The available endpoints are:

*   `GET /getTeams`: Get a list of all teams.
*   `GET /getTeam?id={teamId}`: Get a specific team by its ID.
*   `GET /getMatches`: Get a list of all matches.
*   `POST /uploadMatches`: Upload new match data from the SoccerDataAPI.

## Database Schema

The database schema is defined in the `prisma/schema.prisma` file. It consists of two models: `Team` and `Match`.

### `Team` Model

| Field       | Type     | Description                  |
| :---------- | :------- | :--------------------------- |
| `id`        | `String` | The unique ID of the team.   |
| `name`      | `String` | The name of the team.        |

### `Match` Model

| Field        | Type     | Description                       |
| :----------- | :------- | :-------------------------------- |
| `id`         | `String` | The unique ID of the match.       |
| `homeTeam`   | `Team`   | The home team.                    |
| `homeTeamId` | `String` | The ID of the home team.          |
| `awayTeam`   | `Team`   | The away team.                    |
| `awayTeamId` | `String` | The ID of the away team.          |
| `homeScore`  | `Int`    | The score of the home team.       |
| `awayScore`  | `Int`    | The score of the away team.       |
| `date`       | `DateTime`| The date and time of the match.   |
