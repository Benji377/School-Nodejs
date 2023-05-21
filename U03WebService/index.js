const express = require('express');
const app = express();

const xmlparser = require('express-xml-bodyparser');
app.use(xmlparser({ explicitRoot: false }));

app.use('/movie', movieRouter);
app.get('/', (request, response) => response.redirect('/movie'));
app.use(express.static(__dirname));
app.listen(8080, () => console.log('Server listen on port 8080'));
