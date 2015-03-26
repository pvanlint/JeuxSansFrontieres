FROM    node:0.12.0

COPY static /app/
COPY consul /usr/bin/

RUN npm install -g node-gyp; cd /app; npm install
# Bundle app source
COPY src/fx.cc /app/fx.cc

RUN cd /app; node-gyp configure build

COPY src/fx.js /app/fx.js


#EXPOSE 3001
#8300 8301 8301/udp 8302 8302/udp 8400 8500 53/udp

ENTRYPOINT ["/app/launch.sh"]
