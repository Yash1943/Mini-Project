const express = require('express');
const app = express();

app.get('/', function (request, response) {
    response.send('Hello World')
})

app.listen(3000, () => {
    console.log("The server is started at 3000 port")
}) 