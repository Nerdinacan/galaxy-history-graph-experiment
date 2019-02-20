/**
 * D3 layout for kraken directed graph
 */

function graphIterToSet(iterable) {
    let r = Array.from(iterable).map(([k,v]) => v);
    return new Set(r);
}

// add row number, isSource, isSink to topological sort
export const krakenLayout = (svg, graph, spacing = 40) => {
    
    let startHeight = svg.clientHeight / 2;
    let rowCount = 0;
    let nodes = Array.from(graph.vertices_topologically());
    let sources = graphIterToSet(graph.sources());
    let sinks = graphIterToSet(graph.sinks());

    nodes.forEach(([key, node]) => {
        
        // Adds row number        
        let incomingEdges = Array.from(graph.verticesWithPathTo(key));
        node.row = incomingEdges.reduce((rowCount, [key, parentNode]) => {
            if (!parentNode.row) parentNode.row = 0;
            return Math.max(rowCount, parentNode.row + 1);
        }, 0);
        rowCount = Math.max(rowCount, node.row);

        // adds source/sink indicator
        node.isSource = sources.has(node);
        node.isSink = sinks.has(node);
    });

    nodes.forEach(([key, node]) => {
        node.fy = startHeight - spacing * (rowCount - node.row);
    })

}


// let visited = new Set();
// let col = new Map();

// iterates over all vertices of the graph in topological order
// let nodes = Array.from().map(([k,v]) => v);

// for (let [key, node] of ) {
    
//     // console.group(key);
//     // console.log(node);
//     // console.log("verticesFrom", Array.from(graph.verticesFrom(key)));
//     // console.log("verticesTo", Array.from(graph.verticesTo(key)));
//     // console.log("verticesWithPathFrom", Array.from(graph.verticesWithPathFrom(key)));
//     // console.log("verticesWithPathTo", Array.from(graph.verticesWithPathTo(key)));
//     // console.log("outDegree", graph.outDegree(key));
//     // console.log("inDegree", graph.inDegree(key));
//     // console.log("degree", graph.degree(key));
//     // console.groupEnd();
    
//     // row number
//     let incoming = Array.from(graph.verticesWithPathTo(key));
//     node.row = incoming.reduce((row, [key, parentNode]) => {
//         return Math.max(row, parentNode.row + 1);
//     }, 0);

//     // node.fy = node.row * 30;

//     // // column
//     // if (!col.has(node.row)) {
//     //     col.set(node.row, new Set());
//     // }
//     // col.get(node.row).add(node);
//     // node.col = col.get(node.row).size;

//     // // x/y
//     // node.x = 20 + node.col * 40 + Math.random() * 50;
//     // node.y = 20 + node.row * 40;

// }

// for (let [key, node] of graph) {
//     console.log("node", node);
// }