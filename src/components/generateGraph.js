/**
 * Generate graph representation of list of datasets and jobs
 * https://www.geeksforgeeks.org/implementation-graph-javascript/
 * 
 */

// import { Graph } from "./Graph";
// import Graph from "directed-graph-map";
import Graph from "graph.js";

// import Graph from "@datastructures-js/graph";
// notes: Keys must be primitives, no Map(), Set() internal structure
// has traversal functions but no exports of basic properties

// "directed-graph-map": "^1.2.3",
// notes: Nice Set/Map implementation, but no utilities like bfs, dfs, shortest path, etc
// Good but no utilities
// https://github.com/wehriam/directed-graph-map/blob/master/src/index.js

// "graph": "^0.2.0",
// notes: no good, totally archaic javascript style, no utilities

// "graph.js": "^1.21.1",
// notes: Beefy, maybe overkill

// "graphlib": "^2.1.7",
// notes: another archaic js lib

// "js-data-structure": "^0.7.3",
// notes: meh

// Looks buggy but good source for algos
// https://github.com/trekhleb/javascript-algorithms
// https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/graph/topological-sorting


// Graph of ids only
export async function generateGraph(datasets, jobs) {

    // create graph model
    let g = new Graph();

    datasets.forEach(ds => {
        g.addVertex(String(ds.id), ds);
    })

    jobs.forEach(job => {
        g.addVertex(String(job.id), job);
    })

    jobs.forEach(job => {
        job.inputs.forEach(id => g.createNewEdge(String(id), String(job.id)));
        job.outputs.forEach(id => g.createNewEdge(String(job.id), String(id)));
    });

    return g;
}
