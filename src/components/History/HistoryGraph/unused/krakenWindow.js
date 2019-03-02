import Graph from "graph.js";
import { select, event } from "d3-selection";

// baseline spacing
const hSpacing = 80, vSpacing = 80;
const getXCoord = (d) => hSpacing * d.col;
const getYCoord = (d) => vSpacing * d.rank;


/**
 * "Kraken" layout for a subset of the larget diagram, adds in placeholder
 * nodes and links to represent "more data that-a-way"
 * 
 * @param {object} svgEl DOM element for svg
 * @param {object} vm Vue component instance
 */
export const buildKrakenWindow = (svgEl, vm) => {

    // Install one-time setup fixtures
    let svg = select(svgEl);
    let link = svg.select("g.edges").selectAll("line");
    let node = svg.select("g.nodes").selectAll("circle");

    // update function
    return (graph) => {

        console.group("Render bitches!");
        console.dir(graph);
        console.groupCollapsed("nodes");
        let { g, maxRank, minRank } = doLayout(graph);
        console.groupEnd();
        // console.log("maxRank", maxRank);
        // console.log("minRank", minRank);
        console.dir(g);
        console.groupEnd();
    }
}


/**
 * 
 * @param {Graph} graph Incoming history graph (already reduced to required window)
 */
function doLayout(graph) {
    console.log("doing layout");
    
    let g = graph.clone();

    // add in some basic sorting statistics,
    // incoming vertices, outgoing vertices, isSource, isSink, etc

    let maxRank = 0;
    let minRank = 0;

    let ranks = new RankMap();

    // add nodes to ranks
    for (let [key, node] of g) {

        console.group(`${key}: ${node.constructor.name}`);
        console.log(`rank: ${node.rank}`);
        console.log(`col: ${node.col}`);
        console.log("inDegree", g.inDegree(key));
        console.log("outDegree", g.outDegree(key));
        console.log("degree", g.degree(key));
        console.groupEnd();

        maxRank = Math.max(maxRank, node.rank);
        minRank = Math.min(minRank, node.rank);
        ranks.set(node.rank, node);
    }

    return { g, maxRank, minRank };
}





/**
 * Mutate passed graph with rank and column properties for use with
 * kraken-style diagram. Starts iteration with source nodes of the
 * input and assumes graph is directed and acyclic.
 * 
 * @param {Graph} input Starting graph
 */
function generateRankAndColumn(input, sourceKey) {

    // rank collections
    let placement = new RankMap();

    // rank collector
    for (let { key, rank, node } of dfs(input, sourceKey)) {
        placement.set(rank, key);
    }

    // column sorter
    let sortFn = columnSort(input);
    
    // put nodes into ranks then loop over the collections
    for (let [rank, columns] of placement) {
        sortFn(columns).forEach((key, columnIndex) => {
            let node = input.vertexValue(key);
            node.rank = rank;
            node.col = columnIndex;
        });
    }

    return input;
}


/**
 * Generate a function that transforms a column set into
 * an array then sorts it according to some logic, the order
 * of which will be the horizontal columns on the end layout
 * 
 * @param {Graph} graph 
 */
function columnSort(graph) {

    let sortFn = (a, b) => {
        return edgeCount(graph, a) - edgeCount(graph, b);
    }

    return function (setOfNodes) {
        return Array.from(setOfNodes).sort(sortFn);
    }
}
