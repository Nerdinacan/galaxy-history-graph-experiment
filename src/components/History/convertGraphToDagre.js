import dagre from "dagre";

// default spacing for layout function
const nodeSize = { width: 16, height: 16 };

/**
 * Converts nice clean graph data model into the format the d3-dag package
 * requires to function. I'm not fond of the built-in d3-dag model, it's
 * overly simplistic. It would be nice if we could find a layout function
 * that we can run against a more robust Graph model.
 * 
 * @param {Graph} input graph.js Graph object
 */
export function convertGraphToDagre(input) {

    let output = new dagre.graphlib.Graph();
    output.setGraph({});
    output.setDefaultEdgeLabel(() => ({}));

    for (let [k, data] of input) {
        output.setNode(k, { data, ...nodeSize });
    }

    for(let [from, to, value = {}] of input.edges()) {
        output.setEdge(from, to, value);
    }

    return output;
}
