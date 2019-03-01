/**
 * Not sure we need d3, but it comes with a lot of nice
 * animation methods for free.
 */

import { select, event } from "d3-selection";
import { krakenLayout } from "./krakenLayout";


// Build a function that can be called when the graph
// changes to update the positions of the nodes

export const buildKrakenDiagram = (svgEl, vm) => {

    // console.log("buildKrakenDiagram");

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

    // console.group("drawNodes");

    let nodes = Array.from(graph).map(([k,v]) => v);

    // console.log("nodes", nodes);

    // updates
    let u = svg.select("g.nodes")
        .selectAll("circle")
        .data(nodes, d => d.id);


    // enters
    let e = u.enter()
        .append("circle")
        .attr("r", d => d.type == "job" ? 12 : 16)
        .attr("class", d => d.type)
        .on("mouseover", function(d) {
            this.classList.add("hoverselect");
            vm.$emit("hoverNode", d.id);
        })
        .on("mouseout", function(d) {
            this.classList.remove("hoverselect");
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
            sourceObj: graph.vertexValue(sourceKey),
            targetObj: graph.vertexValue(targetKey)
        }
    });

    // console.log("links", links);
    let u = svg.select("g.edges").selectAll("path")
        // .selectAll("line")
        .data(links, d => `${d.sourceObj.id}_${d.targetObj.id}`);

    let e = u.enter()
        .append("path")
        // .append("line")
        .attr("class", "edge")

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

    if (Math.abs(d.sourceObj.rank - d.targetObj.rank) == 1) {
        // draw straight line
        return drawLine(d);
    } else {
        return drawArc(d);
    }

}


function drawLine(d) {

    let dir = d.sourceObj.type == "dataset" ? 1 : -1;

    let s = d.sourceObj, t = d.targetObj;
    if (d.sourceObj.type == "job") {
        s = d.targetObj, t = d.sourceObj; 
    }

    var dx = t.x - s.x,
        dy = t.y - s.y,
        dr = dir * Math.sqrt(dx * dx + dy * dy);

    return `M ${s.x},${s.y} L${t.x},${t.y}`;

}

function drawArc(d) {

    let dir = d.sourceObj.type == "dataset" ? 1 : -1;

    let s = d.sourceObj, t = d.targetObj;
    if (d.sourceObj.type == "job") {
        s = d.targetObj, t = d.sourceObj; 
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