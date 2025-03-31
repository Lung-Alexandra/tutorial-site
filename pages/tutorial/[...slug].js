import Layout from '../../components/Layout';
import { getMdxContent, getMdxPaths } from '../../lib/mdx';
import { MDXRemote } from 'next-mdx-remote';
import { getNavigation } from '../../lib/navigation';

export default function TutorialPage({ mdxSource, frontmatter, slug, navigation }) {
    const title = slug[slug.length - 1].replace(/[-_]/g, ' ');
    const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);

    // Folosim titlul din frontmatter dacă există
    const pageTitle = frontmatter.title || formattedTitle;
    const pageDescription = frontmatter.description || `Tutorial despre ${pageTitle}`;

    const metadata = {
        title: pageTitle,
        description: pageDescription
    };

    // Debug pentru a vedea dacă navigation este prezent
    console.log("Navigation in TutorialPage:", navigation);

    return (
        <Layout nav={navigation} metadata={metadata}>
            <article className="tutorial-content">
                {mdxSource && <MDXRemote {...mdxSource} />}
            </article>
        </Layout>
    );
}

export async function getStaticPaths() {
    const paths = await getMdxPaths();

    // Formatăm căile pentru Next.js
    const formattedPaths = paths.map(path => {
        // Eliminăm primul slash și "tutorial/" din cale
        const cleanPath = path.startsWith('/tutorial/')
            ? path.slice('/tutorial/'.length)
            : path.startsWith('tutorial/')
                ? path.slice('tutorial/'.length)
                : path;

        return {
            params: {
                slug: cleanPath.split('/')
            }
        };
    });

    return {
        paths: formattedPaths,
        fallback: 'blocking'
    };
}

export async function getStaticProps({ params }) {
    try {
        // Reconstruim calea fișierului
        const slugPath = `/tutorial/${params.slug.join('/')}`;

        // Obținem conținutul MDX
        const { mdxSource, frontmatter } = await getMdxContent(slugPath);

        // Obținem structura de navigare
        const navigation = await getNavigation();

        // Debug pentru a verifica structura de navigare
        console.log("Navigation structure in getStaticProps:",
            Object.keys(navigation).length,
            navigation.tree ? Object.keys(navigation.tree).length : 0);

        return {
            props: {
                mdxSource,
                frontmatter,
                slug: params.slug,
                navigation
            },
            // Re-generare la fiecare 10 minute
            revalidate: 600
        };
    } catch (error) {
        console.error('Error in getStaticProps for tutorial page:', error);

        // Obținem structura de navigare chiar și în cazul unei erori
        const navigation = await getNavigation();

        // Conținut de bază în caz de eroare
        return {
            props: {
                mdxSource: null,
                frontmatter: {},
                slug: params.slug,
                navigation
            },
            revalidate: 600
        };
    }
} 