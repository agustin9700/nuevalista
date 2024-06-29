const express = require('express');
const app = express();
const path = require('path');
const { ejecutarProcesoVariasVeces } = require('./public/javascript/webscrapping');
const { ejecutarProcesoVariasVeces2 } = require('./public/javascript/webscrapping2');

app.use(express.static(path.join(__dirname)));
ejecutarProcesoVariasVeces()
ejecutarProcesoVariasVeces2()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,("./index.html")))
});

app.listen(3030,() => console.log("Levantando un servidor con Express"));


