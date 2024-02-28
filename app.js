'use strict';
const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');
const mark =  require('markdown-it')();
const bodyParser = require('body-parser');
const serverless = require('serverless-http');

const PORT = process.env.PORT || 3000;

function* walkSync(dir) {
    const files = fs.readdirSync(dir, {withFileTypes: true});
    for (const file of files) {
        if (file.isDirectory()) {
            yield* walkSync(path.join(dir, file.name));
        } else {
            yield path.join(dir, file.name);
        }
    }
}

function getFileStructure(dirpath) {
    let structure = []
    for (const x of walkSync(dirpath)) {
        let cale = path.relative(__dirname, x).split(path.sep).join('/')
        structure.push(cale);
    }
    return structure;
}

function getRoutes(fileStr) {
    const mdRoutes = []
    fileStr.forEach(file => {
        let route = file.replace('resources', 'tutorial');
        let segments = route.split('/');

        // Construiește rute pentru fiecare segment intermediar
        for (let i = 2; i <= segments.length; i++) {
            let subRoute = segments.slice(0, i).join('/');
            if (!mdRoutes.includes(subRoute) && !subRoute.endsWith('.md')) {
                    mdRoutes.push(subRoute.replace('tutorial', '/tutorial'));
                }
            }
    });
    return mdRoutes.filter((item, index) => mdRoutes.indexOf(item) === index).sort((a, b) => b.length - a.length);
}

//stuctura directoare
const fileStructure = getFileStructure(__dirname + '/resources');

//rutele pt directoare
let routes = getRoutes(fileStructure);

// console.log(fileStructure)
// console.log(routes)


// Configurare pentru a folosi Nunjucks pentru sabloane
nunjucks.configure('views', {
    autoescape: true,
    express: app
});


app.set('view engine', 'njk');

// Configurarea directorul pentru fisierele statice
app.use(express.static(path.join(__dirname, '/public')));

app.use(function (req, res, next) {
    res.locals.isActive = function (path) {
        if (path === '/') {
            return req.path === '/' && req.path.length === 1 ? 'active' : '';
        } else {
            return req.path.includes(path) ? 'active' : '';
        }
    };
    next();
});


// Middleware pentru a furniza subdirectoarele
app.use(function (req, res, next) {
    const menu = [];

    fileStructure.forEach(filePath => {
        const components = filePath.split('/').slice(1);
        let currentLevel = menu;

        components.slice(0, -1).forEach(component => {
            // Verificăm dacă componentul există deja în meniu
            let existingItem = currentLevel.find(item => item.text === component);
            const isActive = req.path.includes(component); // Verifică dacă directorul este activ
            if (!existingItem) {
                // Dacă nu există, îl adăugăm
                existingItem = {
                    text: component,
                    active: isActive,
                    items: []
                };
                currentLevel.push(existingItem);
            }
            currentLevel = existingItem.items;
        });

        const fileName = components[components.length - 1];
        const nameWithoutExtension = fileName.endsWith('.md') ? fileName.replace(/\.md$/, '') : fileName;

        currentLevel.push({
            text: nameWithoutExtension,
            url: filePath.replace('resources','/tutorial')
        });
    });
    res.locals.subdirectories = menu;
    next();
});


// rutele
app.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});


fileStructure.forEach(file => {
    const route ='/'+  file.replace('resources','tutorial');

    app.get(route, (req, res) => {
        res.locals.nameFile = file.split('/').pop();
        const data = fs.readFileSync(__dirname + '/' +file, 'utf8');
        const cont = mark.render(data);
        res.render('tutorial', {title: 'Tutorial', content: cont});
    });
});


routes.forEach(route => {
    app.get(route, (req, res) => {
        res.render('tutorial', {title: 'Tutorial'});
    });
});

app.get('/tutorial', (req, res) => {
    res.render('tutorial', {title: 'Tutorial'});

});


app.get('/materials', (req, res) => {
    res.render('materials', {title: 'Materials'});
});


// // Pornirea serverului
app.listen(PORT, () => {
    console.log(`Server adresa http://localhost:${PORT}`);
});


module.exports = app;





