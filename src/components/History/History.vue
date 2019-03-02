<template>
    <div class="history" v-if="history">
        <div class="history-graph-container">
            

            <history-graph 
                :graph="filteredHistoryGraph"
                :selection="selection" 
                :graphCenter="graphCenter"
                :buildDiagram="buildDagDiagram">

                <div class="search-radius">
                    <input type="number" 
                        name="searchRadius" 
                        min="1" max="10" 
                        v-model="searchRadius" />
                    <label for="searchRadius">
                        Window Radius
                    </label>
                </div>

            </history-graph>
       
            <history-graph 
                :graph="historyGraph"
                :selection="selection" 
                :graphCenter="graphCenter"
                :buildDiagram="buildDagDiagram"
                @clickNode="toggleNodeSelect"
                @hoverNode="focusNode">

                <job-toggle v-model="showJobs" />
    
                <hover-selection 
                    v-if="hoverSelection" 
                    :graph="historyGraph"
                    :itemKey="hoverSelection.id" />

            </history-graph>

        </div>

        <!--
        <history-editor ref="editor" 
            v-resize:debounce.initial="onEditorResize"
            :history="history" 
            :selectedDatasets="selectedDatasets"
            :hoverDataset="hoverDataset"
            @unselectDataset="onUnselectDataset"
            @createJob="onCreateJob" />

        -->

    </div>

</template>

<script>

import resize from 'vue-resize-directive';
import { setIntersect } from "@/utilities/setUtilities.js";

import JobToggle from "./JobToggle";
import HistoryGraph from "./Graph";
// import HistoryEditor from "./HistoryEditor";
import HoverSelection from "./HoverSelection";

import { DatasetNode } from "./viewModel";
import { generateHistoryGraph, generateJoblessGraph, generateFocusedGraph, selectNodesOnGraph } 
    from "./generateGraph";

import { buildDagDiagram } from "./dagDiagram";

export default {

    directives: {
        resize
    },

    components: { 
        HistoryGraph, 
        // HistoryEditor,
        HoverSelection,
        JobToggle
    },

    props: {
        value: { type: Object, required: true }
    },

    data() {
        return {
            showJobs: true,
            searchRadius: 3,
            graphCenter: null,

            selection: new Set(), // set of nodes currently selected
            focus: null, // node we're focused on
            hoverSelection: null, // node we're mousing over

            buildDagDiagram
        }
    },

    computed: {

        history() {
            return this.value;
        },
        
        // Full graph of all loaded history elements
        historyGraph() {
            let result = generateHistoryGraph(this.history);
            // result = selectNodesOnGraph(result, this.selection);
            return result;
        },

        // local view
        filteredHistoryGraph() {
            
            let result = this.historyGraph;
            
            if (!this.showJobs) {
                let joblessResult = generateJoblessGraph(this.historyGraph);
                console.log("same object?", result == joblessResult);
                result = joblessResult;
            }

            let finalResult = generateFocusedGraph(result, this.focus, this.searchRadius);
            console.log("same object?", finalResult == result);
            result = finalResult;

            return result;
        },

        /*
        selectedDatasets() {
            let ids = Array.from(this.selection);
            let ds = ids.map(id => this.getDatasetById(id));
            return new Set(ds);
        },
      
        hoverDataset() {
            if (this.focus) {
                let ds = this.getDatasetById(this.focus);
                if (ds) {
                    if (!this.selection.has(ds.id)) {
                        return ds;
                    }
                }
            }
            return null;        },

        
        */
        
    },

    watch: {

        /*
        history(newHistory, oldHistory) {
            this.selection = new Set();
            this.focus = null;
            // this.$nextTick(() => {
            //     let newDsIds = newHistory.datasets.map(ds => ds.id);
            //     let intersection = setIntersect(newDsIds, this.selection);
            //     this.selection = intersection;
            // })
        }
        */
    },

    methods: {

        focusNode(node) {
            console.log("focusNode", node);
            this.focus = node;
        },

        toggleNodeSelect(node) {
            console.log("toggleNodeSelect", node);
            if (!node) {
                return;
            }
            let newSelection = new Set(this.selection);
            newSelection.has(node) 
                ? newSelection.delete(node) 
                : newSelection.add(node);
            this.selection = newSelection;
        },

        clearSelection() {
            this.selection = new Set();
        },

        /*
        // current selection that also exists in passed history
        relevantSelection(graph) {
            let nodes = Array.from(graph).map(([k,v]) => v);
            let intersection = setIntersect(this.selection, nodes);
            return intersection;
        },


        getDatasetById(id) {
            if (this.history) {
                let datasets = this.history.datasets;
                return datasets.find(ds => ds.id == id)
            }
            return null;
        },

        onGraphNodeClick(nodeData) {
            if (nodeData && nodeData.type == "dataset") {
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
                this.focus = o.id;
            }
        },

        changeFocus(o) {
            console.log("changeFocus", o);
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

        reCenterGraph() {
            let container = this.$refs.container;
            let editor = this.$refs.editor;
            this.graphCenter = {
                x: (container.clientWidth - editor.clientWidth) / 2,
                y: editor.clientHeight / 2
            }
        }
        */
    }
}

</script>

<style src="./styles/index.scss" lang="scss"></style>

<style lang="scss">

.jobToggle {
    position: absolute;
    top: 18px;
    left: 18px;
    z-index: 20;
}
.search-radius {
    position: absolute;
    left: 3em;
    bottom: 3em;
    z-index: 20;
    
    input[type="number"] {
        width:3em;
        font-size: 2em;
        display: block;
        margin-bottom: 0.5em;
    }
}

</style>