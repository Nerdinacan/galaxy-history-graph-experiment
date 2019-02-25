// Combine iterators
export function* concatIterators(...args) {
    for (let iterator of args)
        for (let x of iterator)
            yield x;
}
