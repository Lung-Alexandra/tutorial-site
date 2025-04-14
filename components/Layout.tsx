import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ThemeToggleButton from './ThemeToggleButton';
import Navigation from './Navigation';

export default function Layout({ children, nav, metadata }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Head>
                <title>{metadata?.title || 'Tutorial Site'}</title>
                <meta name="description" content={metadata?.description || 'Learn new skills with our tutorials'} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Header */}
            <Box component="header" sx={{ bgcolor: 'primary.main', py: 2 }}>
                <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="/" passHref>
                        <Typography variant="h6" color="white">
                            Tutorial Site
                        </Typography>
                    </Link>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Link href="/" passHref>
                            <Button color="inherit">Home</Button>
                        </Link>
                        <Link href="/tutorial" passHref>
                            <Button color="inherit">Tutorials</Button>
                        </Link>

                        {/* Search */}
                        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search tutorials..."
                                sx={{ mr: 1 }}
                            />
                            <IconButton type="submit" onSubmit={handleSearch} sx={{ width: 40, height: 40, borderRadius: 1 }}>
                                <SearchIcon />
                            </IconButton>
                        </Box>

                        <ThemeToggleButton />
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, mt: 3 }}>
                <Container sx={{ display: 'flex', maxWidth: '100%' }}>
                    <Box sx={{ width: 240, flexShrink: 0 }}>
                        <Navigation nav={nav} />
                    </Box>

                    <Box sx={{ flexGrow: 1, ml: 3, maxWidth: 'calc(100% - 250px)', paddingRight: 3 }}>
                        {children}
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ bgcolor: 'primary.main', py: 2 }}>
                <Container sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="white">
                        &copy; {new Date().getFullYear()} Tutorial Site. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}
