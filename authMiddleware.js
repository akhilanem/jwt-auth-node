const jwt = require('jsonwebtoken');

const authMiddleware = (secretKey, requiredRole) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).send("Access Denied: No Token Provided");
        }

        try {
            const decoded = jwt.verify(token, secretKey);
            req.user = decoded;

            console.log("Decoded Token:", decoded);

            if (requiredRole && req.user.role !== requiredRole) {
                return res.status(403).send("Access Denied: Insufficient Permissions");
            }

            next();
        } catch (error) {
            return res.status(400).send("Invalid Token");
        }
    };
}

module.exports = authMiddleware;