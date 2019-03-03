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
            <defs>
                <marker id="arrow"
                    markerUnits="strokeWidth"
                    markerWidth="12"
                    markerHeight="12"
                    viewBox="0 0 12 24"
                    refX="19"
                    refY="6"
                    orient="auto">
                    <path d="M2,2 L10,6 L2,10 L6,6 L2,2" 
                        style="fill: #ccc"></path>
                </marker>
            </defs>
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
        focus: { type: Object, required: false, default: null },
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

        graphParams() {
            let { graph, selection, focus } = this;
            return { graph, selection, focus };
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
        
        // update graph when important props change
        graphParams({ graph, selection, focus }) {
            this.$nextTick(() => {
                this.updateFn(graph, selection, focus);
            })
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
        this.updateFn(this.graph, this.selection, this.focus);
    }
}

</script>

<style src="./styles/graphStyles.scss" lang="scss"></style>
