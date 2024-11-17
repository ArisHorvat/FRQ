# 🏈FRQ - NFL Quiz Trivia Website

Welcome to **FRQ**, an interactive website featuring multiple quiz-style games related to the NFL. This project is designed to test your knowledge of NFL players and teams through engaging gameplay. Below is an overview of the games included in this project, as well as information about the accompanying assets.

## Game Overview

### 1. WORDLE
- **Description**: A Wordle-style game where you guess the name of an NFL player.
- **Objective**: Use your knowledge of NFL players to make correct guesses within a limited number of tries.

### 2. TOP 10
- **Description**: A guessing game where you try to identify the top 10 players based on specific criteria.
- **Objective**: Use your NFL knowledge to complete the top 10 list for various categories.

### 3. CONNECTIONS
- **Description**: A group-connection game featuring 16 NFL players.
- **Objective**: Connect players in groups of 4 based on common characteristics or criteria.

### 4. GUESS WHO
- **Description**: A guessing game where you identify an NFL player based on hints.
- **Objective**: Guess the player while receiving clues about their team, conference, division, position, age and number.

## Assets

In addition to the games, this project includes two separate folders containing images:

- **LOGOS**: This folder contains logos of various NFL conferences.
- **JERSEYS**: This folder features images of player jerseys for each NFL team, all created by me.

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed (version 16+ recommended).
- [npm](https://www.npmjs.com/) installed.
- SQL Server with the `FRQDataWarehouse` database configured.

---

### 2. Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/ArisHorvat/FRQ.git
   cd project
   
### 3. Install Dependencies

#### Backend
Navigate to the `backend` folder and install the required dependencies:
```bash
cd backend
npm install
```

#### Root Directory
Navigate back to the root directory and install the necessary dependencies:
```bash
cd ..
npm install
```

---


### 4. Set up the `.env` File

#### For Mac/Linux:

1. In the `backend` folder, create a file named `.env`:
   ```bash
   touch backend/.env
   ```

2. Add the following variables to `.env`:
   ```env
   DB_USER=<your-database-username>
   DB_PASSWORD=<your-database-password>
   DB_SERVER=<your-server-name>
   DB_NAME=FRQDataWarehouse
   DB_PORT=1433
   ```

#### For Windows:

1. In the `backend` folder, create a file named `.env`:
   ```cmd
   echo DB_USER=<your-database-username> > .env
   echo DB_PASSWORD=<your-database-password> >> .env
   echo DB_SERVER=<your-server-name> >> .env
   echo DB_NAME=FRQDataWarehouse >> .env
   echo DB_PORT=1433 >> .env
   ```

2. Alternatively, you can manually create a `.env` file using a text editor and add the following variables:
   ```env
   DB_USER=<your-database-username>
   DB_PASSWORD=<your-database-password>
   DB_SERVER=<your-server-name>
   DB_NAME=FRQDataWarehouse
   DB_PORT=1433
   ```

---

### 5. Start the Servers

To start both the backend and frontend servers:

1. From the root directory, run the following command:
   ```bash
   npm start

---

### 6. Accessing the Application

Open your browser and visit:
```
http://localhost:8080
```

---

## API Endpoints

The backend server provides several API endpoints to power the games:

| **Endpoint**                | **Description**                                          |
|-----------------------------|----------------------------------------------------------|
| `/api/top10`                | Retrieves the top 10 players from a specific team.       |
| `/api/connections`          | Returns grouped players for the Connections game.        |
| `/api/filter-player/:filter`| Searches for players by name using a filter.             |
| `/api/count-player`         | Returns the total count of players in the database.      |
| `/api/mystery-player`       | Fetches a random NFL player for the Mystery game.        |
| `/api/wordle-player`        | Retrieves a player name for the Wordle game.             |
| `/api/players`              | Returns all players from the database.                   |

---

## Technologies Used

### Frontend
- **HTML**, **CSS**, and **JavaScript**.
- Static server powered by **http-server**.

### Backend
- **Node.js**: Backend runtime.
- **Express.js**: Web server framework.
- **MSSQL**: Database integration using the `mssql` package.
- **CORS**: Cross-origin resource sharing.

### Database
- **SQL Server**:
  - Includes tables like `Player`, `Team`, and `Division`.

---

## Development Notes

### Starting Servers

The **launcher script** automatically starts both the backend and frontend:
```bash
node launcher.js
```

### Stopping Servers

To stop both servers, press `Ctrl + C` in the terminal.

---

## Contributors
- **Horvat Aris** - Project Developer.


---

Thank you for checking out FRQ! Test your NFL knowledge and have fun!
