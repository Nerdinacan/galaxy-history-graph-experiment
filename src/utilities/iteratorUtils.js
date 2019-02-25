// Combine iterators
export function* concatIterators(...args) {
    for (let iterator of args)
        for (let x of iterator)
            yield x;
}

export function* mapIterator(iterator, mapping) {
    while (true) {
        let result = iterator.next();
        if (result.done) {
            break;
        }
        yield mapping(result.value);
    }
}
