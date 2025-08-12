const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const decoded = jwt.verify(token, 'swapnita singh');
        
        // Ensure decoded token has required fields
        if (!decoded._id) {
            return res.status(401).json({ error: 'Invalid token format' });
        }

        // Attach consistent user data to the request
        req.userData = {  // Changed from req.user to req.userData for consistency
            _id: decoded._id,
            channelName: decoded.channelName,
            email: decoded.email,
            phone: decoded.phone,
            logoId: decoded.logoId
        };
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            error: 'Authentication failed'
        });
    }
};