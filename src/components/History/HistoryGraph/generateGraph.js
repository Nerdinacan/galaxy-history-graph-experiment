import Graph from "graph.js";

// "directed-graph-js"
// https://github.com/Aveek-Saha/js-data-structs


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