import '../public/styles/main.css';
import '../public/styles/theme.css';
import 'katex/dist/katex.min.css';
import {ThemeProvider} from "./ThemeContext";

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider>
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default MyApp; 