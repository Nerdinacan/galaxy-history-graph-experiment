// Combine iterators
export const concatIterators = function*(...args) {
    for (let iterator of args)
        for (let x of iterator)
            yield x;
}
