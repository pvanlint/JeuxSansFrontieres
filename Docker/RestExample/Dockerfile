FROM    node:0.12.0

COPY static /app/

RUN cd /app; npm install
# Bundle app source

COPY src/app.js /app/app.js


ENTRYPOINT ["node", "/app/app.js"]
