#!/bin/bash

consul agent -server -bootstrap-expect 1 -data-dir /tmp/consul -config-dir /src/consul.d > /tmp/consul.log 2>&1 &

