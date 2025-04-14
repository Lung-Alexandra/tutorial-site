import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";
import ResultCard, { ResultCardState } from "./ResultCard";

export interface SearchResult {
    title: string;
    url: string;
    snippets: string[];
}

interface Props {
    results: SearchResult[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
}

export default function SearchResults({ results, loading, error, searchTerm }: Props) {
    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (results.length === 0) return <Typography>No results found for "{searchTerm}"</Typography>;

    return (
        <Box>
            <Typography variant="subtitle1" gutterBottom>
                Found {results.length} document(s)
            </Typography>
            <Grid container spacing={4}>
                {results.map((result, index) => (
                    <Grid xs={12} key={index}>
                        <ResultCard state={new ResultCardState(result, searchTerm)} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
