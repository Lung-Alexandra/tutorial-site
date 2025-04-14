import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, IconButton, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ThemeToggleButton from './ThemeToggleButton';
import Navigation from './Navigation';

export default function Layout({ children, nav, metadata }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const theme = useTheme();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const linkStyle = (active: boolean) => ({
        color: theme.palette.mode === 'dark'
            ? theme.palette.common.white
            : theme.palette.common.black,
        fontWeight: active ? 'bold' : 'normal',
        textTransform: 'none',
        padding: '0.0rem 1rem',
    });

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Head>
                <title>{metadata?.title || 'Tutorial Site'}</title>
                <meta name="description" content={metadata?.description || 'Learn new skills with our tutorials'} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Header */}
            <Box component="header" sx={{ bgcolor: 'primary.main', py: 2 }}>
                <Container
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Left: Fixed-width logo */}
                    <Box sx={{ width: 280 }}>
                        <Link href="/" passHref>
                            <Typography
                                variant="h5"
                                sx={{ ...linkStyle(router.pathname === '/'), width: '100%' }}
                            >
                                Tutorial Site
                            </Typography>
                        </Link>
                    </Box>

                    {/* Middle: Nav buttons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Link href="/" passHref>
                            <Button sx={linkStyle(router.pathname === '/')}>
                                <Typography variant="body1">
                                    Home
                                </Typography>
                            </Button>
                        </Link>
                        <Link href="/tutorial" passHref>
                            <Button sx={linkStyle(router.pathname.startsWith('/tutorial'))}>
                                <Typography variant="body1">
                                    Tutorials
                                </Typography>
                            </Button>
                        </Link>
                    </Box>

                    {/* Right: Search + Theme toggle */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            ml: 'auto',
                            gap: 1,
                        }}
                    >
                        <Box
                            component="form"
                            onSubmit={handleSearch}
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <TextField
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search tutorials..."
                                sx={{ mr: 1 }}
                            />
                            <IconButton type="submit" sx={{ width: 40, height: 40, borderRadius: 1 }}>
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
