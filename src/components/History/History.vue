<template>
    <div class="history" v-if="history">

        <!-- main graphs -->
        <div class="history-graph-container">
        
            <history-graph 
                :graph="entireHistory"
                :selection="selection" 
                :graphCenter="graphCenter"
                :buildDiagram="buildKrakenDiagram"
                @clickNode="onGraphNodeClick"
                @hoverNode="doHoverSelect">

                <hover-selection 
                    v-if="hoverSelection" 
                    :graph="fullGraph"
                    :itemKey="hoverSelection" />

            </history-graph>
           
            <history-graph 
                :graph="historyFocusedOnSelection"
                :selection="selection" 
                :graphCenter="graphCenter"
                :buildDiagram="buildForceDiagram"
                @clickNode="doHoverSelect">
                <job-toggle v-model="showJobs" />
            </history-graph>

        </div>

        <!-- <history-editor ref="editor" 
            v-resize:debounce.initial="onEditorResize"
            :history="history" 
            :selectedDatasets="selectedDatasets"
            :hoverDataset="hoverDataset"
            @unselectDataset="onUnselectDataset"
            @createJob="onCreateJob" /> -->

    </div>
</template>

<script>

import resize from 'vue-resize-directive';
import { setIntersect } from "@/utilities/setUtilities.js";

import JobToggle from "./JobToggle";
import HistoryGraph from "./HistoryGraph/Graph";
import HistoryEditor from "./HistoryEditor";
import HoverSelection from "./HoverSelection";

import { DatasetNode, generateGraph, generateJoblessGraph, focusedGraph } 
    from "./HistoryGraph/generateGraph";

import { buildKrakenDiagram } from "./HistoryGraph/krakenDiagram";
import { buildForceDiagram } from "./HistoryGraph/forceDiagram";

export default {

    directives: {
        resize
    },

    components: { 
        HistoryGraph, 
        HistoryEditor,
        HoverSelection,
        JobToggle
    },

    props: {
        value: { type: Object, required: true }
    },

    data() {
        return {
            showJobs: true,
            selection: new Set(),
            hoverSelection: null,
            graphCenter: null,

            buildKrakenDiagram,
            buildForceDiagram
        }
    },

    computed: {

        history() {
            return this.value;
        },

        selectedDatasets() {
            let ids = Array.from(this.selection);
            let ds = ids.map(id => this.getDatasetById(id));
            return new Set(ds);
        },
      
        hoverDataset() {
            if (this.hoverSelection) {
                let ds = this.getDatasetById(this.hoverSelection);
                if (ds) {
                    if (!this.selection.has(ds.id)) {
                        return ds;
                    }
                }
            }
            return null;
        },

        // Graphs

        fullGraph() {
            return generateGraph(this.history);
        },

        joblessGraph() {
            return generateJoblessGraph(this.fullGraph);
        },

        entireHistory() {
            return this.showJobs ? this.fullGraph : this.joblessGraph;
        },

        // history graph focused around the hoverselection
        historyFocusedOnSelection() {
            return focusedGraph(this.entireHistory, this.hoverSelection, 1);
        }
        
    },

    watch: {
        history(newHistory, oldHistory) {
            this.$nextTick(() => {
                let newDsIds = newHistory.datasets.map(ds => ds.id);
                let intersection = setIntersect(newDsIds, this.selection);
                this.selection = intersection;
            })
        }
    },

    methods: {
        getDatasetById(id) {
            if (this.history) {
                let datasets = this.history.datasets;
                return datasets.find(ds => ds.id == id)
            }
            return null;
        },
        onGraphNodeClick(nodeData) {
            if (nodeData instanceof DatasetNode) {
                let id = nodeData.id;
                let s = new Set(this.selection);
                s.has(id) ? s.delete(id) : s.add(id);
                this.selection = s;
            }
        },
        onUnselectDataset(id) {
            let s = new Set(this.selection);
            s.delete(id)
            this.selection = s;
        },
        doHoverSelect(o) {
            // keeps existing hover even on mouse-out
            if (o) {
                this.hoverSelection = o;
            }
        },
        onEditorResize(container) {
            // console.log("editor resized", arguments);
            // let container = this.$refs.container;
            // let editor = this.$refs.editor;
            // this.graphCenter = {
            //     x: (container.clientWidth - editor.clientWidth) / 2,
            //     y: editor.clientHeight / 2
            // }
        },
        onCreateJob(payload) {
            this.$emit("runJob", Object.assign({}, payload, {
                selection: this.selection
            }));
        },

        // reCenterGraph() {
        //     let container = this.$refs.container;
        //     let editor = this.$refs.editor;
        //     this.graphCenter = {
        //         x: (container.clientWidth - editor.clientWidth) / 2,
        //         y: editor.clientHeight / 2
        //     }
        // }
    }
}

</script>

<style src="./styles/index.scss" lang="scss"></style>

<style>

.jobToggle {
    position: absolute;
    top: 18px;
    left: 18px;
    z-index: 20;
}

</style>