<template>
    <div class="container" v-resize.initial="onResize">

        <!-- history/jobs directed graph -->
        <svg ref="svg" :height="height" :width="width">
            <g class="zoomContainer">
                <g class="links"></g>
                <g class="nodes"></g>
            </g>
        </svg>

        <!-- dummy data-update test buttons -->
        <button @click.prevent="changeGraphData">Update</button>
        <button @click.prevent="revertGraphData">Back</button>

    </div>
</template>

<script>

import resize from 'vue-resize-directive';
import { generateGraph } from "./generateGraph";
import { buildDiagram } from "./historyDiagram";
import { testDatasets, testJobs, testDatasets2, testJobs2 } from "./testData";

export default {
    
    directives: {
        resize
    },

    data() {
        return {
            graph: null, // data
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
            return buildDiagram(this.$refs.svg);
        }
    },

    watch: {
        graph(newGraphData) {
            this.updateFn(newGraphData);
        }
    },

    methods: {
        
        onResize(container) {
            let spacing = this.svgSpacing;
            Object.assign(this, { 
                height: container.clientHeight - spacing.top - spacing.bottom, 
                width: container.clientWidth - spacing.left - spacing.right
            });
            if (this.graph) {
                this.updateFn(this.graph);
            }
        },

        setGraphData(ds, jobs) {
            generateGraph(ds, jobs).then(g => this.graph = g);
        },

        // sample data changes
        changeGraphData() {
            this.setGraphData(testDatasets2, testJobs2);
        },
        revertGraphData() {
            this.setGraphData(testDatasets, testJobs);
        }
    },

    mounted() {
        this.setGraphData(testDatasets, testJobs);
    }
}

</script>

<style lang="scss" src="./styles.scss"></style>
