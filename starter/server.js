const { createServer } = require('node:http');
const fs = require('fs');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

// Đọc dữ liệu JSON
let data;
try {
    data = JSON.parse(fs.readFileSync("./dev-data/data.json", "utf8"));
} catch (error) {
    console.error("Lỗi đọc file JSON:", error.message);
    process.exit(1); 
}

const singleProductTemplate = fs.readFileSync("./templates/single-product.html", "utf8");
const overviewTemplate = fs.readFileSync("./templates/overview.html", "utf8");
const productTemplate = fs.readFileSync("./templates/product.html", "utf8");
const searchTemplate = fs.readFileSync("./templates/search.html", "utf8");
const createProductTemplate = fs.readFileSync("./templates/create.html", "utf8");

const server = createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;

    res.setHeader('Content-Type', 'text/html; charset=utf8');

    if (req.url === '/' || req.url === '/overview') {

        try {
            data = JSON.parse(fs.readFileSync("./dev-data/data.json", "utf8"));
        } catch (error) {
            console.error("Lỗi đọc file JSON:", error.message);
            process.exit(1); 
        }

        const productListHtml = data.map(product =>
            singleProductTemplate
                .replaceAll("{{productName}}", product.productName)
                .replaceAll("{{quantity}}", product.quantity)
                .replaceAll("{{image}}", product.image)
                .replaceAll("{{image1}}", product.image)
                .replaceAll("{{price}}", product.price)
                .replaceAll("{{id}}", product.id)
        ).join("");

        const pageHtml = overviewTemplate.replace("{{content}}", productListHtml);
        res.statusCode = 200;
        res.end(pageHtml);

    } else if (req.url.startsWith("/product/")) {
        const id = req.url.split("/")[2];
        const product = data.find(p => p.id === +id);

        if (product) {
            const productHtml = productTemplate
                .replaceAll("{{organic}}", product.organic ? "Organic" : "Inorganic")
                .replaceAll("{{image}}", product.image)
                .replaceAll("{{productName}}", product.productName)
                .replaceAll("{{from}}", product.from)
                .replaceAll("{{nutrients}}", product.nutrients)
                .replaceAll("{{quantity}}", product.quantity)
                .replaceAll("{{price}}", Number(product.price).toFixed(2))
                .replaceAll("{{description}}", product.description);

            res.setHeader('Content-Type', 'text/html');
            res.end(productHtml);
        } else {
            res.statusCode = 404;
            res.end("<h1>Product not found</h1>");
        }

    } else if (req.url.startsWith("/api")) {
        res.setHeader('Content-Type', 'application/json');
        const id = req.url.split("/")[2];

        if (!id) {
            res.end(JSON.stringify(data));
        } else {
            const product = data.find(p => p.id === id || p.id === +id);
            res.end(JSON.stringify(product || { message: "Product not found" }));
        }
    } else if (req.url.startsWith("/search")) {
        if (!query.p) {
            res.statusCode = 400;
            console.log("Invalid query string passed to search");
            const searchHtml = searchTemplate.replace("{{message}}", "Find your products");
            res.setHeader('Content-Type', 'text/html');
            res.end(searchHtml);
            return;
        }

        const searchQuery = query.p;
        const filteredData = data.filter(p => p.productName.toLowerCase().includes(searchQuery.toLowerCase()));
        
        if (filteredData.length > 0) {
            const foundProduct = filteredData[0];

            res.writeHead(302, { "Location": `/product/${foundProduct.id}` });
            res.end();
        } else {
            const searchHtml = searchTemplate.replace("{{message}}", "NOT FOUND");
            res.end(searchHtml);
        }
    } else if (req.url.startsWith("/create")) {
        if (req.method === "POST") {
            let data = "";

            req.on("error", (err) => {
                console.error("Lỗi khi nhận request:", err);
            });

            req.on("data", (chunk) => {
                data += chunk.toString();
            });

            req.on("end", () => {
                let products = JSON.parse(fs.readFileSync('./dev-data/data.json', "utf8"));

                const queryString = url.parse(`/?${data}`, true).query;
                const newProduct = {
                    id: products.length + 1,
                    productName: queryString.productName,
                    image: queryString.image,
                    from: queryString.from,
                    nutrients: queryString.nutrients,
                    quantity: queryString.quantity,
                    price: queryString.price,
                    organic: queryString.organic === "on",
                    description: queryString.description,
                };

                products.push(newProduct);
                fs.writeFileSync('./dev-data/data.json', JSON.stringify(products, null, 2));

                res.writeHead(302, { Location: "/" });
                res.end();
            });
        } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(createProductTemplate);
        }
    }    
    else {
        res.statusCode = 404;
        res.end("<h1>PAGE NOT FOUND</h1>");
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
