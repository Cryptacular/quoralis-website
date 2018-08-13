const path = require('path');
const express = require('express');
const helmet = require('helmet')
const config = require('./config.json');

const app = express();

app.use(helmet());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates/pages'));

var port = config && config.PORT || 3000;

var router = express.Router();

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/:page', function(req, res) {
    res.render(req.params.page, (err, html) => {
        if (err) {
            res.status(404).render('404');
        } else {
            res.send(html);
        }
    });
});

app.use('/', router);

app.listen(port);
console.log(`Listening on port ${port}`);
