import Link from "next/link";
import {Button, Card, CardHeader, Grid} from "@mui/material";
import {SearchResult} from "../search";

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


            <Grid container>
                {state.snippets.map((snippet, snippetIndex) => (
                    <div
                        key={snippetIndex}
                        dangerouslySetInnerHTML={{
                            __html: highlightSearchTerm(snippet, state.textToHighlight),
                        }}
                    />
                ))}
            </Grid>

            <Grid container justifyContent="flex-end" spacing={2}>
                <Button variant="contained">
                    <Link href={state.url} legacyBehavior>
                        <a>Către documentație</a>
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