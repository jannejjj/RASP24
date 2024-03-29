# RASP24

## Course project for Running a Software Project
_A member / event management system for small to midsize associations or groups._

### Installation:
*(You should have Node.js installed.)*

Go to the directory where you want the project.

HTTPS:
`git clone https://github.com/jannejjj/RASP24.git`

SSH:
`git clone git@github.com:jannejjj/RASP24.git`

### Before you run - environment variables:

1) Create a .env file in the /server directory. It should contain the following variables:
```
SECRET="something_here"
MONGODB_CONN_STRING="mongodb+srv://rasp24:MONGODB_PASSWORD@rasp24.vai1b1r.mongodb.net/?retryWrites=true&w=majority"
```
- The value of SECRET can be anything, it's used for login
- MONGODB_CONN_STRING is the url for connecting to the cloud MongoDB
- You can also enter your local MongoDB address if you don't want to use a cloud one ```(mongodb://localhost:27017/assoceasedb)```


2) Create a .env file in the /client directory. It should contain the following variable:
```
REACT_APP_PROXY_TARGET="http://server:4000"
```
- This is used to route requests correctly to the Docker backend
- "server" can be replaced with "localhost" if you're not using Docker for running the app



### How to run the app:

```bash
cd RASP24/
npm install
npm run dev:server
(on another terminal window) npm run dev:client
```
Or with Docker (requires you to have Docker installed):

```bash
cd RASP24/
docker-compose up --build
``` 

If you haven't received any error messages on the consoles, everything is working correctly.


