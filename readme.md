# Installing the project

First of all clone the repo:
```sh
git clone git@github.com:eduardsv/expenses.git expenses
```
Than you have to do this:
```sh
cd expenses
composer install
npm install # this one will take some time
bower install
gulp fonts
gulp css
gulp js
cp .env.example .env
php artisan key:generate
```
Than open and edit database settings in .env file
And after that run the migrations and start the project
```sh
php artisan migrate
php artisan db:seed # populating database
php artisan serve # starting server at http://localhost:8000/
```
