import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
    const {authorization} = req.headers;

    if (!authorization) {
        return res.status(401).json({error: 'Je moet ingelogd zijn'});
    }


    const token = authorization.split(' ')[1];


    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        if (!id) {
            return res.status(401).json({ error: 'Ongeldige token payload' });
        }

        const user = await User.findById(id).select('_id email');
        if (!user) {
            return res.status(401).json({ error: 'Gebruiker niet gevonden' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({error: 'Ongeldige token'});
    }
} 

