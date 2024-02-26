const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Configurarea directorul pentru fisierele statice
app.use(express.static(path.join(__dirname, '/public')));

app.use(function (req, res, next) {
    res.locals.isActive = function (path) {
        return req.path === path ? 'active' : '';
    };
    next();
});


// Middleware pentru a furniza subdirectoarele
app.use(function (req, res, next) {
    const match = req.path.match(/^\/tutorial\/([^\/]*)/);
    if (match) {
        // Obține partea din cale după 'tutorial/'
        const subPath = match[1];
        // Calea spre directorul "resurse" + subdirectorul specific
        const resourcesDir = path.join(__dirname, '/resources/', subPath);
        const files = fs.readdirSync(resourcesDir);

        res.locals.subdirectories = files.filter(file => fs.statSync(path.join(resourcesDir, file)).isFile());
        next();

    } else {
        // Calea spre directorul "resurse"
        const resourcesDir = path.join(__dirname, '/resources');

        // Citeste subdirectoarele din directorul "resurse"
        const files = fs.readdirSync(resourcesDir);
        res.locals.subdirectories = files.filter(file => fs.statSync(path.join(resourcesDir, file)).isDirectory());
        next();
    }
});


// Configurare pentru a folosi Nunjucks pentru sabloane
nunjucks.configure('views', {
    autoescape: true,
    express: app
});


app.set('view engine', 'njk');


// rutele
app.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});

app.get('/tutorial', (req, res) => {
    console.log(res.locals.subdirectories)
    res.render('tutorial', {title: 'Tutorial'});
});

app.get('/tutorial/:subdirector/', (req, res) => {
    res.render('tutorial', {title: 'Tutorial'});
});

app.get('/materials', (req, res) => {
    res.render('materials', {title: 'Materials'});
});


// Pornirea serverului
app.listen(PORT, () => {
    console.log(`Server adresa http://localhost:${PORT}`);
});
