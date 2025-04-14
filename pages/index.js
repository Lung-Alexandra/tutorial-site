import Layout from '../components/layout/Layout.tsx';
import Link from 'next/link';
import { getNavigation } from '../lib/navigation';

export default function Home({ navigation }) {
    // Extragem structura plată pentru a afișa tutorialele
    const navFlat = navigation.flat || {};

    return (
        <Layout nav={navigation} metadata={{ title: 'Tutorial Site - Homepage', description: 'Explore our comprehensive tutorials and learning resources' }}>
            <div className="home-content">
                <h1>Welcome to the Tutorial Site</h1>
                <p className="intro">Explore our comprehensive collection of tutorials to enhance your skills and knowledge.</p>

                <div className="featured-tutorials">
                    <h2>Featured Tutorials</h2>
                    <div className="tutorial-grid">
                        {Object.entries(navFlat).slice(0, 6).map(([path, title]) => (
                            <Link href={path} key={path} legacyBehavior>
                                <a className="tutorial-card">
                                    <h3>{title}</h3>
                                    <p>Explore this tutorial to learn more about {title.toLowerCase()}.</p>
                                    <span className="read-more">Read more &rarr;</span>
                                </a>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="cta-section">
                    <h2>Start Learning Today</h2>
                    <p>Browse our complete collection of tutorials or use the search functionality to find specific topics.</p>
                    <div className="cta-buttons">
                        <Link href="/tutorial" legacyBehavior><a className="btn primary">Browse All Tutorials</a></Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export async function getStaticProps() {
    // Obținem structura de navigare
    const navigation = await getNavigation();

    return {
        props: {
            navigation
        },
        // Re-generare la fiecare 10 minute
        revalidate: 600
    };
} 