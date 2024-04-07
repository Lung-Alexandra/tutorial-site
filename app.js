'use strict';
const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const lunr = require('lunr');


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
        structure.push(cale.replace('tutorial', '/tutorial'));
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
                mdRoutes.push(subRoute);
            }
        }
    });
    return mdRoutes.filter((item, index) => mdRoutes.indexOf(item) === index).sort((a, b) => b.length - a.length);
}

//stuctura directoare
const fileStructure = getFileStructure(__dirname + '/tutorial');

//rutele pt directoare
let routes = getRoutes(fileStructure);

const data = []

// Indexing function to create a Lunr.js index for search
function createIndex() {
    return lunr(function () {
        this.ref('url');
        this.field('title');
        this.field('content');
        // this.pipeline.add(lunr.trimmer, lunr.stemmer);
        // this.searchPipeline.add(lunr.stemmer)
        this.tokenizer.separator = /(?:[_/]|\s|-)/;
        this.metadataWhitelist = ['position']
        fileStructure.forEach(file => {
            if (file.endsWith('.md')) {
                const markdown = fs.readFileSync(__dirname + file, 'utf8');
                const title = path.basename(file, '.md');
                data.push({title: title, content: lunr.tokenizer(markdown)});
                this.add({url: file, title: title, content: markdown});

            }
        });
    });
}

// Create the Lunr.js index
const index = createIndex();
// fs.writeFileSync('index.json', JSON.stringify(index));
// fs.writeFileSync('data.json', JSON.stringify(data));

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
            const components = filePath.split('/').slice(1).filter(element => element !== "tutorial");
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
            let url = filePath.endsWith('.md') ? filePath.replace(/\.md$/, '') : filePath;
            currentLevel.push({
                text: nameWithoutExtension.replace(/[-_]/g, ' '),
                url: url
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


// Search endpoint
app.get('/search', (req, res) => {
    const query = req.query.searchKeyword || '';
    const results = index.search(query);

    const searchResults = results.map(result => {
        const cont = []
        const filePath = result.ref;
        const title = path.basename(filePath, '.md');
        const content = data.find(item => item.title === title).content
        // const ind = content.findIndex(token => token.str === query);
        const ind = content.reduce(function (a, token, i) {
            if (token.str === query)
                a.push(i);
            return a;
        }, []);
        ind.forEach(ind => {
            const windowSize = 4;
            const start = ind - windowSize >= 0 ? ind - windowSize : 0
            const end = ind + windowSize + 1 < content.length ? ind + windowSize + 1 : content.length
            const context = content.slice(start, end).join(" ")
            cont.push(context)
        });
        return {title, url: filePath.replace('.md', ''), context: cont};
    });
    res.render('search', {title: 'Search Results', term: query, results: searchResults});
});

fileStructure.forEach(file => {
    let filepath = file;
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
