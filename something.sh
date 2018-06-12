#!/usr/bin/env bash

echo "=== Clearing cookies.txt"
rm -rf cookies.txt

echo
echo "=== GET /login to check if user is logged in"
curl -b cookies.txt -c cookies.txt http://localhost:4000/login

echo
echo "=== Try to add a recipe "
curl -X PUT -H "Content-Type: application/json" -d { "title":"this is a test", "time":"30", "desc":"this is a description"} \
 http://localhost:4000/recipe


echo
echo "=== POST /login logging in user blahuser"
curl -b cookies.txt -c cookies.txt -X POST -H "Content-Type: application/json" -d  '{ "name": "Corean", "username": "blahuser", "password": "password"}' \
  http://localhost:4000/login

echo
echo "=== GET /login to check if user is logged in"
curl -b cookies.txt -c cookies.txt http://localhost:4000/login

echo
echo "=== GET /logout to log out user"
curl -b cookies.txt -c cookies.txt http://localhost:4000/logout

echo
echo "=== GET /login to check if user is logged in"
curl -b cookies.txt -c cookies.txt http://localhost:4000/login
