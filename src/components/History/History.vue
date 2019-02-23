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

            <!-- <history-graph 
                :graph="historyGraph"
                :selection="selection" 
                :graphCenter="graphCenter"
                @selectDataset="onSelectDataset"
                @hoverNode="onHoverNode" /> -->

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
            :item="hoverSelection" />

    </div>
</template>

<script>

import resize from 'vue-resize-directive';
import { setIntersect } from "@/setUtilities.js";

import HistoryGraph from "./HistoryGraph/Graph";
import HistoryEditor from "./HistoryEditor";
import HoverSelection from "./HoverSelection";

import { loadHistoryById, saveNewJob } from "./service";
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
        jobless: { type: Boolean, required: false, default: false },
        id: { type: String, required: true }
    },

    data() {
        return {
            selection: new Set(),
            history: null,
            hoverSelection: null,
            graphCenter: null
        }
    },

    computed: {

        selectedDatasets() {
            let ids = Array.from(this.selection);
            let ds = ids.map(id => this.getDatasetById(id));
            return new Set(ds);
        },
      
        hoverDataset() {
            if (this.hoverSelection instanceof DatasetNode) {
                let ds = this.getDatasetById(this.hoverSelection.id);
                if (!this.selection.has(ds.id)) {
                    return ds;
                }
            }
            return null;
        },

        // full data graph
        historyGraph() {
            let g = generateGraph(this.history);
            if (this.jobless) {
                let jobless = generateJoblessGraph(g); 
                return jobless;
            }
            return g;
        }
        
    },

    watch: {
        
        history(newHistory, oldHistory) {
            this.$nextTick(() => {
                let newDsIds = newHistory.datasets.map(ds => ds.id);
                let intersection = setIntersect(newDsIds, this.selection);
                this.selection = intersection;
            })
        },
        id(newHistoryId) {
            this.loadHistory(newHistoryId);
        }
    },

    methods: {
        loadHistory(id) {
            loadHistoryById(parseInt(id))
                .then(h => {
                    let newHistory = Object.assign({}, h);
                    this.history = newHistory;
                });
        },
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

        onCreateJob({ tool, toolParams }) {

            saveNewJob(this.selectedDatasets, tool, toolParams)
                .then(({ newDataset, newJob }) => {
                    // create and set new history                
                    let h = Object.assign({}, this.history);
                    h.datasets = [ ...h.datasets, newDataset ];
                    h.jobs = [ ...h.jobs, newJob ];
                    this.history = h;
                })
                .catch(err => {
                    console.warn("save job all messed-up", err);
                });
        },

        // reCenterGraph() {
        //     let container = this.$refs.container;
        //     let editor = this.$refs.editor;
        //     this.graphCenter = {
        //         x: (container.clientWidth - editor.clientWidth) / 2,
        //         y: editor.clientHeight / 2
        //     }
        // }
    },

    mounted() {
        this.loadHistory(this.id);
    }
    
}

</script>

<style src="./styles/index.scss" lang="scss"></style>
