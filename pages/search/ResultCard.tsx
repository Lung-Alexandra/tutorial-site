import Link from "next/link";
import {Button, Card, CardHeader, Grid, Typography} from "@mui/material";
import {SearchResult} from "./SearchResults";

export class ResultCardState {
    title: string;
    url: string;
    snippets: string[];
    textToHighlight: string;

    constructor(searchResult: SearchResult, textToHighlight: string) {
        this.title = searchResult.title;
        this.url = searchResult.url;
        this.snippets = searchResult.snippets
        this.textToHighlight = textToHighlight;
    }
}

export default function  ResultCard(
    {state}: {state: ResultCardState}
) {

    return (
        <Card sx={{p:2}}>
            <CardHeader
                title={<Link href={state.url}>{state.title}</Link>}
            />


            <Grid container spacing={4}>
                {state.snippets.map((snippet, snippetIndex) => (
                    <Grid size={12}>
                        <Typography
                            variant={'body1'}
                            key={snippetIndex}
                            dangerouslySetInnerHTML={{
                                __html: highlightSearchTerm(snippet, state.textToHighlight),
                            }}
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container justifyContent="flex-end" spacing={2}>
                <Button variant="contained">
                    <Link href={state.url} legacyBehavior>
                        Către documentație
                    </Link>
                </Button>
            </Grid>
        </Card>

    )
}

function highlightSearchTerm(text: string, textToHighlight: string) {
    if (!text || !textToHighlight) return text;

    const regex = new RegExp(`(${textToHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}