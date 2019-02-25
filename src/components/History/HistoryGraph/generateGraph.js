import Graph from "graph.js";
import { dfs, radiusSearch } from "./graphSearches";
// import { Dataset } from "../model";

export function DatasetNode(props) {
    this.selected = false;
    this.rank = 0;
    this.col = 0;
    Object.assign(this, props);
}

export function JobNode(props) {
    this.rank = 0;
    this.col = 0;
    Object.assign(this, props);
}

// Graph of ids only
export function generateGraph({ datasets, jobs }) {

    // create graph model
    let g = new Graph();

    datasets.forEach(ds => g.addVertex(String(ds.id), new DatasetNode(ds)));

    jobs.forEach(job => g.addVertex(String(job.id), new JobNode(job)));

    jobs.forEach(job => {
        job.inputs.forEach(id => {
            g.addNewEdge(String(id), String(job.id));
        });
        job.outputs.forEach(id => g.addNewEdge(String(job.id), String(id)));
    });

    return g;
}


// Create a new graph out of the input but remove all the job
// nodes and replace them with corresponding edges between 
// surrounding datasets

export function generateJoblessGraph(fullGraph) {

    let g = new Graph();

    // add all the dataset nodes to the graph
    for (let [key, node] of fullGraph) {
        if (node.type == "dataset") {
            g.addVertex(key, new DatasetNode(node));
        }
    }

    // add in all the edges, bypassing the job nodes
    for (let [key, node] of fullGraph) {
        if (node.type == "job") {
            for(let [from, vertexValue, edgeValue] of fullGraph.verticesTo(key)) {
                for( let [to, vertexValue, edgeValue] of fullGraph.verticesFrom(key)) {
                    g.ensureEdge(from, to);
                }
            }
        }
    }

    return g;
}


// Format graph data the way d3 force simulation wants to consume it

export function graphToD3Inputs(graph) {

    let vertices = Array.from(graph.clone());

    let nodes = vertices.map(([id, data]) => data);
    
    let edges = Array.from(graph.edges());

    let links = edges.map(([sourceId, targetId]) => {
        // console.log("calculated source index", nodes.findIndex(n => n.id == sourceId));
        // console.log("calculated target index", nodes.findIndex(n => n.id == targetId));
        return { 
            id: `${sourceId}--${targetId}`,
            sourceId,
            targetId,
            source: nodes.findIndex(n => n.id == sourceId),
            target: nodes.findIndex(n => n.id == targetId)
        };
    });

    return { nodes, links };
}





/**
 * Create a sub-graph from a larger input graph that focuses on a 
 * small region and adds "thar be dragons" empty nodes at the source/sinks. 
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



function PlaceHolderNode(connectedTo, isIncoming) {
    this.id = `placeholder-${PlaceHolderNode.counter++}`;
    this.startKey = isIncoming ? this.id : connectedTo.id;
    this.endKey = isIncoming ? connectedTo.id : this.id;
    this.rank = isIncoming ? connectedTo.rank - 1 : connectedTo.rank + 1;
    this.type = "placeholder";
}

PlaceHolderNode.counter = 0;


function tharBeDragons(sourceGraph, connectedKey, isIncoming) {
    
    let connectedTo = sourceGraph.vertexValue(connectedKey);
    
    console.group("tharBeDragons");
    let blankSpot = new PlaceHolderNode(connectedTo, isIncoming);
    console.log(blankSpot);
    console.groupEnd();

    return blankSpot;

}