/**
 * Install zooming on an svg diagram by putting a rect
 * over everything and capturing the appropriate d3 zoom events
 */

import { select, event } from "d3-selection";
import { zoom, zoomTransform } from "d3-zoom";

export default {
    bind(el, binding, vnode) {
        // console.log("zoom bind", el, binding, vnode);
        let zoomCatcher = select(el);
        let zoomTarget = zoomCatcher.select(".zoomContainer");    
        let zoomInstance = zoom()
            // .scaleExtent([1 / 2, 4])
            .on("zoom", () => {
                zoomTarget.attr("transform", event.transform);
            });
        zoomCatcher.call(zoomInstance);
    }
}


// const statefulDirective = (() => {
// 	const state = new WeakMap()
// 	return {
// 		bind(el) {
// 			const data = {}
// 			state.set(el, data)
// 		},
// 		update(el) {
// 			const data = state.get(el)
// 		},
// 		unbind(el) {
// 			state.delete(el)
// 		}
// 	}
// })()


/*
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

*/