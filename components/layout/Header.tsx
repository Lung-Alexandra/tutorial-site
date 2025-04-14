import {Box, Container, IconButton, Tooltip, Typography} from '@mui/material';
import Link from 'next/link';
import NavButtons from './NavButtons';
import SearchBar from './SearchBar';
import {useTheme} from "../../pages/ThemeContext";
import React, {useEffect} from "react";
import {Brightness4, Brightness7} from "@mui/icons-material";

export default function Header({ pathname, searchTerm, setSearchTerm, handleSearch }) {
    return (
        <Box component="header" sx={{ bgcolor: 'primary.main', py: 2 }}>
            <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ width: 280 }}>
                    <Link href="/" passHref>
                        <Typography variant="h5" sx={{ color: 'common.white' }}>
                            Tutorial Site
                        </Typography>
                    </Link>
                </Box>

                <NavButtons pathname={pathname} />

                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 1 }}>
                    <SearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleSearch={handleSearch}
                    />
                    <ThemeToggleButton />
                </Box>
            </Container>
        </Box>
    );
}

const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (theme === "dark") {
            document.body.setAttribute('data-theme', 'dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-theme'); // pentru compatibilitate
        } else {
            document.body.setAttribute('data-theme', 'light');
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark-theme');
        }
    }, [theme]);

    return (
        <Tooltip title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
            <IconButton onClick={toggleTheme} color="inherit">
                {theme === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
        </Tooltip>
    );
};
