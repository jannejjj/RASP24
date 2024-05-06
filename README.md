# RASP24

### Course project for Running a Software Project @ LUT University
_A proof-of-concept member / event management system for small to midsize associations or groups._


_Browser/version support is determined by MUI, i.e.:_

![image](https://github.com/jannejjj/RASP24/assets/61980297/a00c8ce7-27c0-49b0-8aae-9184e0f56461)

----------------------------------------------------------------------------------
### Installation:
_You should have Node.js and MongoDB* installed (*or use a cloud MongoDB instance)._

In a terminal window, go to the directory where you want the project, then clone the repository:

HTTPS:
`git clone https://github.com/jannejjj/RASP24.git`

_or_

SSH:
`git clone git@github.com:jannejjj/RASP24.git`

### Before you run - environment variables:

1) Create a .env file under the /server directory. It should contain the following variables:
```
SECRET="something_here"
MONGODB_CONN_STRING="<your MongoDB connection string>"
```
- The value of SECRET can be anything, such as "something_here" as shown above
- MONGODB_CONN_STRING is the url for connecting to your MongoDB instance.


2) Create a .env file under the /client directory. It should contain the following variables:
```
REACT_APP_PROXY_TARGET="http://localhost:4000"
REACT_APP_API_KEY="<Your Google Places API key>"
```
- The proxy target is used to route requests correctly to the backend
- "localhost" in the proxy target should be replaced with "server" if you want to use Docker to run the app. 
- You should have your own Google Places API key.

3) Make sure you save both .env files.

---------------------------------------------------------------------------------------------

### Running the app:

```
cd RASP24/
npm install (wait for installation to finish)
npm run dev:server
(in another terminal window) npm run dev:client
```
Or, if you're using Docker _(requires you to have Docker installed)_:

```
cd RASP24/
docker-compose up --build
``` 

If you haven't received any error messages on the consoles, everything is working correctly. The application is then running at localhost:3000.


