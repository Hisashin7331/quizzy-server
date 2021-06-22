# quizzy-server

## Description
Backend server for Quizzy app, MERN stack CRUD app for creating and taking quizzes, create an account and try it by yourself

## Live
### [See how the backend works live](https://quizzy-client.herokuapp.com/browse)
### [Check frontend for this backend](https://github.com/Hisashin7331/quizzy-client)

## Technologies and libraries
Backend created using:
* NodeJS: 14.15.1
* Express: v4.17.1
* MongoDB: v3.6.6
* Mongoose: v5.12.4
* JSONWebToken: v8.5.1
* bcrypt: v5.0.1
* Joi: v17.4.0
* Multer: v1.4.2
* Google Cloud Storage: v5.8.5

## Features
* Creating accounts with avatars
* Logging in
* Hashing passwords before sending to DB
* Editing user account data
* Authentication using JWT tokens
* Creating, taking and deleting quizzes
* Data validation using Joi

## Setup
To run this project firstly clone this repository, then run
```
cd ./quizzy-server
npm install
```
then create a .env file with following variables
```
DB_URI = *your mongodb uri*
JWT_SECRET = *your JWT secret key*
SESSION_SECRET = *your session secret key*
PROJECT_ID = *your GoogleCloud project ID*
```
and download your Google credentials and copy/paste it to the main folder

then run
```
npm start
```
