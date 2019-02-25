<template>
    <section class="history-graph" ref="container" v-resize.initial="onResize">
        <svg ref="svg" :height="height" :width="width" 
            v-zoom="'.zoomContainer'">
            <g ref="offsetContainer">
                <g class="zoomContainer">
                    <g class="links"></g>
                    <g class="nodes"></g>
                </g>
            </g>
            <defs>
                <filter id="filter-hoverselect" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="1" flood-color="white" />
                    <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="rgba(0,0,0,1)" />
                </filter>
            </defs>
        </svg>
    </section>
</template>


<script>

import zoom from "./zoom";
import resize from "vue-resize-directive";
import { buildDiagram } from "./diagram";
import Graph from "graph.js";


export default {

    directives: {
        resize, zoom
    },

    data: () => ({ 
        height: 0, 
        width: 0
    }),

    props: {
        graph: { type: Graph, required: true },
        graphCenter: { type: Object, required: false, default: null },
        selection: { type: Set, required: true }
    },

    computed: {

        svgSpacing() {
            let cs = getComputedStyle(this.$refs.svg);
            return {
                top: parseInt(cs.borderTopWidth) + parseInt(cs.marginTop),
                left: parseInt(cs.borderLeftWidth) + parseInt(cs.marginLeft),
                right: parseInt(cs.borderRightWidth) + parseInt(cs.marginRight),
                bottom: parseInt(cs.borderBottomWidth) + parseInt(cs.marginBottom)
            }
        },

        graphSize() {
            let size = { height: 0, width: 0 };
            let container = this.$refs.container;
            let svg = this.$refs.svg;
            if (svg && container) {
                let spacing = this.svgSpacing;
                size.height = container.clientHeight - spacing.top - spacing.bottom;
                size.width = container.clientWidth - spacing.left - spacing.right;
            }
            return size;
        },

        updateFn() {
            let fn = buildDiagram(this.$refs.svg, this);
            return graph => this.$nextTick(() => fn(graph));
        }

    },

    methods: {

        onResize(el) {
            this.width = parseInt(el.clientWidth);
            this.height = parseInt(el.clientHeight);
            this.centerDiagram();
        },
        
        // shuffle entire graph to middle
        centerDiagram() {
            let offsetContainer = this.$refs.offsetContainer;
            if (offsetContainer) {
                let translate = `translate(${this.width/2}, 200)`;
                console.log("offset now", translate);
                offsetContainer.setAttribute("transform", translate);
            }
        }

    },

    watch: {
        
        graph(newGraph) {
            console.log("heard graph change, calling updateFn")
            this.updateFn(newGraph);
        },

        // mutate graph instead of redrawing whole thing
        selection(newSelection) {
            for(let [key, node] of this.graph)
                node.selected = newSelection.has(key);
            console.log("selection changed, calling updateFn");
            this.updateFn(this.graph);
        },

        graphCenter(windowCenter) {
            console.log("graphCenter", windowCenter);
            // if (windowCenter !== null) {
            //     zoomDiagram(this.$refs.svg, windowCenter);
            // }
        }
    },

    mounted() {
        console.log("component mounted, calling updateFn");
        this.updateFn(this.graph);
    }
}

</script>

<style src="./graphStyles.scss" lang="scss"></style>
