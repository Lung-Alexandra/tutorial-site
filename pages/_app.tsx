import { ThemeProvider } from "./ThemeContext";
import {HighlightJsThemeLoader} from "./HighlightJsThemeLoader";

export default function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider>
            <HighlightJsThemeLoader />
            <Component {...pageProps} />
        </ThemeProvider>
    );
}
