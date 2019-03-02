<template>
    <section class="history-graph" ref="container" v-resize.initial="onResize">
        <svg ref="svg" :height="height" :width="width" 
            v-zoom="'.zoomContainer'">
            <g ref="offsetContainer">
                <g class="zoomContainer">
                    <g class="edges"></g>
                    <g class="nodes"></g>
                </g>
            </g>
        </svg>
        <slot></slot>
    </section>
</template>


<script>

import zoom from "./zoom";
import resize from "vue-resize-directive";
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
        selection: { type: Set, required: true },
        buildDiagram: { type: Function, required: true }
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
            return this.buildDiagram(this.$refs.svg, this);
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
                // console.log("offset now", translate);
                offsetContainer.setAttribute("transform", translate);
            }
        }

    },

    watch: {
        
        graph(newGraph) {
            console.log("heard graph change, calling updateFn")
            this.updateFn(newGraph, this.selection);
        },

        // mutate graph instead of redrawing whole thing
        selection(newSelection) {
            console.log("heard selection change, calling updateFn");
            this.updateFn(this.graph, newSelection);
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

<style src="./styles/graphStyles.scss" lang="scss"></style>
