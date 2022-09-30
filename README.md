# NC-News

This is a RESTful back-end web API for News website called NC News. This was a project I completed on the Northcoders coding Boot-camp.  
This API contains get, post, patch and delete request endpoints that the user can use to interact with articles, topics, comments and votes.

The front-end app can be found here:

This API is hosted on Heroku

## Set up instructions:

Please make sure you have the minimum requirements:

_Node.js: v18.1.0_\
_Post-gress_

1. Cone this repo
2. Install the dependencies with:

```
 npm install
```

You can find all the dependencies in the package.json file under _'"dependencies"_ and _"devDependencies"_

3. Connect your database.  
   To connect to the two databases locally you will need to set your environment variables, two .env files for both the development and testing databases.

   Include the database names in each of these .env files
   eg.

   ```
   PGDATABASE=database_name_here
   ```

4. Run set up and seed database:
   Setup up the databases:
   ```
   npm run setup-dbs
   ```

Seed the databases

```
npm run seed
```

Initiate the listener:

```
npm start
```

## Testing:

The tests were creating using supertest jest and jest sorted.

To run the tests:

```
npm test
```

`You are all set!` Thank you for takibgn the time to look at my NC News project.
