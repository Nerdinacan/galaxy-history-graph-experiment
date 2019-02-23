/**
 * D3 layout for kraken directed graph
 */

import { dfs } from "./dfs";


export const krakenLayout = (graph) => {

    // Reusable sort function
    let sortFn = (aKey, bKey) => {
        // More connections go to the right
        return edgeCount(graph, aKey) - edgeCount(graph, bKey);
    }

    // put nodes into ranks then loop over the collections
    for(let [rank, columns] of generateRankPlacement(graph)) {

        // turn the rank into columns by sorting on edge count
        // more edges pushes the node to the right
        // (to the end of the list)
        let sortedColumns = Array.from(columns).sort(sortFn);

        // turn columns into nodes, mutate nodes to set x/y
        sortedColumns
            .map(key => graph.vertexValue(key))
            .forEach((node, columnIndex) => {
                node.rank = rank;
                node.col = columnIndex;
                node.x = columnIndex * 80;
                node.y = rank * 80;
            });
    }
}

/**
 * Generates a Map/Set grid representation of the directed graph, so we 
 * can extract a rank and column for rendering
 */
function generateRankPlacement(graph) {

    // keep track of locations
    let placement = new Map(/* rank, Set(columns) */);
    
    // grab any source node from the graph data
    let { value: [ sourceKey ] } = graph.sources().next();
 
    // traverse (dfs) the graph starting at the selected source node
    for(let { key, rank } of dfs(graph, sourceKey)) {

        // source? If so, shove to the top
        let myRank = graph.inDegree(key) == 0 ? 0 : rank;
        
        if (!placement.has(myRank)) 
            placement.set(myRank, new Set());

        placement.get(myRank).add(key);
    }

    return placement;
}

/**
 * Generate an edge count number for each node so we can sort.
 * We should probably think about caching this value on the
 * node to speed up sorting if we run into performance problems
 */
const edgeCount = (graph, key) => {

    // this is the edges on this node
    let myEdgeCount = graph.degree(key);

    // also add in the edges of the parents, we want more
    // connections to the right of the graph
    let parentCount = Array.from(graph.verticesTo(key))
        .map(([key]) => key)
        .reduce((total, parent) => {
            return total + graph.degree(parent);
        }, 0);

    let childCount = Array.from(graph.verticesFrom(key))
        .map(([key]) => key)
        .reduce((total, child) => {
            return total + graph.degree(child);
        }, 0);

    return myEdgeCount + parentCount + childCount;
}
