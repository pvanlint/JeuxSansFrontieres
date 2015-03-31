#!/bin/bash

host=`netstat -rn | egrep "^0\.0\.0\.0" | awk '{print $2;}'`

mongo $host < /data/a.dat

