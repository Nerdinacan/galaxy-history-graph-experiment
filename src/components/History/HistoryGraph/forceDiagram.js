import { mapIterator } from "@/utilities/iteratorUtils";
import { graphToD3Inputs, DatasetNode, JobNode } from "./generateGraph";
import { select, selectAll } from "d3-selection";
import { scaleLinear } from "d3-scale";
import {
    forceSimulation, forceLink,
    forceManyBody, forceCenter,
    forceX, forceY, forceCollide
} from "d3-force";



export function buildForceDiagram(svgEl, vm) {

    let svg = select(svgEl);
    let nodes = [], links = [];

    let simulation = forceSimulation(nodes)
        .force("collision", forceCollide().radius(30))
        .force("link", forceLink(links).strength(0))
        .alphaTarget(1)
        .on("tick", ticked);

    let link = svg.select("g.edges").selectAll("line"),
        node = svg.select("g.nodes").selectAll("circle");


    let restart = (newNodes, newLinks, minRank, maxRank) => {

        console.group("restart");
        console.log("newNodes", newNodes);
        console.log("newLinks", newLinks);
        console.groupEnd();

        nodes = newNodes;
        links = newLinks;

        let height = 40 * Math.min(maxRank - minRank);

        let yScale = scaleLinear()
            .domain([minRank, maxRank])
            .range([0, height]);

        nodes.forEach(d => {
            d.x = 0;
            d.fy = yScale(d.rank - minRank);
        })

        // Apply the general update pattern to the nodes.
        node = node.data(nodes, d => d.id);

        node.exit().transition()
            .attr("r", 0)
            .remove();

        node = node.enter().append("circle")
            .classed("dataset", d => d.type == "dataset")
            .classed("job", d => d.type == "job")
            .classed("placeholder", d => d.type == "placeholder")
            .on("click", d => {
                vm.$emit("clickNode", d.id);
            })
            .on("mouseover", function(d) {
                if (d.type == "dataset" || d.type == "job") {
                    vm.$emit("hoverNode", d.id);
                }
            })
            // .call(function (node) { node.transition().attr("r", 8); })
            .merge(node)
                .classed("hoverselect", d => d.focused)
                .attr("r", d => d.type == "job" ? 12 : 16);

        // Apply the general update pattern to the links.
        link = link.data(links, d => d.id);

        // Keep the exiting links connected to the moving remaining nodes.
        link.exit().transition()
            .attr("stroke-opacity", 0)
            .attrTween("x1", function (d) { return function () { return d.source.x; }; })
            .attrTween("x2", function (d) { return function () { return d.target.x; }; })
            .attrTween("y1", function (d) { return function () { return d.source.y; }; })
            .attrTween("y2", function (d) { return function () { return d.target.y; }; })
            .remove();

        link = link.enter().append("line")
            .call(function (link) { link.transition().attr("stroke-opacity", 1); })
            .merge(link)
                .classed("placeholder", d => d.placeholder);

        // Update and restart the simulation.
        simulation.nodes(nodes);
        simulation.force("link").links(links);
        simulation.alpha(1).restart();
    }

    function ticked() {
        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    }

    return function (graph) {
        let { nodes, links, maxRank, minRank } = preprocessGraph(graph);
        restart(nodes, links, minRank, maxRank);
    }
}


function iterKeys(iter) {
    return new Set(Array.from(iter).map(([k, v]) => k));
}

function preprocessGraph(graph) {

    let sources = iterKeys(graph.sources());
    let sinks = iterKeys(graph.sinks());
    let maxRank = 0;
    let minRank = 0;

    let nodes = Array.from(graph)
        .map(([k, n]) => {
            maxRank = Math.max(maxRank, n.rank);
            minRank = Math.min(minRank, n.rank);

            let props = {
                id: k,
                type: n.type,
                isSink: sinks.has(k),
                isSource: sources.has(k),
                rank: n.rank,
                focused: n.focused
            }

            return props;
        });

    let links = Array.from(graph.edges())
        .map(([from, to, edgeData]) => {
            let placeholder = !!(edgeData && edgeData.placeholder);
            return {
                id: `${from}--${to}`,
                source: nodes.findIndex(n => n.id == from),
                target: nodes.findIndex(n => n.id == to),
                placeholder
            }
        });

    return { links, nodes, maxRank, minRank };
}
