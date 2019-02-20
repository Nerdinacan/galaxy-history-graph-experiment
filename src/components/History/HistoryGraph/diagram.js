/**
 * Not sure we need d3, but it comes with a lot of nice
 * animation methods for free.
 */

import * as d3 from "d3";
import { graphToD3Inputs } from "./generateGraph";
import { krakenLayout } from "./krakenLayout";


export const buildDiagram = (svgEl, vm) => {

    let svg = d3.select(svgEl);

    // Install one-time fixtures
    installZoom(svg);

    // Updates
    return (graph) => {

        // adds some props based on graph shapes
        krakenLayout(svgEl, graph, 40);

        updateSelectionOnGraph(svgEl);

        let width = svgEl.clientWidth;
        let height = svgEl.clientHeight;
        let { links, nodes } = graphToD3Inputs(graph);
        let updateNodes = drawNodes(svg, nodes, vm);
        let updateLinks = drawLinks(svg, links);
        let collisionForce = d3.forceCollide(30).strength(1).iterations(100);


        let simulation =
            d3.forceSimulation(nodes)
                // .force("charge", d3.forceManyBody())
                .force("collision", collisionForce)
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("link", d3.forceLink().links(links).strength(0))
                // .force("y", d3.forceY(d => {
                //     if (d.isSink) {
                //         return -1000;
                //     }
                //     if (d.isSource) {
                //         return 1000;
                //     }
                //     return 0;
                // }))
                .force("x", d3.forceX())
                .on("tick", () => {
                    updateNodes();
                    updateLinks();
                })
                // .tick(300);
    }
}

const drawNodes = (svg, nodes, vm) => {

    // updates
    let u = svg.select(".nodes")
        .selectAll("circle")
        .data(nodes, d => String(d.id));

    // enters
    let e = u.enter()
        .append("circle")
        .attr("r", d => d.type == "job" ? 8 : 12)
        .attr("class", d => d.type)
        .on("mouseover", d => {
            vm.$emit("hoverNode", d);
        })
        .on("mouseout", d => {
            vm.$emit("hoverNode", null);
        })
        .on("click", function (d) {
            if (d.type == "dataset") {
                vm.$emit("selectDataset", d.id);
            }
        });

    u.exit().remove();

    // update location
    return function () {
        e.merge(u)
            .classed("selected", d => d.selected)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
    }
}

const drawLinks = (svg, links) => {

    let u = svg.select(".links")
        .selectAll("line")
        .data(links);

    let e = u.enter()
        .append("line")
        .attr("class", "link")

    u.exit().remove();

    return function () {
        e.merge(u)
            // .attr("d", buldArc);
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    }
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
    zoom;

const installZoom = (svg) => {
    zoomTarget = svg.select(".zoomContainer");
    zoomCatcher = svg.select(".zoomCatcher");
    let zoomed = () => {
        zoomTarget.attr("transform", d3.event.transform);
    };
    zoom = d3.zoom().scaleExtent([1 / 2, 4]).on("zoom", zoomed);
    zoomCatcher.call(zoom);
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

    let current = d3.zoomTransform(zoomCatcher);
    let newZoom = current.translate(delta.x, 0);

    // let transformEnd = d3.zoomIdentity.translate(x, 0);
    zoomCatcher.transition()
        .call(zoom.transform, newZoom)
}


// Mutate existing diagram to update selection instead
// of drawing the whole thing over, do I need to do this
// or does the d3 update pattern handle it?

export const updateSelectionOnGraph = (svg) => {
    d3.select(svg).selectAll("circle")
        .classed("selected", d => d.selected)
}





// Dragging

const drag = simulation => {

    function dragstarted(d) {
        if (!d3.event.active)
            simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        // d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        // d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        // d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}
