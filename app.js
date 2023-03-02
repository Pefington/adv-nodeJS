import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method
  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write(
      '<body> <form action="/message" method="post"> <input type="text" name="message"/> <button type="submit">Send</button>  </form> </body>'
    );
    res.write('</html>');
    return res.end();
  }
  if (url === '/message' && method === 'post') {
    fs.writeFile('message.txt', 'dummy');
    res.statusCode = 302;
    res.setHeader('location', '/');
    return res.end();
  }
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write(
    '<body> <form action="/message" method="post"></form> <input type="text" name="message"/> </body>'
  );
  res.write('</html>');
  return res.end();
});

server.listen(3000);
