<template>
    <section class="dataset-selection">

        <header v-if="hasSelection">
            <h4>Inputs</h4>
        </header>
        <ol>
            <li v-for="ds of selectedDatasets">
                <selected-dataset class="dataset" :dataset="ds" 
                    @click="$emit('clickDataset', $event)" />
            </li>
            <li v-if="hoverDataset">
                <selected-dataset class="dataset hoverselect" 
                    :dataset="hoverDataset" />
            </li>
        </ol>


        <header>
        	<h4>Operaton</h4>
        </header>
        <a class="button" :class="toolClasses" 
            @click.prevent="$emit('clickTool', tool)">
            {{ toolLinkLabel }}
        </a>


        <header>
            <h4>Actions</h4>
        </header>
        <slot></slot>


    </section>
</template>

<script>

import SelectedDataset from "./SelectedDataset";
import { Tool, Dataset} from "./model";

export default {

    components: {
        SelectedDataset
    },

    props: {
        selectedDatasets: { type: Set, required: true },
        hoverDataset: { type: Dataset, required: false, default: null },
        tool: { type: Tool, required: false, default: null }
    },

    computed: {

        toolClasses() {
            return {
                tool: this.tool
            }
        },

        hasSelection() {
            return this.selectedDatasets.size > 0;
        },

        toolLinkLabel() {
            return this.tool 
                ? this.tool.name.substr(0,10) + "..." 
                : "Tool goes here";
        }
    }

}

</script>
