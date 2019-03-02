import Graph from "graph.js";
import { dfs, radiusSearch, dfsTraverse } from "./graphSearches";
import { RankMap } from "./RankMap";



export function DatasetNode(props) {
    this.selected = false;
    Object.assign(this, props);
    this.type = "dataset";
}

export function JobNode(props) {
    Object.assign(this, props);
    this.type = "job"
}

export function PlaceHolderNode(connectedTo, isIncoming) {
    this.id = `placeholder-${PlaceHolderNode.counter++}`;
    this.startKey = isIncoming ? this.id : connectedTo.id;
    this.endKey = isIncoming ? connectedTo.id : this.id;
    this.type = "placeholder";
}

PlaceHolderNode.counter = 0;



/**
 * Create a history graph from a list of datasets and a list of jobs
 * The jobs should have input/output arrays which will be used to build
 * the graph edges.
 * 
 * @param {object} history Object containg dataset and jobs lists
 */
export function generateGraph(history) {

    let { datasets, jobs } = history;

    // create graph model
    let g = new Graph();

    datasets.forEach(ds => g.addVertex(String(ds.id), new DatasetNode(ds)));
    jobs.forEach(job => g.addVertex(String(job.id), new JobNode(job)));

    jobs.forEach(job => {
        job.inputs.forEach(id => g.addNewEdge(String(id), String(job.id)));
        job.outputs.forEach(id => g.addNewEdge(String(job.id), String(id)));
    });

    return g;
}


/**
 * Remove job nodes from a graph. Returns new graph.
 * 
 * @param {Graph} fullGraph 
 */
export function generateJoblessGraph(fullGraph) {

    let g = new Graph();

    // add all the dataset nodes to the graph
    for (let [key, node] of fullGraph) {
        if (node instanceof DatasetNode) {
            g.addVertex(key, new DatasetNode(node));
        }
    }

    // add in all the edges, bypassing the job nodes
    for (let [key, node] of fullGraph) {
        if (node.type == "job") {
            for(let [from, vertexValue, edgeValue] of fullGraph.verticesTo(key)) {
                for( let [to, vertexValue, edgeValue] of fullGraph.verticesFrom(key)) {
                    g.ensureEdge(from, to, edgeValue);
                }
            }
        }
    }

    return g;
}



/**
 * Create a sub-graph from a larger input graph that focuses on a 
 * small region and adds "thar be dragons" empty nodes at the
 * source/sinks.
 *  
 * @param {Graph} graph Source data
 */
export function focusedGraph(input, startNode, maxRadius = 1) {

    let g = new Graph();
    if (!startNode) {
        return g;
    }

    for (let { key, radius, node } of radiusSearch(input, startNode, maxRadius)) {

        let newNodeProps = Object.assign({}, node, { 
            radius,
            focused: key == startNode 
        });

        let newNode;
        if (node instanceof JobNode) {
            newNode = new JobNode(newNodeProps);
        }
        if (node instanceof DatasetNode) {
            newNode = new DatasetNode(newNodeProps);
        }

        g.addVertex(key, newNode);
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
    return new PlaceHolderNode(connectedTo, isIncoming);
}



/**
 * Mutate passed graph with rank and column properties for use with
 * kraken-style diagram. Starts iteration with source nodes of the
 * input and assumes graph is directed and acyclic.
 * 
 * @param {Graph} input Starting graph
 */
export function generateRankAndColumn(input, sourceKey) {

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
export function columnSort(graph) {

    let sortFn = (a, b) => {
        return edgeCount(graph, a) - edgeCount(graph, b);
    }

    return function (setOfNodes) {
        return Array.from(setOfNodes).sort(sortFn);
    }
}
