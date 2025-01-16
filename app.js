const { createServer } = require('node:http');

const fs = require('fs');
const { log } = require('console');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
    res.statustCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (req.url === '/') {
        let overview = fs.readFileSync("./templates/overview.html", { encoding: 'utf8'});
        res.end(overview);
    } else if (req.url === "/product") {
        let product = fs.readFileSync("./templates/product.html", { encoding: 'utf8'});
        res.end(product);
    } else {
        res.statusCode = 404;
        res.end(`<h1>PAGE NOT FOUND</h1>`);
    }
    
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    // let details = `Server running at http://${hostname}:${port}/`;
    // fs.writeFileSync("./txt/final.txt", details);
});