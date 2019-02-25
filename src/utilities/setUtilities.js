export function setIntersect(aa, bb) {
    let a = new Set(aa);
    let b = new Set(bb);
    let intersection = new Set([...a].filter(x => b.has(x)));
    return intersection;
}
