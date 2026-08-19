import fs from 'fs';
import http from 'http';
import https from 'https';

let key =  fs.readFileSync(process.platform == 'freebsd' ? '/usr/local/etc/letsencrypt/live/koshelko.com/privkey.pem' : 'C:/Users/user/projects/resume/privkey.pem');
let cert = fs.readFileSync(process.platform == 'freebsd' ? '/usr/local/etc/letsencrypt/live/koshelko.com/fullchain.pem' : 'C:/Users/user/projects/resume/fullchain.pem');

https.createServer({key, cert}, (req, res) => {
  if (req.url == '/index.js') {
    res.writeHead(200, {
      'Content-Type': 'text/javascript; charset=utf-8'
    });

    return fs.createReadStream('./public/index.js').pipe(res);
  }

  if (req.url == '/index.js.map') {
    res.writeHead(200, {
      'Content-Type': 'text/javascript; charset=utf-8'
    });

    return fs.createReadStream('./public/index.js.map').pipe(res);
  }

  if (req.url == '/ru.pdf') {
    let stat = fs.statSync('./public/ru.pdf');
    let headers = {
      'Content-Type': 'application/pdf',
      'Content-Length': stat.size,
      'Content-Disposition': 'inline; filename="egor.koshelko.pdf"'
    };

    res.writeHead(200, headers);
    return fs.createReadStream('./public/ru.pdf').pipe(res);
  }

  if (req.url == '/en.pdf') {
    let stat = fs.statSync('./public/ru.pdf');
    let headers = {
      'Content-Type': 'application/pdf',
      'Content-Length': stat.size,
      'Content-Disposition': 'inline; filename="egor.koshelko.pdf"'
    };

    res.writeHead(200, headers);
    return fs.createReadStream('./public/en.pdf').pipe(res);
  }

  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  return fs.createReadStream('./public/index.html').pipe(res);
}).listen(443).on('listening', () => console.log('Sender listening'));

http.createServer((req, res) => {
  res.writeHead(301, {Location: 'https://' + req.headers.host + req.url});
  res.end();
}).listen(80);