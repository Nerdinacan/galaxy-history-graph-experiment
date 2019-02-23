<template>
    <section class="history-graph" v-resize:debounce.initial="onResize">
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

    props: {
        graph: { type: Graph, required: true },
        graphCenter: { type: Object, required: false, default: null },
        selection: { type: Set, required: true },
    },

    data() {
        return {
            height: 0,
            width: 0
        }
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

        updateFn() {
            let fn = buildDiagram(this.$refs.svg, this);
            return graph => this.$nextTick(() => fn(graph));
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

    methods: {

        onResize(container) {
            let spacing = this.svgSpacing;
            Object.assign(this, { 
                height: container.clientHeight - spacing.top - spacing.bottom, 
                width: container.clientWidth - spacing.left - spacing.right
            });
            // this.$nextTick(() => this.updateFn(this.graph));
        }
    },

    mounted() {
        this.updateFn(this.graph);
    }
}

</script>

<style src="./graphStyles.scss" lang="scss"></style>
