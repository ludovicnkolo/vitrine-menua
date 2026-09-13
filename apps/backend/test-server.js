const express = require('express');
const { authenticateJWT, requireRoles, isSuperAdmin, isAdmin, isManager } = require('./src/middlewares/auth');

// Patch the router to catch and print errors
const oldPost = express.Router.prototype.post;
express.Router.prototype.post = function(path, ...handlers) {
    const wrappedHandlers = handlers.map(h => async (req, res, next) => {
        try {
            await h(req, res, next);
        } catch(e) {
            console.error("CAUGHT ERROR IN WRAPPER:", e);
            res.status(500).json({error: e.message, stack: e.stack});
        }
    });
    return oldPost.call(this, path, ...wrappedHandlers);
};

const app = express();
app.use(express.json());

// Mock auth middleware to inject user
app.use((req, res, next) => {
    req.user = { id: 'fdd133d8-442c-49ad-9158-d9f10c51a3d1', role: 'Super-administrateur' };
    next();
});

app.use('/api/crm', require('./src/routes/crm/dossiers'));

app.listen(4001, () => {
    console.log("Mock server running on 4001");
});
