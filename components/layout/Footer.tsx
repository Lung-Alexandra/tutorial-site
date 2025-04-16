import {alpha, Box, Container, Typography} from '@mui/material';

export default function Footer() {
    return (
        <Box component="footer" sx={{ py: 2 }}>
            <Container sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                    &copy; {new Date().getFullYear()} Tutorial Site. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
