/**
 * Keeps a map of node keys where the key is
 * the rank and the value is a set of unique nodes
 */
export function RankMap() {

    let m = new Map();

    let getRank = rank => {
        if (!m.has(rank)) {
            m.set(rank, new Set());
        }
        return m.get(rank);
    }

    let setRank = (rank, key) => {
        getRank(rank).add(key);
    }

    return new Proxy(m, {
        get(target, prop) {
            if (prop == 'get') return getRank;
            if (prop == 'set') return setRank;
            return target[prop];
        }
    });
}