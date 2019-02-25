/**
 * Not sure we need d3, but it comes with a lot of nice
 * animation methods for free.
 */

import { select, event } from "d3-selection";
import { krakenLayout } from "./krakenLayout";


// Build a function that can be called when the graph
// changes to update the positions of the nodes

export const buildDiagram = (svgEl, vm) => {

    // Install one-time setup fixtures
    let svg = select(svgEl);

    // Build update function
    return (graph) => {
        krakenLayout(graph);
        drawNodes(svg, graph, vm);
        drawLinks(svg, graph, vm);
    }
}

const drawNodes = (svg, graph, vm) => {

    console.group("drawNodes");

    let nodes = Array.from(graph).map(([k,v]) => v);

    console.log("nodes", nodes);

    // updates
    let u = svg.select(".nodes")
        .selectAll("circle")
        .data(nodes, d => d.id);


    // enters

    let hover = null;

    let e = u.enter()
        .append("circle")
        .attr("r", d => d.type == "job" ? 12 : 16)
        .attr("class", d => d.type)
        .on("mouseover", function(d) {
            if (hover) {
                hover.classList.remove("hoverselect");
            }
            hover = this;
            this.classList.add("hoverselect");
            vm.$emit("hoverNode", d.id);
        })
        .on("click", function (d) {
            vm.$emit("clickNode", d);
        });

    u.exit().remove();

    e.merge(u)
        .classed("selected", d => d.selected)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    console.groupEnd();
}

const drawLinks = (svg, graph) => {

    let links = Array.from(graph.edges()).map(([sourceKey, targetKey]) => {
        return {
            source: graph.vertexValue(sourceKey),
            target: graph.vertexValue(targetKey)
        }
    });

    console.log("links", links);

    let u = svg.select(".links")
        .selectAll("path")
        // .selectAll("line")
        .data(links, d => `${d.source.id}_${d.target.id}`);

    let e = u.enter()
        .append("path")
        // .append("line")
        .attr("class", "link")

    u.exit().remove();

    e.merge(u)
        .attr("d", buildPath);
        // .attr("x1", d => d.source.x)
        // .attr("y1", d => d.source.y)
        // .attr("x2", d => d.target.x)
        // .attr("y2", d => d.target.y);
}

function buildPath(d) {
    
    // console.log("d", d.source.type);
    // console.log("d.source.rank", d.source.rank);
    // console.log("d.target.rank", d.target.rank);

    if (Math.abs(d.source.rank - d.target.rank) == 1) {
        // draw straight line
        return drawLine(d);
    } else {
        return drawArc(d);
    }

}


function drawLine(d) {

    let dir = d.source.type == "dataset" ? 1 : -1;

    let s = d.source, t = d.target;
    if (d.source.type == "job") {
        s = d.target, t = d.source; 
    }

    var dx = t.x - s.x,
        dy = t.y - s.y,
        dr = dir * Math.sqrt(dx * dx + dy * dy);

    return `M ${s.x},${s.y} L${t.x},${t.y}`;

}

function drawArc(d) {

    let dir = d.source.type == "dataset" ? 1 : -1;

    let s = d.source, t = d.target;
    if (d.source.type == "job") {
        s = d.target, t = d.source; 
    }

    var dx = t.x - s.x,
        dy = t.y - s.y,
        dr = dir * Math.sqrt(dx * dx + dy * dy);

    return `M ${s.x},${s.y} A${dr},${dr} 0,0,1 ${t.x},${t.y}`;


}




// Dragging

// const drag = simulation => {

//     function dragstarted(d) {
//         if (!event.active)
//             simulation.alphaTarget(0.3).restart();
//         d.fx = d.x;
//         // d.fy = d.y;
//     }

//     function dragged(d) {
//         d.fx = event.x;
//         // d.fy = d3.event.y;
//     }

//     function dragended(d) {
//         if (!event.active) simulation.alphaTarget(0);
//         d.fx = null;
//         // d.fy = null;
//     }

//     return d3.drag()
//         .on("start", dragstarted)
//         .on("drag", dragged)
//         .on("end", dragended);
// }
