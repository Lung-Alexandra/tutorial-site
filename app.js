'use strict';
const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

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
        let segments = file.split('/');

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
const fileStructure = getFileStructure(__dirname + '/tutorial');

//rutele pt directoare
let routes = getRoutes(fileStructure);


// Configurare pentru a folosi Nunjucks pentru sabloane
nunjucks.configure('views', {
    autoescape: true,
    express: app
});


app.set('view engine', 'njk');

// Configurarea directorul pentru fisierele statice
app.use(express.static(path.join(__dirname, '/public')));
app.use('/tutorial', express.static(path.join(__dirname, '/tutorial')));

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
        if (!filePath.includes('.') || (filePath.includes('.') && filePath.endsWith('.md'))) {
            const components = filePath.split('/').slice(1);
            let currentLevel = menu;

            components.slice(0, -1).forEach(component => {
                let existingItem = currentLevel.find(item => item.text === component);
                const isActive = req.path.includes(component); // Verifica daca directorul este activ
                if (!existingItem) {
                    // Daca nu exista, il adaugam
                    existingItem = {
                        text: component.replace(/[-_]/g, ' '),
                        active: isActive,
                        items: []
                    };
                    currentLevel.push(existingItem);
                }
                currentLevel = existingItem.items;
            });

            const fileName = components[components.length - 1];
            const nameWithoutExtension = fileName.endsWith('.md') ? fileName.replace(/\.md$/, '') : fileName;
            let url = filePath.replace('tutorial', '/tutorial');
            currentLevel.push({
                text: nameWithoutExtension.replace(/[-_]/g, ' '),
                url: url.endsWith('.md') ? url.replace(/\.md$/, '') : url
            });
        }
    });
    res.locals.subdirectories = menu;
    next();
});


// routes
app.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});


app.get('/search', (req, res) => {
    const searchTerm = req.query.searchKeyword || ''; // Get search term from query parameter
    const results = [];

    // loop through all Markdown files
    fileStructure.forEach(file => {
        if (file.endsWith('.md')) {
            const fileContent = fs.readFileSync(file, 'utf-8').toLowerCase(); // Read and lowercase content

            // find all occurrences of the search term (case-insensitive)
            let startIndex = 0;
            const occurrences = [];
            while ((startIndex = fileContent.indexOf(searchTerm.toLowerCase(), startIndex)) !== -1) {
                const endIndex = startIndex + searchTerm.length;
                const surroundingText = extractSurroundingText(fileContent, startIndex, endIndex)
                const context = marked.marked(surroundingText);
                occurrences.push(
                    context
                );

                startIndex++; // move to next occurrence
            }

            if (occurrences.length) {
                const nameWithoutExtension = file.replace(/\.md$/, '');
                const url = nameWithoutExtension;
                results.push({ url, name: nameWithoutExtension.replace(/[-_]/g, ' '), context:occurrences });
            }
        }
    });

    res.render('search', { title: 'Search Results', term: searchTerm, results: results });
});


function extractSurroundingText(content, startIndex, endIndex) {

    const beforeLength = Math.max(startIndex - 50, 0);
    const afterLength = Math.min(endIndex + 50, content.length) - endIndex;

    return "..."+content.substring(beforeLength,  endIndex + afterLength)+"..." ;
}



fileStructure.forEach(file => {
    let filepath = file.replace('tutorial', '/tutorial');
    if (filepath.includes('.') && filepath.endsWith('.md')) {
        app.use(express.static(__dirname + filepath));
        const route = filepath.endsWith('.md') ? filepath.replace(/\.md$/, '') : filepath;
        app.get(route, (req, res) => {
            const namefile = route.split('/').pop().replace(/\.md$/, '').replace(/[-_]/g, ' ');
            res.locals.nameFile = namefile.charAt(0).toUpperCase() + namefile.slice(1);
            res.render('tutorial', {title: 'Tutorial', source: filepath});
        });
    }
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
