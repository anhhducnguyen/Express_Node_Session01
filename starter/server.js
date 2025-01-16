const { createServer } = require('node:http');
const fs  = require('fs');
const { log } = require('node:console');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    
    // let readThis = fs.readFileSync("../txt/read-this.txt", { encoding: 'utf8' });
    // console.log(readThis);

    // let input = fs.readFileSync("../txt/input.txt", { encoding: 'utf8'});
    // console.log(input);

    // let final = readThis + input;

    // fs.writeFileSync("../txt/final.txt", final);
    // console.log(final);

    // Khởi tạo một web server gửi về cho người dùng thông tin của toàn bộ file final.txt tại localhost, cổng 3000
    // res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    // let final = fs.readFileSync("./txt/final.txt", { encoding: 'utf8' });
    // console.log(final);
    // res.end(final);
    
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
});

// 1. readFile() – Đọc file bất đồng bộ

// # Mô tả: Hàm `readFile()` dùng để đọc nội dung một file bất đồng bộ trong Node.js.
// # Cú pháp: fs.readFile(path, options, callback)
// # - path: Đường dẫn file cần đọc.
// # - options: Mã hóa dữ liệu ('utf-8' để trả kết quả dưới dạng string).
// # - callback: Hàm nhận 2 tham số:
// #   + err: Lỗi nếu có.
// #   + data: Nội dung file nếu đọc thành công.


// 2. writeFile() – Ghi file bất đồng bộ

// # Mô tả: Hàm `writeFile()` dùng để ghi nội dung vào file bất đồng bộ trong Node.js.
// # Cú pháp: fs.writeFile(path, data, options, callback)
// # - path: Đường dẫn file cần ghi.
// # - data: Dữ liệu cần ghi vào file (chuỗi hoặc Buffer).
// # - options: Mã hóa (ví dụ: 'utf-8') hoặc mode file.
// # - callback: Hàm nhận 1 tham số:
// #   + err: Lỗi nếu có khi ghi file.
