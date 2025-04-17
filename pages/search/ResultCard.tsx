import React from 'react';
import Link from 'next/link';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Typography,
    Divider, // Import Divider from MUI
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { SearchResult } from './SearchResults';

export class ResultCardState {
    title: string;
    url: string;
    snippets: string[];
    textToHighlight: string;

    constructor(searchResult: SearchResult, textToHighlight: string) {
        this.title = searchResult.title;
        this.url = searchResult.url;
        this.snippets = searchResult.snippets;
        this.textToHighlight = textToHighlight;
    }

    // Method to extract folder name from the URL
    getFolderName() {
        // Assuming the folder is part of the URL path (e.g., /folder/tutorial-page)
        const urlParts = this.url.split('/');
        return urlParts.length > 1 ? urlParts[urlParts.length - 2] : '';
    }
}

interface ResultCardProps {
    state: ResultCardState;
}

const ResultCard: React.FC<ResultCardProps> = ({ state }) => {
    const folderName = state.getFolderName();

    return (
        <Card elevation={3} sx={{ p: 1, borderRadius: 3, width: '100%', maxWidth: 'none' }}>
            <CardHeader
                title={
                    <Typography
                        component={Link}
                        href={state.url}
                        variant="h6"
                        color="primary"
                        sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                        {state.title}
                    </Typography>
                }
                subheader={folderName && (
                    <Typography variant="body2" color="text.secondary">
                        {folderName}
                    </Typography>
                )}
            />

            <CardContent sx={{ pt: 1 }}>
                <Grid container spacing={2}>
                    {state.snippets.map((snippet, index) => (
                        <Grid key={index} sx={{ width: '100%' }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                dangerouslySetInnerHTML={{
                                    __html: highlightSearchTerm(snippet, state.textToHighlight),
                                }}
                            />
                            {index < state.snippets.length - 1 && <Divider sx={{ my: 2 }} />}
                        </Grid>
                    ))}
                </Grid>

                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button
                        variant="outlined"
                        endIcon={<OpenInNewIcon />}
                        component={Link}
                        href={state.url}
                    >
                        Către documentație
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ResultCard;

function highlightSearchTerm(text: string, textToHighlight: string): string {
    if (!text || !textToHighlight) return text;

    const terms = textToHighlight.split(/\s+/).filter(Boolean); // Split the search term into multiple words
    terms.forEach((term) => {
        const regex = new RegExp(
            `(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
            'gi'
        );
        text = text.replace(regex, '<mark>$1</mark>');
    });

    return text;
}
