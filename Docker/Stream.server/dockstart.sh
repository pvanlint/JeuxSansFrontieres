#!/bin/bash

echo "Building containers"
docker build -t jeuxsf/fxserver .
docker build -t jeuxsf/fxtest -f Dockerfile.test .

echo "Starting server container"
id=`docker run -d jeuxsf/fxserver`

host=`docker inspect $id  | grep IPAddress | awk -F'"' '{print $4":3001";}'`

sleep 10
docker logs $id
echo "Starting test, connecting to $host"
testid=`docker run -d jeuxsf/fxtest $host`
docker logs -f $testid

echo
echo "Shutting down test: $testid"
docker kill $testid
echo "Shutting down server: $id"
docker kill $id

echo
echo "Showing docker ps"
docker ps

