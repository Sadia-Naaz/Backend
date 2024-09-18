const express = require('express');
const app = express();
app.use(express.json());

// In-memory storage for astrologers and users
let astrologers = [];
let users = [];

// Function to distribute user to an astrologer
function distributeUser(user) {
    // Sort astrologers by number of connections
    astrologers.sort((a, b) => a.connections - b.connections);

    for (let astrologer of astrologers) {
        // Check if astrologer can take more users
        if (astrologer.connections < astrologer.maxConnections) {
            // If astrologer is top, increase priority
            if (astrologer.isTop) {
                astrologer.connections += 2;
            } else {
                astrologer.connections++;
            }
            users.push({ ...user, assignedAstrologer: astrologer.id });
            return astrologer;
        }
    }
    return null; // No astrologer available
}

// Endpoint to add astrologers
app.post('/add-astrologer', (req, res) => {
    const astrologer = {
        id: astrologers.length + 1,
        connections: 0,
        isTop: req.body.isTop || false,
        maxConnections: req.body.maxConnections || 10
    };
    astrologers.push(astrologer);
    res.status(201).send(astrologer);
});

// Endpoint to assign a user to an astrologer
app.post('/assign-user', (req, res) => {
    const user = {
        id: users.length + 1,
        preference: req.body.preference || 'general'
    };
    const assignedAstrologer = distributeUser(user);
    if (assignedAstrologer) {
        res.status(200).send({ assignedAstrologer });
    } else {
        res.status(503).send({ message: 'No astrologers available' });
    }
});

// Endpoint to toggle top astrologer status
app.post('/toggle-top-astrologer/:id', (req, res) => {
    const astrologerId = parseInt(req.params.id);
    const astrologer = astrologers.find(a => a.id === astrologerId);
    if (astrologer) {
        astrologer.isTop = !astrologer.isTop;
        res.status(200).send({ message: `Astrologer ${astrologerId} top status toggled.` });
    } else {
        res.status(404).send({ message: 'Astrologer not found' });
    }
});

// Endpoint to get all astrologers
app.get('/astrologers', (req, res) => {
    res.status(200).send(astrologers);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
