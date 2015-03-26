#/bin/bash

#id=`docker run -d --name node1 -h node1 progrium/consul -server -bootstrap-expect 3 -ui-dir /ui`
id=`docker run -d -h node1 progrium/consul -server -bootstrap-expect 3`

sleep 5

JOIN_IP=`docker inspect -f '{{.NetworkSettings.IPAddress}}' $id`

echo "Launched $id on $JOIN_IP"

id2=`docker run -d -h node2 progrium/consul -server -join $JOIN_IP`
id3=`docker run -d  -h node3 progrium/consul -server -join $JOIN_IP`

id=`docker run -d -p 8400:8400 -p 8500:8500 -p 8600:53/udp -h node4 progrium/consul -join $JOIN_IP`

