import { graphToD3Inputs } from "./generateGraph";

import { select, selectAll } from "d3-selection";
import { 
    forceSimulation, forceLink, forceManyBody, forceCenter
} from "d3-force";

export const buildForceDiagram = (svgEl, graph, vm) => {
    
    let simulation;
    let svg = select(svgEl);

    return function(graph) {

        console.group("buildForceDiagram", svg);
        
        let { nodes, links } = graphToD3Inputs(graph);
        console.dir(nodes);
        console.dir(links);

        simulation = forceSimulation(nodes)
            .force("charge", forceManyBody())
            // .force("link", forceLink(links).id(d => d.id));
            .force("center", forceCenter(0,0))

        console.groupEnd();
    }
}
