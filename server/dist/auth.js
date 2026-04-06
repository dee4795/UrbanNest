import jwt from 'jsonwebtoken';
export function requireAuth(req, res, next) {
    const authHeader = req.header('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Missing auth token.' });
        return;
    }
    const token = authHeader.substring('Bearer '.length);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ message: 'JWT secret is not configured.' });
        return;
    }
    try {
        const payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    }
    catch {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
}
