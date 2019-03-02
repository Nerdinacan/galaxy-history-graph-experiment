import Graph from "graph.js";
import { select, event } from "d3-selection";
import { generateRankAndColumn } from "./generateGraph";

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

