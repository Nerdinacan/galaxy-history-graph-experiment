import Graph from "graph.js";
import { dfs, radiusSearch } from "./graphSearches";
``

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


// Format graph data the way d3 force simulation wants to consume it

export function graphToD3Inputs(graph) {

    let vertices = Array.from(graph);

    let nodes = vertices.map(([id, data]) => data);
    
    let edges = Array.from(graph.edges());

    let links = edges.map(([sourceId, targetId]) => {
        return { 
            source: nodes.findIndex(n => n.id == sourceId),
            target: nodes.findIndex(n => n.id == targetId)
        };
    });

    return { nodes, links };
}



// Create a new graph out of the input but remove all the job
// nodes and replace them with corresponding edges between 
// surrounding datasets

export function generateJoblessGraph(fullGraph) {

    let g = new Graph();

    // add all the dataset nodes to the graph
    for (let [key, node] of fullGraph) {
        if (node.type == "dataset") {
            g.addVertex(key, node);
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


/**
 * Create a sub-graph from a larger input graph that focuses on a 
 * small region and adds "thar be dragons" empty nodes at the source/sinks. 
 * @param {Graph} graph Source data
 */
export function focusedGraph(input, startNode, radius) {
    
    let g = new Graph();
    if (!startNode) {
        return g;
    }
    
    // console.clear();
    console.group("focusedGraph startNode", startNode, radius);
    
    
    let ranks = new Map();

    for (let { key, radius, node } of radiusSearch(input, startNode)) {

        // let hopCount = rank - startRank;
        console.log(radius, key);
        if (!ranks.has(radius)) {
            ranks.set(radius, []);
        }
        ranks.get(radius).push(key);

        g.addVertex(key, node);

    }

    // loop over the collection and add in vertices that connect to
    // other members of the subset
    for(let [nodeKey] of g) {
        console.group("nodeKey", nodeKey);

        // add in all the incoming edges
        for (let [vertexKey, vertexValue, edgeValue] of input.verticesTo(nodeKey)) {
            console.group(vertexKey);
            console.log(vertexValue);
            console.log(edgeValue);
            if (g.hasVertex(vertexKey)) {
                g.addEdge(vertexKey, nodeKey);
            } else {
                let newVertexIsSource = true;
                tharBeDragons(g, vertexKey, nodeKey, newVertexIsSource);
            }
            console.groupEnd();
        }

        for (let [vertexKey, vertexValue, edgeValue] of input.verticesFrom(nodeKey)) {
            console.group(vertexKey);
            console.log(vertexValue);
            console.log(edgeValue);
            if (g.hasVertex(vertexKey)) {
                g.addEdge(nodeKey, vertexKey);
            } else {
                let newVertexIsSource = false;
                tharBeDragons(g, nodeKey, vertexKey, newVertexIsSource);
            }
            console.groupEnd();
        }

        console.groupEnd();
    }

    console.dir(ranks);
    console.dir(g);
    console.groupEnd();


    return g;
}

function tharBeDragons(graph, startKey, endKey, newVertexIsSource) {

    let newVertex = newVertexIsSource ? startKey : endKey;
    graph.addVertex(newVertex, {});

    graph.addEdge(startKey, endKey);

}