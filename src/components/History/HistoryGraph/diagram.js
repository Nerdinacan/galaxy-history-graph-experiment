/**
 * Not sure we need d3, but it comes with a lot of nice
 * animation methods for free.
 */

import { select, event } from "d3-selection";
import { zoom, zoomTransform } from "d3-zoom";
import { krakenLayout } from "./krakenLayout";


// Build a function that can be called when the graph
// changes to update the positions of the nodes

export const buildDiagram = (svgEl, vm) => {

    // Install one-time setup fixtures
    let svg = select(svgEl);
    installZoom(svg);

    // Build update function
    return (graph) => {
        krakenLayout(graph);
        drawNodes(svg, graph, vm);
        drawLinks(svg, graph, vm);
    }
}

const drawNodes = (svg, graph, vm) => {

    let nodes = Array.from(graph).map(([k,v]) => v);

    // updates
    let u = svg.select(".nodes")
        .selectAll("circle")
        .data(nodes, d => d.id);

    // enters
    let e = u.enter()
        .append("circle")
        .attr("r", d => d.type == "job" ? 12 : 16)
        .attr("class", d => d.type)
        .on("mouseover", d => vm.$emit("hoverNode", d))
        .on("mouseout", d => vm.$emit("hoverNode", null))
        .on("click", function (d) {
            // TODO: make this less specific
            if (d.type == "dataset") {
                vm.$emit("selectDataset", d.id);
            }
        });

    u.exit().remove();

    e.merge(u)
        .classed("selected", d => d.selected)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

const drawLinks = (svg, graph) => {

    let links = Array.from(graph.edges()).map(([sourceKey, targetKey]) => {
        return {
            source: graph.vertexValue(sourceKey),
            target: graph.vertexValue(targetKey)
        }
    });

    let u = svg.select(".links")
        // .selectAll("path")
        .selectAll("line")
        .data(links, d => `${d.source.id}_${d.target.id}`);

    let e = u.enter()
        // .append("path")
        .append("line")
        .attr("class", "link")

    u.exit().remove();

    e.merge(u)
        // .attr("d", buldArc);
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
}

function buldArc(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" +
        d.source.x + "," +
        d.source.y + "A" +
        dr + "," + dr + " 0 0,1 " +
        d.target.x + "," +
        d.target.y;
}


// Zooming

let zoomTarget, 
    zoomCatcher, 
    zoomInstance;

const installZoom = (svg) => {
    zoomTarget = svg.select(".zoomContainer");
    zoomCatcher = svg.select(".zoomCatcher");
    let zoomed = () => {
        zoomTarget.attr("transform", event.transform);
    };
    zoomInstance = zoom().scaleExtent([1 / 2, 4]).on("zoom", zoomed);
    zoomCatcher.call(zoomInstance);
}



// Zoom diagram programatically to indicated point
// https://www.datamake.io/blog/d3-zoom#prog-zoom

let lastX = 0;

export const zoomDiagram = (svg, windowCenter) => {

    let svgCenter = {
        x: svg.clientWidth / 2,
        y: svg.clientHeight / 2
    }

    let delta = {
        x: windowCenter.x - svgCenter.x,
        y: windowCenter.y - svgCenter.y
    }

    let current = zoomTransform(zoomCatcher);
    let newZoom = current.translate(delta.x, 0);

    // let transformEnd = d3.zoomIdentity.translate(x, 0);
    zoomCatcher.transition()
        .call(zoomInstance.transform, newZoom)
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
