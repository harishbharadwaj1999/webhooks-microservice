# webhooks-microservice
Dyte problem statement to create a “webhooks microservice” using  Moleculer and Express

Clone this repository.
Run 'npm install' to install all dependencies.
Start the project with 'npm run dev' command.

Once started the application wil be available at http://localhost:3000/

## Services
*   Gateway: Provides gateway and routing services.
*   Webhooks: Provides register, update, list and trigger actions.

## Routes
*  /create to register target url
*  /read to return a list of urls and their corresponding ids
*  /update to update an id with a new target url
*  /trigger to get the ip of sender and send it as a POST request to the list of URLs along with the UNIX time of the POST request

## Commands to test webhooks microservice
*   npm run dev
*   load services/webhooks.service.js
*   call webhooks.register --targetUrl='https://target.url/'
*   call webhooks.list
*   call webhooks.update --id='Id of the the targetUrl' --newTargetUrl='https://new.target.url/'
*   call webhooks.trigger --ipAddress='Ip address of the user'

## Mixins
*  db.mixin: Database access mixin for services.

## NPM scripts
- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
