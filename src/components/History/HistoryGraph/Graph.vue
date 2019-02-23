<template>
    <section class="history-graph" ref="container" v-resize:debounce.initial="onResize">
        <svg ref="svg" :height="height" :width="width">
            <rect class="zoomCatcher" :height="height" :width="width" />
            <g class="zoomContainer">
                <g class="links"></g>
                <g class="nodes"></g>
            </g>
        </svg>
    </section>
</template>

<script>

import resize from 'vue-resize-directive';
import { buildDiagram } from "./diagram";
import Graph from "graph.js";

export default {

    directives: {
        resize
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

        onResize() {
            Object.assign(this, this.graphSize);
        }

    },

    watch: {
        
        graph(newGraph) {
            this.updateFn(newGraph);
        },

        // mutate graph instead of redrawing whole thing
        selection(newSelection) {
            // console.log("selection changed", newSelection);
            for(let [key, node] of this.graph)
                node.selected = newSelection.has(key);
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
        this.updateFn(this.graph);
    }
}

</script>

<style src="./graphStyles.scss" lang="scss"></style>
