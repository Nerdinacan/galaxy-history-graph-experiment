/**
 * Depth-first search traversal iterate for a Graph.
 * 
 * @param {*} graph - Graph object to traverse (package: graph.js)
 * @param {*} startKey - Node to start at, probably a source node for our purposes
 */

import Graph from "graph.js";

export function dfs(graph, startKey) {

    if (!(graph instanceof Graph)) {
        throw new Error("Wrong graph parameter, should be a graph from npm: graph.js");       
    }

    const visited = new Set();

    function *visit(key, rank) {

        visited.add(key);

        // output key, rank and node object
        // rank is a rough indicator of the depth of the node
        // as starting from the level of the startKey node
        yield { key, rank, node: graph.vertexValue(key) };

        // in a directed graph, the outgoing vertices go forward
        // so increment the rank
        for(let [adjKey] of graph.verticesFrom(key)) {
            if (!visited.has(adjKey)) {
                yield *visit(adjKey, rank + 1);
            }
        }

        // in a directed graph, incoming vertices go backward
        // so decrement the rank
        for(let [adjKey] of graph.verticesTo(key)) {
            if (!visited.has(adjKey)) {
                yield *visit(adjKey, rank - 1);
            }
        }
    }

    return visit(startKey, 0);
}
