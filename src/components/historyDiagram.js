import * as d3 from "d3";



// Returns update function

export function buildDiagram(svg) {

    console.log("initializing history diagram", svg);

    let updateHistoryDiagram = (graph) => {

        console.group("updating graph with new data");
        console.log("graph", graph);
        console.log("vertices", Array.from(graph));
        console.log("edges", Array.from(graph.edges()));
        
        // Format graph data the way d3 wants to consume it

        let vertices = Array.from(graph);
        let nodes = vertices.map(([id, data]) => data);
        
        let edges = Array.from(graph.edges());
        let links = edges.map(([sourceId, targetId]) => {
            return { 
                source: nodes.findIndex(n => n.id == sourceId),
                target: nodes.findIndex(n => n.id == targetId)
            };
        });
        
        console.log("nodes", nodes);
        console.log("links", links);
        console.groupEnd();
        
        drawDiagram(svg, nodes, links);
    };

    return updateHistoryDiagram;
}


function drawDiagram(svg, nodes, links) {

    let width = svg.clientWidth,
        height = svg.clientHeight;
    
    let ticked = () => {
        updateNodes();
        updateLinks();
    }

    let updateNodes = () => {

        // updates
        let u = d3.select(svg).select(".nodes")
            .selectAll("circle")
            .data(nodes, d => String(d.id));
        
        // enters
        let e = u.enter()
            .append("circle")
            .attr("r", 10)
            .attr("class", d => d.type)
            .on("mouseover", d => console.log(d))
            .on("click", d => d.selected = !d.selected);
        
        // update location
        e.merge(u)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)

        u.exit().remove();
    }

    let updateLinks = () => {

        let u = d3.select(svg).select(".links")
            .selectAll("line")
            .data(links)

        u.enter()
            .append("line")
            .merge(u)
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)

        u.exit().remove()
    }


    // Build simulation

    let fLink = d3.forceLink()
        .links(links)
        .distance(link => {
            return 30 * Math.abs(link.source.time - link.target.time);
        });

    let simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("link", fLink)
        .force("y", d3.forceY().y(function(d) {
            return -1 * d.time * 40;
        }))
        .force("x", d3.forceX().x(function(d) {
            return 100;
        }))
        .on("tick", ticked);
}


    
    // 


    // // ZOOM
    
    // // let zoomG = d3.select(svg).select(".zoomContainer");
    // // function zoomHandler() {
    // //     zoomG.attr("transform", d3.event.transform);
    // // }
    // // let zoomBehavior = d3.zoom().scaleExtend([1 / 2, 4]).on("zoom", zoomHandler);

    // // d3.select(svg).append("rect")
    // //     .attr("width", width)
    // //     .attr("height", height)
    // //     .style("fill", "red")
    // //     .style("opacity", 0.5)
    // //     .style("pointer-events", "all")
    // //     .call(zoomBehavior);
