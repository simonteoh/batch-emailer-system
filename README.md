Setup and run steps
1. create .env by copy .env.example
2. .env setup `DATABASE_URL`, and others
3. `npx prisma db push` to push to database
4. setup .env `MONGODB` using Atlas
5. setup SMTP connection in .env
6. run `npm run dev`
7. Login with admin email and password by setting .env `ADMIN_EMAIL` and `ADMIN_PASSWORD`
