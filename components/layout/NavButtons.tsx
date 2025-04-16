import { Box, Button, Typography, useTheme } from '@mui/material';
import Link from 'next/link';

export default function NavButtons({ pathname }) {
    const theme = useTheme();

    const linkStyle = (active: boolean) => ({
        color: theme.palette.mode === 'dark'
            ? theme.palette.common.white
            : theme.palette.common.black,
        fontWeight: active ? 'bold' : 'normal',
        textTransform: 'none',
        padding: '0.0rem 1rem',
        height: '100%',
    });

    return (
        <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 2 }}>
            <Link href="/" passHref>
                <Button sx={linkStyle(pathname === '/')}>
                    <Typography variant="body1">Home</Typography>
                </Button>
            </Link>
            <Link href="/tutorial" passHref>
                <Button sx={linkStyle(pathname.startsWith('/tutorial'))}>
                    <Typography variant="body1">Tutorials</Typography>
                </Button>
            </Link>
            <Link href="/materials" passHref>
                <Button sx={linkStyle(pathname.startsWith('/materials'))}>
                    <Typography variant="body1">Materials</Typography>
                </Button>
            </Link>
        </Box>
    );
}
