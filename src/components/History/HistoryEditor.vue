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
                    <a @click.prevent="onRunToolClick">
                        Run Tool
                    </a>
                </li>
                <li v-if="selectedDatasets.size > 1">
                    <a @click.prevent="$emit('groupSelection')">
                        Group Selected Nodes
                    </a>
                </li>
            </ul>

        </dataset-selection>

        <tool-list @toolSelected="onToolSelected" />

        <tool-parameters :tool="tool" 
            v-model="toolParamsValid" 
            @paramsValid="onParamsValid" />

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
            toolParams: {},
            toolParamsValid: false
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
                "hide-dataset-selection": !this.hasSelection,
                "hide-tool-list": !this.hasSelection || this.hasTool,
                "hide-tool-parameters": !this.hasTool || this.toolParamsValid
            }
        },

        canCreate() {
            return this.hasSelection && this.hasTool && this.toolParamsValid;
        }
    },

    methods: {
  
        onParamsValid({ params, isValid }) {
            console.log("onParamsValid", isValid, params);
            this.toolParamsValid = isValid;
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
        },

        onRunToolClick() {
            if (this.hasSelection && this.hasTool && this.toolParamsValid) {
                let { tool, toolParams } = this;
                this.$emit('createJob', { tool, toolParams })
            }
        }
    },

    watch: {
        tool(newTool) {
            this.toolParamsValid = false;
        }
    }
}

</script>

<style src="./styles/index.scss" lang="scss"></style>
