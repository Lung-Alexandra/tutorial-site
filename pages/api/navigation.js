import { getNavigation } from '../../lib/mdx';

export default async function handler(req, res) {
    const navigation = await getNavigation();
    res.status(200).json(navigation);
} 