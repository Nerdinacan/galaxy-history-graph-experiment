import Graph from "graph.js";
import { radiusSearch } from "./graphSearches";
import { Dataset, Job, Placeholder } from "./model";


/**
 * Create a history graph from a history object. The jobs should have input/output 
 * arrays which will be used to build the graph edges.
 * 
 * @param {object} history Object containg dataset and jobs lists
 */
export function generateHistoryGraph(history) {

    let { datasets, jobs } = history;

    // create graph model
    let g = new Graph();

    datasets.forEach(ds => g.addVertex(String(ds.id), ds));
    jobs.forEach(job => g.addVertex(String(job.id), job));

    jobs.forEach(job => {
        job.inputs.forEach(id => g.addNewEdge(String(id), String(job.id)));
        job.outputs.forEach(id => g.addNewEdge(String(job.id), String(id)));
    });

    // console.log('g', g);

    return g;
}


/**
 * Remove job nodes from a graph. Returns new graph.
 * 
 * @param {Graph} input Full history graph 
 */
export function generateJoblessGraph(input) {

    let g = new Graph();

    // add all the dataset nodes to the graph
    for (let [key, node] of input) {
        if (node instanceof Dataset) {
            g.addVertex(key, node);
        }
    }

    // add in all the edges, bypassing the job nodes
    for (let [key, node] of input) {
        if (node instanceof Job) {
            for (let [from] of input.verticesTo(key)) {
                for (let [to] of input.verticesFrom(key)) {
                    g.ensureEdge(from, to);
                }
            }
        }
    }

    return g;
}



/**
  * Reduces a larger input graph by picking a starting node, searching out to
  * the indicated radius.
  * 
  * @param {Graph} input Starting data
  * @param {Object} startNode center of graph, search out from this node
  * @param {Number} maxRadius max hops away from start node
  * @param {Set} selection Set of selected nodes
  */
export function generateFocusedGraph(input, startNode, maxRadius = 1) {

    let g = new Graph();
    if (!startNode) {
        return g;
    }

    let startKey = startNode.id;

    // add radius and focused properties to this node
    for (let { key, radius, node } of radiusSearch(input, startKey, maxRadius)) {
        node.radius = radius;
        node.focused = key == startKey;
        g.addVertex(key, node);
    }

    // loop over the collection and add in vertices that connect to
    // other members of the subset
    let placeholders = [];
    for(let [nodeKey] of g) {

        // look at all the incoming edges
        for (let [incomingVertexKey] of input.verticesTo(nodeKey)) {
            if (g.hasVertex(incomingVertexKey)) {
                g.addEdge(incomingVertexKey, nodeKey);
            } else {
                placeholders.push( tharBeDragons(input, nodeKey, true) );
            }
        }

        // ...and outgoing edges
        for (let [outgoingVertexKey] of input.verticesFrom(nodeKey)) {
            if (g.hasVertex(outgoingVertexKey)) {
                g.addEdge(nodeKey, outgoingVertexKey);
            } else {
                placeholders.push( tharBeDragons(input, nodeKey, false) );
            }
        }
    }

    // add in the placeholders
    placeholders.forEach(p => {
        g.ensureVertex(p.id, p);
        g.ensureEdge(p.startKey, p.endKey, { placeholder: true });
    });

    return g;
}


function tharBeDragons(sourceGraph, connectedKey, isIncoming) {
    let connectedTo = sourceGraph.vertexValue(connectedKey);
    return new Placeholder(connectedTo, isIncoming);
}


/**
 * Processes input graph to apply a selected property to each node
 * based on a passed selection list
 * @param {Graph} input Graph to mutate
 * @param {Set} selection Set of nodes which are selected
 */
export function selectNodesOnGraph(input, selection = new Set()) {
    for( let [k, node] of input) {
        node.selected = selection.has(node);
    }
    return input;
}