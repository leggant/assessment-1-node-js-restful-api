# Assessment 1 - @leggant
## :rocket:Deployment - Heroku 
:anchor:__Pipeline__: 
:anchor:__Staging__: 
:anchor:__Production__: 
## API Endpoints
## Postman Project
## Entity Relationship Diagram
## API/Command Line Instructions

### Run Docker PostGres DB
- start docker on the local system, run the following command in vsCode terminal. This will run a database locally within a background process
```bash
docker run --name apipostgresinstance -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres
```
- add the postgres db address to the .env.development file
```plaintext
DATABASE_URL="postgres://postgres:password@localhost:5432/apipostgresinstance"
SHADOW_DATABASE_URL="postgres://postgres:password@localhost:5432/apipostgresinstance"
```
- run a test migration with the following command
```bash
npx prisma db push
```

## Gist Links
__Note: more users added than required.__
- [End-point for Basic Users](https://gist.github.com/leggant/0bba24ff5402123c0a1301df853c5541)
- [End-point for Admin Users](https://gist.github.com/leggant/55140b7528dae48661395db873568dfe)
## :bookmark_tabs:References 	
:anchor: https://www.freecodecamp.org/news/the-express-handbook
:anchor: https://express-validator.github.io/docs/index.html
:anchor: https://youtu.be/YK-GurROGIg [#12](https://github.com/otago-polytechnic-bit-courses/assessment-1-node-js-restful-api-leggant/issues/12)
:anchor: https://blog.devgenius.io/validating-user-inputs-on-your-express-js-application-with-express-validator-4d82b995f524
:anchor: https://www.w3schools.com/jsref/jsref_startswith.asp
:anchor: https://www.youtube.com/watch?v=7i7xmwowwCY
:anchor: https://stackoverflow.com/questions/1050720/how-to-add-hours-to-a-date-object
:anchor: __database seeder__ https://www.prisma.io/docs/guides/database/seed-database#example-seed-scripts
https://stackoverflow.com/questions/69526209/prisma-how-can-i-update-only-some-of-the-models-fields-in-update
https://bobbyhadz.com/blog/javascript-check-if-object-is-empty