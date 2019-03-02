import dagre from "dagre";

const nodeSize = { width: 16, height: 16 };

/**
 * Converts nice clean graph data model into the limited format the d3-dag package
 * requires to function.
 * 
 * @param {Graph} input graph.js Graph object
 */
export function convertGraphToDagre(input) {

    let output = new dagre.graphlib.Graph();
    output.setGraph({});
    output.setDefaultEdgeLabel(() => ({}));

    for (let [k, dataNode] of input) {
        let node = { data: dataNode, ...nodeSize };
        output.setNode(k, node);
    }

    for(let [from, to, value = {}] of input.edges()) {
        output.setEdge(from, to, value);
    }

    return output;
}
