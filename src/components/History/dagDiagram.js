/**
 * TODO: decide on a single data model and get rid of
 * some of these extra conversion loops.
 */

import dagre from "dagre";
import { select, selectAll } from "d3-selection";
import { Dataset, Job, Placeholder } from "./model";
import { convertGraphToDagre } from "./convertGraphToDagre";

const layoutOptions = {
    align: 'UL'
}

const dataNodeSize = d => d.data instanceof Job ? 10 : 16;

export function buildDagDiagram(svgEl, vm) {

    let svg = select(svgEl);

    return function(graph, selection = new Set(), focused = null) {

        console.log("focused", focused);

        // convert data, let dagre do the layout
        let dag = convertGraphToDagre(graph);
        dagre.layout(dag, layoutOptions);

        // render
        let link = svg.select("g.edges").selectAll("line");
        let node = svg.select("g.nodes").selectAll("circle");
        

        let { nodes, links } = getParts(dag);

        // Apply the general update pattern to the nodes.
        node = node.data(nodes, d => d.id);

        node.exit().transition()
            .attr("r", 0)
            .remove();

        node = node.enter().append("circle")
            .call(node => {
                node.transition()
                    .attr("r", dataNodeSize)
            })
            .merge(node)
                .classed("selected", d => selection.has(d.data))
                .classed("focused", d => d.data === focused)
                .classed("dataset", d => d.data instanceof Dataset)
                .classed("job", d => d.data instanceof Job)
                .classed("placeholder", d => d.data instanceof Placeholder)
                .classed("hoverselect", d => d.focused)
                .on("click", d => vm.$emit("clickNode", d.data))
                .on("mouseover", d => vm.$emit("hoverNode", d.data))
                .attr("r", dataNodeSize)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

        // Apply the general update pattern to the links.
        link = link.data(links, d => d.id);

        // Keep the exiting links connected to the moving remaining nodes.
        link.exit().transition()
            .attr("stroke-opacity", 0)
            .attrTween("x1", d => () => d.source.x)
            .attrTween("x2", d => () => d.target.x)
            .attrTween("y1", d => () => d.source.y)
            .attrTween("y2", d => () => d.target.y)
            .remove();

        link = link.enter().append("line")
            .call(function (link) { link.transition().attr("stroke-opacity", 1); })
            .merge(link)
                .classed("placeholder", d => d.placeholder)
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y)
                .attr("marker-end","url(#arrow)");

    }
}


function getParts(dag) {

    let nodeKeys = dag.nodes();
    let nodes = nodeKeys.map(key => dag.node(key));
    let links = dag.edges().map(({v,w}) => {
        let obj = dag.edge(v,w);
        return Object.assign({}, obj, {
            id: `${v}:${w}`,
            source: dag.node(v),
            target: dag.node(w),
        });
    });

    return { nodes, links };
}