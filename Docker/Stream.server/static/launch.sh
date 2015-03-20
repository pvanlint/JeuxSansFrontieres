#!/bin/bash

consul agent -server -bootstrap-expect 1 -data-dir /tmp/consul -config-dir /app/consul.d &
sleep 5
node /app/fx.js $1

