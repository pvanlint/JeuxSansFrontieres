#!/bin/bash

echo "Building containers"
docker build -t jeuxsf/mongo -f Dockerfile.mongo .
    
echo "Starting mongodb"
docker run -d -p 27017:27017 -p 28017:28017 dockerfile/mongodb mongod --rest --httpinterface

sleep 2

echo "Loading data"
docker run jeuxsf/mongo

