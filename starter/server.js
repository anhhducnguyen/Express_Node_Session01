const { createServer } = require('node:http');
const fs  = require('fs');
const { log } = require('node:console');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
    res.statusCode = 200;

    // --------------Exercise 01----------------------------------------------------------------

    // res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    // let readThis = fs.readFileSync("../txt/read-this.txt", { encoding: 'utf8' });
    // console.log(readThis);
    // let input = fs.readFileSync("../txt/input.txt", { encoding: 'utf8'});
    // console.log(input);
    // let final = readThis + input;
    // fs.writeFileSync("../txt/final.txt", final);
    // console.log(final);

    // --------------Exercise 02 & Exercise 03 ---------------------------------------------------

    // https://github.com/anhhducnguyen/NodeJS/issues/1

    // --------------Exercise 04----------------------------------------------------------------

    // Khởi tạo một web server gửi về cho người dùng thông tin của toàn bộ file final.txt tại localhost, cổng 3000
    // res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    // let final = fs.readFileSync("./txt/final.txt", { encoding: 'utf8' });
    // console.log(final);
    // res.end(final);

    // --------------Exercise 05----------------------------------------------------------------

    // res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // if (req.url === '/') {
    //     let overview = fs.readFileSync("./templates/overview.html", { encoding: 'utf8'});
    //     res.end(overview);
    // } else if (req.url === "/product") {
    //     let product = fs.readFileSync("./templates/product.html", { encoding: 'utf8'});
    //     res.end(product);
    // } else {
    //     res.statusCode = 404;
    //     res.end(`<h1>PAGE NOT FOUND</h1>`);
    // }

    // --------------Exercise 06----------------------------------------------------------------
    res.setHeader('Content-Type', 'text/html; charset=utf');

    let data = fs.readFileSync("./dev-data/data.json", { encoding: 'utf8' });
    const dataParseJson = JSON.parse(data);
    console.log(dataParseJson);
    
    if (req.url === '/') {
        let overview = fs.readFileSync("./templates/overview.html", { encoding: 'utf8'});
        res.end(overview);
    } else if (req.url === "/product") {
        let product = fs.readFileSync("./templates/product.html", { encoding: 'utf8'});
        res.end(product);
    } else if (req.url === "/api") {
        res.setHeader('Content-Type', 'application/json'); // sử dụng định dạng cho json
        res.end(JSON.stringify(dataParseJson));
    } else if (req.url.startsWith("/api/")) {
        const id = req.url.split('/')[2];
        const product = dataParseJson.find((item) => item.id === parseInt(id));
        if (product) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(product));
        } else {
            res.statusCode = 404;
            res.end(`<h1>Product not found</h1>`);
        }
    } else {
        res.statusCode = 404;
        res.end(`<h1>PAGE NOT FOUND</h1>`);
    }  
        
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


