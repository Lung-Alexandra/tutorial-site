import Head from 'next/head';
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import MainContent from "./MainContent";
import Header from "./Header";
import Footer from "./Footer";

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

            <Header
                pathname={router.pathname}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
            />

            <MainContent nav={nav}>
                {children}
            </MainContent>

            <Footer />
        </Box>
    );
}
