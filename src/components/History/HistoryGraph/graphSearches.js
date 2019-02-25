/**
 * Specialized depth-first search traversal iterators for our
 * graph implementsion.
 * 
 * @param {*} graph - Graph object to traverse (package: graph.js)
 * @param {*} startKey - Node to start at, probably a source node for our purposes
 */

import Graph from "graph.js";
import { concatIterators } from "@/utilities/iteratorUtils";


/**
 * Modified breadth first search that stops iterating
 * over the graph when we reach a certain distance from
 * starting node.
 * 
 * @param {*} graph 
 * @param {*} startKey 
 * @param {*} radius 
 */
export function radiusSearch(graph, startKey, maxRadius = 1) {

    if (!(graph instanceof Graph)) {
        throw new Error("Wrong graph parameter, should be a graph from npm: graph.js");       
    }

    const visited = new Set();
    
    function *visit(key, radius) {

        visited.add(key);

        yield { key, radius, node: graph.vertexValue(key) };

        if (radius < maxRadius) {
            let connex = concatIterators(
                graph.verticesFrom(key), 
                graph.verticesTo(key)
            );
            for(let [adjKey] of connex) {
                if (!visited.has(adjKey)) {
                    yield *visit(adjKey, radius + 1);
                }
            }
        }
    }
    
    return visit(startKey, 0);
}

/**
 * Depth-first search, keeps track of rank for rendering purposes.
 * @param {*} graph 
 * @param {*} startKey 
 */
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
