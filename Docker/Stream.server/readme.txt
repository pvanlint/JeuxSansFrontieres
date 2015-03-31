Docker networking, running on a MacBook with boot2docker installed on VirtualBox
Open 3 shells on Mac, named ncdemo1, ncdemo2 and control.
Make sure all have the docker env vars set.
In Mac shell 'ncdemo1':
$ cd /Users/paulvanlint/docker/Node
$ docker build -t pvl1/ncdemo -f Dockerfile.shell .
$ docker run -h ncdemo1 -it pvl1/ncdemo
Inside docker shell:
    $ nc -l 99

In Mac shell 'control':
$ docker ps
$ docker inspect <id>
#get ip address
$ docker logs -f <id>

In shell 'ncdemo2':
$ docker run -ncdemo2 -it pvl1/ncdemo
Inside docker shell:
    $ nc <ip> 99


In shell 'ncdemo1':
$ docker run -p 9990:99 -it pvl1/ncdemo
This maps internal port 99 of the container to port 9990 of the docker host.
Inside docker shell:
    $ nc -l 99

In shell 'ncdemo2':
$ docker run -it pvl1/ncdemo
Inside docker shell:
    $ nc 172.17.42.1 9990

Show VirtualBox setting, mapping port 9990 of the docker container inside VirtualBox to port 9999 on my host MacBook.
In shell 'control':
$ nc localhost 9999

So, recapping, port 99 inside the container is being tunnelled to port 9990 on the docker host, which is being tunnelled to port 9999 outside VirtualBox.


The following shows a Node c++ demo, where the 
cd /Users/paulvanlint/src/JeuxSansFrontieres/Docker/Stream.server
show Dockerfile
Talk about node package and node-gyp and docker build cache
show static/binding.gyp
show fx.js and fx.cc
show dockstart.sh
$ ./dockstart.sh 3001



Consul demo
In consul shell:
cd /Users/paulvanlint/src/JeuxSansFrontieres/Docker/consul

Talk about consultest.sh

Inbrowser, go to http://localhost:8500




