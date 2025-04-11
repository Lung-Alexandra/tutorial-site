import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Alert, Box, Button, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import ResultCard, { ResultCardState } from "./ResultCard";
import { getNavigation } from '../../lib/navigation';
import Layout from '../../components/Layout.tsx';

export interface SearchResult {
    title: string;
    url: string;
    snippets: string[];
}

export default function SearchPage({ navigation, initialResults = [], initialQuery = '' }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState<string>(initialQuery);
    const [results, setResults] = useState<SearchResult[]>(initialResults);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (router.query.q) {
            const query = router.query.q as string;
            setSearchTerm(query);
            performSearch(query);
        }
    }, [router.query.q]);

    const performSearch = async (query: string) => {
        if (!query) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Search request failed');
            const data = await response.json();
            setResults(data);
        } catch {
            setError('An error occurred while searching. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout
            nav={navigation}
            metadata={{
                title: `Search Results for "${searchTerm}"`,
                description: `Search results for "${searchTerm}" in our tutorials`,
            }}
        >
            <Box sx={{ px: 3, py: 4, width: '100%' }}>
                <Typography variant="h4" gutterBottom>Search Results</Typography>

                <Box component="form" sx={{ display: 'flex', gap: 2 }} onSubmit={(e) => {
                    e.preventDefault();
                    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
                }}>
                    <TextField
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tutorials..."
                        label="Search"
                    />
                    <Button type="submit"  variant="contained">
                        Search
                    </Button>
                </Box>

                <Box>
                    {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> :
                        results.length ? (
                            <>
                                <Typography variant="subtitle1">Found {results.length} document(s)</Typography>
                                <Grid container spacing={4}>
                                    {results.map((result, index) => (
                                        <Grid item key={index} xs={12}>
                                            <ResultCard state={new ResultCardState(result, searchTerm)} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        ) : <Typography>No results found for "{searchTerm}"</Typography>}
                </Box>
            </Box>
        </Layout>
    );
}

export async function getServerSideProps({ query }) {
    const q = query.q || '';
    let initialResults = [];

    const navigation = getNavigation();

    if (q) {
        try {
            const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
            const host = process.env.VERCEL_URL || 'localhost:3000';
            const apiUrl = `${protocol}://${host}/api/search?q=${encodeURIComponent(q)}`;
            const response = await fetch(apiUrl);
            if (response.ok) initialResults = await response.json();
        } catch {
            console.error('Error fetching search results on server');
        }
    }

    return { props: { navigation, initialResults, initialQuery: q } };
}
