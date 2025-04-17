import React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';
import {getNavigation} from "../lib/navigation";
import Layout from '../components/layout/Layout';

interface HomeProps {
    navigation: {
        flat: Record<string, string>;
    };
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
    const navFlat = navigation.flat || {};

    return (
        <Layout
            nav={navigation}
            metadata={{
                title: 'Tutorial Site - Homepage',
                description: 'Explore our comprehensive tutorials and learning resources',
            }}
        >
            <Container maxWidth="lg" sx={{ py: 6 }}>
                {/* Hero Section */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                        Welcome to the Tutorial Site
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Explore our comprehensive collection of tutorials to enhance your skills and knowledge.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        textAlign: 'center',
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        py: 6,
                        px: 3,
                        boxShadow: 1,
                    }}
                >
                    <Typography variant="h4" fontWeight={600} gutterBottom>
                        Start Learning Today
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Browse our complete collection of tutorials or use the search functionality to find specific topics.
                    </Typography>
                    <Button
                        component={Link}
                        href="/tutorial"
                        variant="contained"
                        size="large"
                        color="primary"
                    >
                        Browse All Tutorials
                    </Button>
                </Box>
            </Container>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const navigation = getNavigation();

    return {
        props: { navigation },
        revalidate: 600,
    };
};

export default Home;
