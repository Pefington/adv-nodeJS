import http from 'http';

const server = http.createServer((req, res) => {
  console.log(req);
});

server.listen(3000);
