docker build -t pvl1/fx .
docker build -f Dockerfile.2 -t pvl1/fx2 .

docker run -it pvl1/fx
docker run -d pvl1/fx2 3004

docker ps
docker logs <did>
docker inspect <did>

Why use EXPOSE
Why explicitly map ports on commnd line?

To connect, on server:
pauls-mbp:Node paulvanlint$ docker run -it pvl1/fx 
[root@1ffa061e7cf3 /]# nc -l 8000

On client:
docker ps
docker inspect <did>
find ip address
pauls-mbp:Node paulvanlint$ docker run -it pvl1/fx 
[root@1ffa061e7cf3 /]# nc <ip> 8000

Consul
======

Server:
pauls-mbp:Node paulvanlint$ docker run -it pvl1/fx 
[root@280b6277c328 /]# consul agent -server -bootstrap-expect 1 -data-dir /tmp/consul -config-dir /src/consul.d

Client:
pauls-mbp:Node paulvanlint$ docker run -it pvl1/fx 
[root@280b6277c328 /]# consul agent -data-dir /tmp/consul
[root@280b6277c328 /]# consul join <ip of server>

