npm run migrate create add users table

DATABASE_URL=postgres://postgres:admin@localhost:5432/socialnetwork npm run migrate up
DATABASE_URL=postgres://postgres:admin@localhost:5432/socialnetwork-test npm run migrate up
