import { Box, Container, Typography } from '@mui/material';

export default function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: 'primary.main', py: 2 }}>
            <Container sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                    &copy; {new Date().getFullYear()} Tutorial Site. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
