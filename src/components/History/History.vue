<template>
    <div class="history" v-if="history">
        <div class="history-graphs">
            
            <history-graph 
                :graph="filteredHistoryGraph"
                :selection="selection" 
                :focus="focus"
                :graphCenter="graphCenter"
                :buildDiagram="buildDagDiagram"
                @clickNode="focusNode">

                <div class="search-radius">
                    <input type="number" 
                        name="searchRadius" 
                        min="1" max="10" 
                        v-model="searchRadius" />
                    <label for="searchRadius">
                        Window Radius
                    </label>
                </div>

                <job-toggle v-model="showJobs" />

            </history-graph>

            <history-graph 
                :graph="historyGraph"
                :selection="selection" 
                :focus="focus"
                :graphCenter="graphCenter"
                :buildDiagram="buildDagDiagram"
                @clickNode="toggleNodeSelect"
                @hoverNode="onMainHover">

                <hover-selection 
                    v-if="hoverSelection" 
                    :graph="historyGraph"
                    :itemKey="hoverSelection.id" />

            </history-graph>

        </div>

        <history-editor ref="editor"
            :history="history" 
            :selectedDatasets="selectedDatasets"
            :hoverDataset="hoverDataset"
            @unselectDataset="onUnselectDataset"
            @createJob="onCreateJob" />

    </div>
</template>


<script>

import resize from 'vue-resize-directive';
import { setIntersect } from "@/utilities/setUtilities.js";

import JobToggle from "./JobToggle";
import HistoryGraph from "./Graph";
import HistoryEditor from "./HistoryEditor";
import HoverSelection from "./HoverSelection";

import { Dataset } from "./model";
import { generateHistoryGraph, generateJoblessGraph, generateFocusedGraph, selectNodesOnGraph } 
    from "./generateGraph";

import { buildDagDiagram } from "./dagDiagram";

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
            searchRadius: 3,
            graphCenter: null,
            currentSelection: new Set(),
            currentFocus: null, // node we're focused on
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
                result = generateJoblessGraph(this.historyGraph);
            }
            if (this.searchRadius && this.focus) {
                result = generateFocusedGraph(result, this.focus, this.searchRadius);
            }
            return result;
        },

        
        selectedDatasets() {
            let datasets = Array.from(this.selection).filter(node => node instanceof Dataset);
            return new Set(datasets);
        },

        hoverDataset() {
            let result = null;
            if (this.hoverSelection && (this.hoverSelection instanceof Dataset)) {
                result = this.hoverSelection;
            }
            return this.selection.has(result) ? null : result;
        },

        focus: {
            get() {
                if (this.currentFocus) {
                    let foundNode = this.historyGraph.hasVertex(this.currentFocus.id);
                    if (foundNode) {
                        return this.currentFocus;
                    }
                }
                return null;
            },
            set(newFocus) {
                this.currentFocus = newFocus;
            }
        },

        selection: {
            get() {
                if (this.currentSelection.size) {
                    let result = new Set();
                    let newMembers = Array.from(this.currentSelection).filter(o => {
                        return this.historyGraph.hasVertex(o.id);
                    });
                    return new Set(newMembers);
                }
                return new Set();
            },
            set(newSelection) {
                this.currentSelection = newSelection;
            }
        }

    },

    methods: {

        focusNode(node) {
            if (node instanceof Dataset) {
                this.focus = node;
            }
        },

        toggleNodeSelect(node) {
            // console.log("toggleNodeSelect", node);
            if (!node) {
                return;
            }
            let s = new Set(this.selection);
            s.has(node) ? s.delete(node) : s.add(node);
            this.selection = s;
        },

        onUnselectDataset(dataset) {
            let s = new Set(this.selection);
            s.delete(dataset)
            this.selection = s;
        },

        clearSelection() {
            this.selection = new Set();
        },

        onCreateJob({ tool, toolParams }) {
            this.$emit("runJob", { tool, toolParams, selection: this.selectedDatasets });
        },

        onMainHover(node) {
            this.focusNode(node);
            this.hoverSelection = node;
        }

    }
}

</script>

<style src="./styles/index.scss" lang="scss"></style>

<style lang="scss">

.jobToggle {
    position: absolute;
    bottom: 3em;
    right: 3em;
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