.env file key ===>

SERVER:

DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=
// api key for fixer api
API_KEY=
secret MUST be very long.
SECRET=thisisasecretwithalotofcharacterbecauseoftheoutofrangeexceptionn

You don't need to create the db.
The API will ensure that for you.

CRUD API for user

POST
/api/users/register => inster/register
/api/users/auth => connexion

PUT
/api/users => update all informations

DELETE
/api/users => delete user

R for fixer api
GET

/api/xeu
[FromQuery] string baseCurrency, [FromQuery] string symbols


CLIENT:
