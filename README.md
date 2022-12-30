# Assessment 1 - @leggant
## :rocket:Deployment - Heroku 
:anchor:__Pipeline__: 
:anchor:__Staging__: 
:anchor:__Production__: 
## API Endpoints
## Postman Project
## Entity Relationship Diagram
:anchor: __[Made with Lucidchart](https://lucid.app/lucidchart/d03c09c4-e9c0-4f14-bf42-dceaf7a4e0d8/edit?viewport_loc=-354%2C156%2C3162%2C1102%2C0_0&invitationId=inv_c9acfca4-7f84-4762-87a2-5b0f96bca0ea)__
<p>
  <img src="./docs/imgs/App_Dev_API_ERD.png?raw=true" width="850" title="hover text">
</p>

## API/Command Line Instructions

### Database Seeders
_user and category seeders are both available from admin-only endpoints_
1. user seeder endpoint: `/user/auth/admin/seeder/players`
2. category seeder endpoint: `/user/auth/admin/seeder/categories`

https://opentdb.com/api_category.php

### Migrate the Database
#### Development
```node
npm run migrate:dev
```
##### Error Handling
If this command above outputs the following error:
```bash
Error: P3005

The database schema is not empty. Read more about how to baseline an existing production database: https://pris.ly/d/migrate-baseline
```
I found the only way to resolve this is to delete the locally stored migration file(s). e.g. `./prisma/migrations/**`
Then re-run the migration command:
```node
npm run migrate:dev
```
##### Additional Commands
```node
npm run reset:dev // reset the database
```
#### Production
```node
npm run resolve:dev 20221219234050_dev // folder name of the local migration ./prisma/migrations/20221219234050_dev
npm run migrate:prod // this command wil timeout, re-run until successfully completed
```
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
- :anchor: [End-point for Basic Users](https://gist.github.com/leggant/0bba24ff5402123c0a1301df853c5541)
- :anchor: [End-point for Admin Users](https://gist.github.com/leggant/55140b7528dae48661395db873568dfe)
## :bookmark_tabs:References 	
- :anchor: https://www.freecodecamp.org/news/the-express-handbook
- :anchor: https://express-validator.github.io/docs/index.html
- :anchor: https://youtu.be/YK-GurROGIg [#12](https://github.com/otago-polytechnic-bit-courses/assessment-1-node-js-restful-api-leggant/issues/12)
- :anchor: https://blog.devgenius.io/validating-user-inputs-on-your-express-js-application-with-express-validator-4d82b995f524
- :anchor: https://www.w3schools.com/jsref/jsref_startswith.asp
- :anchor: https://www.youtube.com/watch?v=7i7xmwowwCY
- :anchor: https://stackoverflow.com/questions/1050720/how-to-add-hours-to-a-date-object
- :anchor: __database seeder__ https://www.prisma.io/docs/guides/database/seed-database#example-seed-scripts
- :anchor: https://stackoverflow.com/questions/69526209/prisma-how-can-i-update-only-some-of-the-models-fields-in-update
- :anchor: https://bobbyhadz.com/blog/javascript-check-if-object-is-empty
- :anchor: get first key/value from object https://stackoverflow.com/a/56969714
- :anchor: testing axios functions from the commandline using `run-func` npm package 
  - https://stackoverflow.com/a/43598047 
  - using the command: `npx run-func ./utils/axiosRequests.mjs getUsers` and 
  - `npx env-cmd -f .env.development npx run-func ./api/v1/controllers/seeder_controller.js seedUsers`
- :anchor: get object count - https://www.geeksforgeeks.org/find-the-length-of-a-javascript-object
- :anchor: get specific values from array of objects
  - https://www.designcise.com/web/tutorial/how-to-extract-specific-keys-values-from-an-array-of-objects-in-javascript
- https://stackoverflow.com/a/8016205
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#try_it
- filter objects by key: https://masteringjs.io/tutorials/fundamentals/filter-key
- https://hackernoon.com/how-to-update-object-key-values-using-javascript
- `npx run-func ./utils/axiosRequests.mjs getCategories`
- `npx run-func ./utils/dateTimeCheck.mjs getCategories`
- quiz date checks: https://youtu.be/oOK3UzLJ_Cs - testing: `npx run-func ./utils/dateTimeCheck.mjs quizDateValid 27 12 2022` and `npx run-func ./utils/dateTimeCheck.mjs quizEnddateValid 24 12 2022 30 12 2022`
- https://stackoverflow.com/a/3367429 Get epoch for a specific date using Javascript
- https://stackoverflow.com/a/61505926 MONTHS in JavaScript Dates starts in zero (0 = January, 11 = December)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCDate#try_it