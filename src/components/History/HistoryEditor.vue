<template>
    <div class="history" ref="container" :class="statusClasses" v-if="history">
        
        <history-graph 
            :history="history"
            :selection="selection" 
            :graphCenter="graphCenter"
            :jobless="jobless"
            @selectDataset="toggleSelectDataset"
            @hoverNode="onHoverNode" />

        <div ref="editor" class="history-editor-panels">

            <dataset-selection
                :selectedDatasets="selectedDatasets"
                :hoverDataset="hoverDataset" 
                :tool="tool"
                @clickDataset="unselectDataset"
                @selectNewTool="onSelectNewTool"
                @unselectTool="onUnselectTool">
                
                <ul>
                    <li>
                        <a :class="buttonClasses"
                            @click.prevent="createJob">
                            Create Job
                        </a>
                    </li>
                    <li>
                        <a v-if="selection.size > 1" 
                            :class="buttonClasses" 
                            @click.prevent="createJob">
                            Group Selected Nodes
                        </a>
                    </li>
                    <li>
                        <a @click.prevent="toggleList = !toggleList">
                            Toggle List
                        </a>
                    </li>
                    <li>
                        <a @click.prevent="toggleParams = !toggleParams">
                            Toggle Params
                        </a>
                    </li>
                </ul>

            </dataset-selection>

            <tool-list :history="history" 
                :selectedDatasets="selectedDatasets" 
                @toolSelected="onToolSelected" />

            <tool-parameters :tool="tool"
                @paramsValid="onParamsValid" />

        </div>

        <hover-selection 
            v-if="hoverSelection" 
            :item="hoverSelection" />

    </div>
</template>

<script>

import HistoryGraph from "./HistoryGraph/Graph";
import DatasetSelection from "./DatasetSelection";
import ToolList from "./ToolList";
import ToolParameters from "./ToolParameters";
import HoverSelection from "./HoverSelection";

import { createDataset, createJob } from "./model";
import { loadHistoryById } from "./service";
import { DatasetNode } from "./HistoryGraph/generateGraph";

export default {
    
    components: { 
        HistoryGraph, 
        DatasetSelection, 
        ToolList,
        ToolParameters,
        HoverSelection
    },

    props: {
        jobless: { type: Boolean, required: false, default: false },
        id: { type: String, required: true }
    },

    data() {
        return {
            selection: new Set(),
            tool: null,
            history: null,
            hoverSelection: null,

            toggleList: false,
            toggleParams: false,
            graphCenter: null
        }
    },

    computed: {
        
        hasSelection() {
            return this.selection.size > 0;
        },
        
        hasTool() {
            return this.tool !== null;
        },

        // selection ids -> models
        selectedDatasets() {
            let ids = Array.from(this.selection);
            return ids.map(id => this.getDatasetById(id));
        },

        // show hide panels by adding classes to container
        statusClasses() {
            return {
                "dataset-selection": this.hasSelection,
                "tool-list": this.toggleList,
                "tool-parameters": this.toggleParams
            }
        },

        // button appearance
        buttonClasses() {
            return {
                "disabled": !this.hasTool
            }
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

        showToolList() {
            return true;
        },

        showToolParams() {
            return true;
        }
    },

    watch: {
        history(newHistory, oldHistory) {
            if (newHistory && oldHistory) {
                if (newHistory.id !== oldHistory.id) {
                    this.selection = new Set();
                }
            }
        },
        id(newHistoryId) {
            this.loadHistory(newHistoryId);
        },
        statusClasses(newClasses) {
            this.$nextTick(() => this.reCenterGraph());
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
        toggleSelectDataset(id) {
            let s = new Set(this.selection);
            s.has(id) ? s.delete(id) : s.add(id);
            this.selection = s;
        },
        unselectDataset(id) {
            let s = new Set(this.selection);
            s.delete(id);
            this.selection = s;
        },
        onHoverNode(o) {
            this.hoverSelection = o;
        },

        // needs to open tool panel as well
        onSelectNewTool() {
            // console.log("onSelectNewTool");
            this.tool = null;
        },

        // unselect tool and open panel
        onUnselectTool() {
            // console.log("onUnselectTool");
            this.tool = null;
        },

        onToolSelected(tool) {
            // console.log("onToolSelected", tool);
            this.tool = tool;
        },

        onParamsValid(isValid, params) {
            // console.log("onParamsValid", isValid, params);
        },

        // Fake job creation
        createJob() {

            if (!(this.hasTool && this.hasSelection)) {
                return;
            }

            let newDs = createDataset({});

            let newJob = createJob({
                inputs: Array.from(this.selection.values()),
                outputs: [ newDs.id ],
            });

            let h = Object.assign({}, this.history);
            h.datasets = [ ...h.datasets, newDs ];
            h.jobs = [ ...h.jobs, newJob ];

            this.history = h;
            // Honestly can't remember why I have to do this...
            this.selection = new Set(this.selection.values());
        },

        reCenterGraph() {
            let container = this.$refs.container;
            let editor = this.$refs.editor;
            this.graphCenter = {
                x: (container.clientWidth - editor.clientWidth) / 2,
                y: editor.clientHeight / 2
            }
        }

    },

    mounted() {
        this.loadHistory(this.id);
    }
}

</script>

<style src="./styles/index.scss" lang="scss"></style>
