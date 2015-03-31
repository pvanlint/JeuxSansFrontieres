#!/bin/bash

/consul/consul agent -server -bootstrap-expect 1 -data-dir /tmp/consul -config-dir /consul/consul.d

