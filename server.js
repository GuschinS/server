const port = process.env.PORT || 3000;
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/addData') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const jsonData = JSON.parse(body);
                console.log('jsonData: ', jsonData)
                fs.readFile('data.json', 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        return;
                    }

                    let dataArray = JSON.parse(data);
                    dataArray.push(jsonData);

                    fs.writeFile('data.json', JSON.stringify(dataArray), 'utf8', (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                            return;
                        }

                        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                        res.end(JSON.stringify({ message: 'Data added successfully' }));
                    });
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
                return;
            }
        });
    } else if (req.method === 'GET' && req.url === '/getData') {
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(data);
        });
    } else if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Server is running successfully!</h1>');
    }
else if (req.method === 'DELETE' && req.url === '/deleteData') {
    // Удаление всех данных
    fs.writeFile('data.json', '[]', 'utf8', (err) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ message: 'All data deleted successfully' }));
    });
}
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    const successMessage = `
        <html>
        <head><title>Server Running</title></head>
        <body>
            <h1>Server is running successfully!</h1>
            <p>Server is listening on port ${port}</p>
        </body>
        </html>
    `;
    http.get(`http://localhost:${port}`, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            console.log(data);
        });
    }).on('error', (error) => {
        console.error(`Error accessing localhost: ${error.message}`);
    });
});

