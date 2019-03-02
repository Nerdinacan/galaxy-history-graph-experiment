<template>
    <div ref="editor" class="history-editor-panels" :class="statusClasses">

        <dataset-selection
            :selectedDatasets="selectedDatasets"
            :hoverDataset="hoverDataset" 
            :tool="tool"
            @clickDataset="$emit('unselectDataset', $event)"
            @clickTool="onToolClick">
            
            <ul>
                <li v-if="hasTool" :class="{ ready: canCreate }">
                    <a @click.prevent="$emit('createJob', { tool, toolParams })">
                        Create Job
                    </a>
                </li>
                <!-- <li v-if="hasSelection">
                    <a @click.prevent="onGroup">
                        Group Selected Nodes
                    </a>
                </li> -->
            </ul>

        </dataset-selection>

        <tool-list
            :history="history" 
            :selectedDatasets="selectedDatasets" 
            @toolSelected="onToolSelected" />

        <!-- <tool-parameters 
            :tool="tool"
            @paramsValid="onParamsValid" /> -->

    </div>
</template>

<script>

import DatasetSelection from "./DatasetSelection";
import ToolList from "./ToolList";
import ToolParameters from "./ToolParameters";

import { loadHistoryById } from "./service";
import { Dataset } from "./model";


export default {

    components: { 
        DatasetSelection, 
        ToolList,
        ToolParameters
    },

    props: { 
        "history": { required: true }, 
        "selectedDatasets": { type: Set, required: true }, 
        "hoverDataset": { type: Dataset, required: false, default: null }, 
        "graphCenter": { required: false }
    },

    data() {
        return {
            tool: null,
            toolParams: {}
        }
    },

    computed: {
        
        hasSelection() {
            return this.selectedDatasets.size > 0;
        },

        hasTool() {
            return this.tool !== null;
        },

        // show hide panels by adding classes to container
        statusClasses() {
            return {
                "dataset-selection": this.hasSelection,
                "tool-list": this.hasSelection && !this.hasTool,
                "tool-parameters": this.hasSelection && this.hasTool
            }
        },

        canCreate() {
            return this.hasSelection && this.hasTool;
        }
    },

    methods: {
  
        onParamsValid(isValid, params) {
            console.log("onParamsValid", isValid, params);
        },

        onGroup() {
            console.log("onGroup");
        },

        // when selected tool box is clicked
        onToolClick(tool) {
            if (this.tool) {
                this.tool = null;
            }
            this.toggleList = true;
        },

        // when tool is selected from th tool list
        onToolSelected(tool = null) {
            this.tool = tool;
            this.toggleList = false;
        }
    }
}

</script>

<style src="./styles/index.scss" lang="scss"></style>
