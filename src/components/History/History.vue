<template>
    <div class="history" v-if="history">

        <!-- main graphs -->
        <div class="history-graph-container">
            <history-graph 
                :graph="historyGraph"
                :selection="selection" 
                :graphCenter="graphCenter"
                @selectDataset="onSelectDataset"
                @hoverNode="onHoverNode" />
            <history-graph 
                :graph="historyGraph"
                :selection="selection" 
                :graphCenter="graphCenter"
                @selectDataset="onSelectDataset"
                @hoverNode="onHoverNode" />
        </div>

        <history-editor ref="editor" 
            v-resize:debounce.initial="onEditorResize"
            :history="history" 
            :selectedDatasets="selectedDatasets"
            :hoverDataset="hoverDataset"
            @unselectDataset="onUnselectDataset"
            @createJob="onCreateJob" />

        <hover-selection 
            v-if="hoverSelection" 
            :graph="historyGraph"
            :itemKey="hoverSelection" />

        <!-- job node toggle -->
        <div class="jobToggle">
            <input type="checkbox" v-model="showJobs" /> Jobs
        </div>

    </div>
</template>

<script>

import resize from 'vue-resize-directive';
import { setIntersect } from "@/setUtilities.js";

import HistoryGraph from "./HistoryGraph/Graph";
import HistoryEditor from "./HistoryEditor";
import HoverSelection from "./HoverSelection";

import { DatasetNode, generateGraph, generateJoblessGraph } 
    from "./HistoryGraph/generateGraph";


export default {

    directives: {
        resize
    },

    components: { 
        HistoryGraph, 
        HistoryEditor,
        HoverSelection
    },

    props: {
        // showJobs: { type: Boolean, required: false, default: true },
        // id: { type: String, required: true }
        value: { type: Object, required: true }
    },

    data() {
        return {
            showJobs: true,
            selection: new Set(),
            // history: null,
            hoverSelection: null,
            graphCenter: null
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

        // full data graph
        historyGraph() {
            let graph = generateGraph(this.history);
            if (!this.showJobs) {
                graph = generateJoblessGraph(graph);
            }
            return graph;
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
        onSelectDataset(id) {
            let s = new Set(this.selection);
            s.has(id) ? s.delete(id) : s.add(id);
            this.selection = s;
        },
        onUnselectDataset(id) {
            let s = new Set(this.selection);
            s.delete(id)
            this.selection = s;
        },
        onHoverNode(o) {
            this.hoverSelection = o;
        },
        onEditorResize(container) {
            console.log("editor resized", arguments);
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
    position: fixed;
    top: 100px;
    left: 20px;
    z-index: 20;
}

</style>