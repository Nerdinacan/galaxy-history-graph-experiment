/**
 * D3 layout for kraken directed graph.
 * Layout's job is to assign x/y coords to each vertex
 * in the passed graph
 */

import { dfs } from "../graphSearches";

export const krakenLayout = (graph) => {

    // console.group("krakenLayout running");

    // column sorter
    let columnSortFn = buildSortFn(graph);

    // put nodes into ranks then loop over the collections
    for(let [rank, columns] of generateRankPlacement(graph)) {

        // turn the rank into columns by sorting on edge count
        // more edges pushes the node to the right
        // (to the end of the list)
        let sortedColumns = Array.from(columns).sort(columnSortFn);

        sortedColumns
            .map(key => graph.vertexValue(key))
            .forEach((node, columnIndex) => {
                node.rank = rank;
                node.col = columnIndex;
            });
    }

    // console.groupEnd();
}


/**
 * Generates a grid representation of the directed graph, so we 
 * can extract rank and column for rendering
 */
export function generateRankPlacement(graph) {

    // console.log("generateRankPlacement")

    // keep track of locations
    let placement = new Map(/* rank, Set(columns) */);
    
    // grab any source node from the graph data
    // let { value: [ sourceKey ] } = graph.sources().next();
 
    for(let [sourceKey, sourceNode] of graph.sources()) {

        // traverse (dfs) the graph starting at the selected source node
        for(let { key, rank } of dfs(graph, sourceKey)) {
    
            // source? If so, shove to the top
            let myRank = graph.inDegree(key) == 0 ? 0 : rank;
            
            if (!placement.has(myRank)) 
                placement.set(myRank, new Set());
    
            placement.get(myRank).add(key);
        }
    }

    return placement;
}


/**
 * Generates an edgecount sort function for use in sorting the columns
 * on the placement grid during node layout. Returned sort will operate
 * on keys of nodes from the graph.
 * @param {Graph} graph Graph data object
 */
const buildSortFn = (graph) => {

    let sinkKeys = Array.from(graph.sinks()).map(([key]) => key);
    let sinks = new Set(sinkKeys);
    // let sourceKeys = Array.from(graph.sources()).map(([key]) => key);
    // let sources = new Set(sourceKeys);

    // console.log("sources", sources);
    // console.log("sinks", sinks);
    // debugger;
    
    // More edges pushes the node further to the right
    // (i.e. further down the sort)
    return (aKey, bKey) => {
        // if (sinks.has(aKey)) {
        //     return -1;
        // }
        // if (sinks.has(bKey)) {
        //     return 1;
        // }
        return edgeCount(graph, aKey) - edgeCount(graph, bKey);
    }
}


/**
 * Generate an edge count number for each node so we can sort.
 * We should probably think about caching this value if we run 
 * into performance problems.
 */
const edgeCount = (graph, key) => {

    // this is the edges on this node
    let myEdgeCount = graph.degree(key);

    // also add in the edges of the "parents"
    let parentCount = Array.from(graph.verticesTo(key))
        .map(([key]) => key)
        .reduce((total, parent) => {
            return total + graph.degree(parent);
        }, 0);

    // and the "children"
    let childCount = Array.from(graph.verticesFrom(key))
        .map(([key]) => key)
        .reduce((total, child) => {
            return total + graph.degree(child);
        }, 0);

    return myEdgeCount + parentCount + childCount;
}
