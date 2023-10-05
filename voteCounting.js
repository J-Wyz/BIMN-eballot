const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.static('templates'));

app.post('/store_vote', (req, res) => {
    const data = req.body;
    fs.appendFile('votes.txt', JSON.stringify(data) + '\n', (err) => {
        if (err) throw err;
        console.log('Data stored successfully');
    });
    res.send('Data stored successfully');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
