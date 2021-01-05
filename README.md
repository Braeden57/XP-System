# XP-System

School Project
This school project is for my teacher to have students
log in and check out their XP and assignments.

### Requirements :
1.  [Node.js](https://nodejs.org/en/)
1.  [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)

### Getting Started with Code  :
1. Set up MongoDB on your computer.
2. Clone repo from https://github.com/Braeden57/XP-System.git
3. Run `npm install` to install dependencies.
4. Duplicate `.env.example` and rename the new file to `.env`. Edit to your configurations.
1. Run `npm start` to boot up server.
1. Go to http://localhost:5000. Or Whatever you set it to in the `.env` file.

### Accessing the Database
1. Locally this will use any db you set the DB_URI to in the `.env` file.
1. You can use MongoDB compass app to view the db and edit any information stored.
2. Or connect it to an external db by changing the DB_URI in the `.env` to your db key.
