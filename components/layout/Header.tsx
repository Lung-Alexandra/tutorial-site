import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';
import NavButtons from './NavButtons';
import SearchBar from './SearchBar';
import ThemeToggleButton from '../ThemeToggleButton';

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
