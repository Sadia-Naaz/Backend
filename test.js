import { assert } from 'chai';

describe('Flow Distribution Algorithm', () => {
    it('should distribute users evenly among astrologers', () => {
        let astrologers = [
            { id: 1, connections: 0, isTop: false, maxConnections: 10 },
            { id: 2, connections: 0, isTop: false, maxConnections: 10 }
        ];

        let user = { id: 1, preference: 'general' };
        let distributeUser = (user, astrologers) => {
            astrologers.sort((a, b) => a.connections - b.connections);
            astrologers[0].connections++;
            return astrologers[0];
        };

        distributeUser(user, astrologers);
        distributeUser(user, astrologers);

        assert.equal(astrologers[0].connections, 1);
        assert.equal(astrologers[1].connections, 1);
    });
});
