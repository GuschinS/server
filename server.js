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

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Data added successfully' }));
                    });
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
                return;
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// const express = require('express');
// const fs = require('fs');
// const app = express();
// const bodyParser = require('body-parser');
//
// app.use(bodyParser.json())
//
// app.post('/', (req, res) => {
//     let jsonData = [];
//
//     fs.readFile('data.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Error reading file');
//         } else {
//             try {
//                 jsonData = JSON.parse(data);
//                 console.log('jsonData :', jsonData)
//             } catch (parseError) {
//                 console.error(parseError);
//             }
//
//             const newData = req.body;
//             console.log('req.body: ', req.body)
//             if (newData) {
//                 jsonData.push(newData);
//
//                 // Запись новых данных в файл data.json
//                 fs.writeFile('data.json', JSON.stringify(jsonData), 'utf8', (writeErr) => {
//                     if (writeErr) {
//                         console.error(writeErr);
//                         res.status(500).send('Error writing to file');
//                     } else {
//                         res.status(200).send('Data added to file');
//                     }
//                 });
//             } else {
//                 res.status(400).send('No data received');
//             }
//         }
//     });
// });
//
// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });
