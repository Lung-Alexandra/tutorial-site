import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Link from 'next/link';
import { getNavigation } from '../lib/navigation';
import {Button, Grid} from "@mui/material";
import ResultCard, {ResultCardState} from "./search/ResultCard";

// Funcție pentru evidențierea termenului căutat

export interface SearchResult {
    title: string;
    url: string;
    snippets: string[];
}

export default function Search({ navigation, initialResults = [], initialQuery = '' }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState<string>(initialQuery);
    const [results, setResults] = useState<SearchResult[]>(initialResults);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Efectuăm căutarea atunci când query-ul se schimbă
    useEffect(() => {
        const query = router.query.q;

        if (query) {
            setSearchTerm(query);
            performSearch(query);
        }
    }, [router.query.q]);

    // Funcție pentru efectuarea căutării
    const performSearch = async (query) => {
        if (!query) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error('Search request failed');
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            console.error('Search error:', err);
            setError('An error occurred while searching. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout nav={navigation} metadata={{ title: `Search Results for "${searchTerm}"`, description: `Search results for "${searchTerm}" in our tutorials` }}>
            <div className="search-page">
                <h1>Search Results</h1>

                {/* Afișăm formularul de căutare pentru a permite căutări noi */}
                <form
                    className="search-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
                    }}
                >
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tutorials..."
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>

                {/* Afișăm rezultatele */}
                <div className="search-results">
                    {loading ? (
                        <p className="loading">Searching...</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : results.length > 0 ? (
                        <>
                            <p className="results-count">Found {results.length} document(s) for "{searchTerm}"</p>
                            <div className="results-list">
                                {results.map((result, index) => (
                                    <ResultCard state={new ResultCardState(result, searchTerm)} key={index}/>
                                ))}
                            </div>
                        </>
                    ) : searchTerm ? (
                        <p className="no-results">No results found for "{searchTerm}"</p>
                    ) : null}
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps({ query }) {
    const q = query.q || '';
    let initialResults = [];

    // Obținem structura de navigare
    const navigation = await getNavigation();

    // Realizăm căutarea inițială pe server dacă avem un termen de căutare
    if (q) {
        try {
            // URL-ul API trebuie să fie absolut pe server
            const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
            const host = process.env.VERCEL_URL || 'localhost:3000';
            const apiUrl = `${protocol}://${host}/api/search?q=${encodeURIComponent(q)}`;

            const response = await fetch(apiUrl);

            if (response.ok) {
                initialResults = await response.json();
            }
        } catch (error) {
            console.error('Error fetching search results on server:', error);
        }
    }

    return {
        props: {
            navigation,
            initialResults,
            initialQuery: q
        }
    };
} 