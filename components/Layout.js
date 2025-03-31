import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navigation from './Navigation';

export default function Layout({ children, nav, metadata }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    // Efect pentru a seta tema inițială
    useEffect(() => {
        // Verifică dacă există o temă salvată în localStorage
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme) {
            setDarkMode(savedTheme === 'true');
        } else {
            // Verifică preferințele sistemului
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDarkMode(prefersDark);
        }
    }, []);

    // Efect pentru a aplica tema
    useEffect(() => {
        // Aplică tema la body și html
        if (darkMode) {
            document.body.setAttribute('data-theme', 'dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-theme'); // pentru compatibilitate
        } else {
            document.body.setAttribute('data-theme', 'light');
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark-theme');
        }
        // Salvează preferințele
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    // Toggle pentru tema dark/light
    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="layout">
            <Head>
                <title>{metadata?.title || 'Tutorial Site'}</title>
                <meta name="description" content={metadata?.description || 'Learn new skills with our tutorials'} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="main-header">
                <div className="container">
                    <Link href="/" legacyBehavior>
                        <a className="logo">Tutorial Site</a>
                    </Link>

                    <nav className="main-nav">
                        <div className="container">
                            <div className="nav-links">
                                <Link href="/" legacyBehavior>
                                    <a className={router.pathname === '/' ? 'active' : ''}>Home</a>
                                </Link>
                                <Link href="/tutorial" legacyBehavior>
                                    <a className={router.pathname.startsWith('/tutorial') ? 'active' : ''}>Tutorials</a>
                                </Link>
                            </div>
                        </div>
                    </nav>

                    <div className="nav-tools">
                        <form onSubmit={handleSearch} className="search">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                                    <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
                                </svg>
                            </button>
                        </form>
                        <button className="theme-toggle" onClick={toggleTheme}>
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                    </div>
                </div>
            </header>

            <div className="container main-container">
                <Navigation nav={nav} />
                <main className="content">
                    {children}
                </main>
            </div>

            <footer>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Tutorial Site. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
} 