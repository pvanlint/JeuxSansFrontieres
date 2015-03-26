#!/bin/bash

echo "Building containers"
docker build -t jeuxsf/fxserver .
docker build -t jeuxsf/fxtest -f Dockerfile.test .

echo "Starting server container"
id=`docker run -d -p $1:$1 jeuxsf/fxserver $1`

sleep 10
docker logs $id
service=`docker logs $id | grep "Service: " | awk '{print $2;}'`
echo "Starting test, connecting to $service"
testid=`docker run -d jeuxsf/fxtest $service`
docker logs -f $testid

echo
echo "Shutting down test: $testid"
docker kill $testid
echo "Shutting down server: $id"
docker kill $id

echo
echo "Showing docker ps"
docker ps

