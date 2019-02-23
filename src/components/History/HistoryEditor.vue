<template>
    <div ref="editor" class="history-editor-panels" :class="statusClasses">

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
                        @click.prevent="$emit('createJob', { tool, toolParams })">
                        Create Job
                    </a>
                </li>
                <li>
                    <a v-if="selectedDatasets.size > 1" 
                        :class="buttonClasses">
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
</template>

<script>

import DatasetSelection from "./DatasetSelection";
import ToolList from "./ToolList";
import ToolParameters from "./ToolParameters";

import { loadHistoryById } from "./service";
import { DatasetNode } from "./HistoryGraph/generateGraph";
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
            toggleList: false,
            toggleParams: false
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
                "tool-list": this.toggleList,
                "tool-parameters": this.toggleParams
            }
        },

         // button appearance
         buttonClasses() {
            return {
                "disabled": !this.hasTool
            }
        }
    },
    methods: {
  
        unselectDataset(id) {
            this.$emit("unselectDataset", id);
        },


        // DO WE NEED 3?

        // needs to open tool panel as well
        onSelectNewTool() {
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
            console.log("onParamsValid", isValid, params);
        }
    }
}

</script>

<style src="./styles/index.scss" lang="scss"></style>
