import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import {parseFilename} from "../../util/FileUtils";

// Calea către directorul cu tutoriale
const tutorialDir = path.join(process.cwd(), 'tutorial');

// Index pentru căutare
const searchIndex = {};
const contentCache = {};

// Construim indexul de căutare
function buildSearchIndex() {
    try {
        if (!fs.existsSync(tutorialDir)) {
            return;
        }

        function indexDirectory(dir, basePath = '') {
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    // Dacă este director, scanăm recursiv
                    indexDirectory(filePath, path.join(basePath, file));
                } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
                    try {
                        // Citim conținutul fișierului
                        const content = fs.readFileSync(filePath, 'utf8');
                        const { data, content: markdownContent } = matter(content);
                        const plainText = markdownContent.toLowerCase();

                        // URL pentru acest fișier
                        const urlPath = `/${path.join(basePath, file.replace(/\.mdx?$/, ''))}`
                            .replace(/\\/g, '/')
                            .replace(/\/+/g, '/');

                        // Stocăm conținutul pentru extragerea contextului mai târziu
                        contentCache[urlPath] = {
                            content: plainText,
                            title: parseFilename(file)
                        };

                        // Indexăm fiecare cuvânt din conținut
                        plainText.split(/\s+/).forEach(word => {
                            if (word.length > 2) {
                                if (!searchIndex[word]) {
                                    searchIndex[word] = [];
                                }

                                if (!searchIndex[word].includes(urlPath)) {
                                    searchIndex[word].push(urlPath);
                                }
                            }
                        });
                    } catch (error) {
                        console.error(`Error indexing file ${filePath}:`, error);
                    }
                }
            }
        }

        // Începem indexarea de la directorul tutorial
        indexDirectory(tutorialDir, 'tutorial');
    } catch (error) {
        console.error('Error building search index:', error);
    }
}

// Funcție pentru a extrage contextul în jurul cuvântului căutat
function extractRelevantSnippets(content, searchTerm, maxSnippets = 3, snippetLength = 150) {
    searchTerm = searchTerm.toLowerCase();
    const contentLower = content.toLowerCase();
    const matches = [];
    let lastIndex = 0;
    let count = 0;

    // Găsește toate aparițiile cuvântului în conținut
    while (lastIndex !== -1 && count < maxSnippets) {
        lastIndex = contentLower.indexOf(searchTerm, lastIndex + 1);

        if (lastIndex !== -1) {
            // Calculăm un context în jurul cuvântului
            const start = Math.max(0, lastIndex - snippetLength / 2);
            const end = Math.min(content.length, lastIndex + searchTerm.length + snippetLength / 2);

            // Extragem contextul și asigurăm că începe și se termină cu cuvinte complete
            let snippet = content.substring(start, end);

            // Adăugăm elipse la început și sfârșit dacă nu suntem la marginile textului
            if (start > 0) snippet = '...' + snippet;
            if (end < content.length) snippet = snippet + '...';

            // Verifică dacă acest snippet se suprapune cu unul anterior
            const overlapWithPrevious = matches.some(existing => {
                return (start >= existing.start && start <= existing.end) ||
                    (end >= existing.start && end <= existing.end);
            });

            if (!overlapWithPrevious) {
                matches.push({
                    snippet,
                    start,
                    end,
                    relevance: contentLower.substring(start, end).split(searchTerm).length - 1
                });
                count++;
            }

            // Avansăm indexul pentru a evita găsirea aceluiași cuvânt
            lastIndex += searchTerm.length;
        }
    }

    // Sortăm bucățile după relevanță
    matches.sort((a, b) => b.relevance - a.relevance);

    // Returnăm doar snippet-urile
    return matches.map(match => match.snippet);
}

export default function handler(req, res) {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // Construiește indexul dacă este gol
        if (Object.keys(searchIndex).length === 0) {
            buildSearchIndex();
        }

        // Împărțim termenul de căutare în cuvinte
        const searchTerms = q.toLowerCase().split(/\s+/).filter(term => term.length > 2);

        if (searchTerms.length === 0) {
            return res.status(400).json({ error: 'Search query must contain words with at least 3 characters' });
        }

        // Map pentru a ține evidența frecvenței fiecărui document
        const documentFrequency = {};

        // Pentru fiecare termen, găsim documentele care îl conțin
        searchTerms.forEach(term => {
            const matchingDocs = Object.keys(searchIndex).filter(indexTerm =>
                indexTerm.includes(term)
            ).flatMap(indexTerm => searchIndex[indexTerm]);

            // Incrementăm frecvența pentru fiecare document
            matchingDocs.forEach(doc => {
                documentFrequency[doc] = (documentFrequency[doc] || 0) + 1;
            });
        });

        // Sortăm documentele după frecvența de apariție a termenilor
        const sortedDocs = Object.keys(documentFrequency)
            .sort((a, b) => documentFrequency[b] - documentFrequency[a]);

        // Construim rezultatele cu context
        const results = sortedDocs.map(doc => {
            const { content, title } = contentCache[doc];
            const snippets = extractRelevantSnippets(content, q);

            // Folosim marked pentru a converti snippets la HTML, păstrând formatarea
            const formattedSnippets = snippets.map(snippet =>
                marked(snippet, { breaks: true })
            );

            return {
                url: doc,
                title: title,
                snippets: formattedSnippets
            };
        });

        res.status(200).json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'An error occurred while searching' });
    }
} 