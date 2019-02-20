<template>
    <section class="dataset-selection">
        
        <header v-if="hasSelection">
            <h4>Inputs</h4>
        </header>

        <!-- list of selected inputs -->
        <ol>
            <li v-for="ds in selectedDatasets">
                <selected-dataset class="dataset" :dataset="ds" 
                    @click="$emit('clickDataset', $event)" />
            </li>
            <li v-if="hoverDataset">
                <selected-dataset class="dataset hoverselect" :dataset="hoverDataset" />
            </li>
        </ol>
    
        <!-- selected tool -->
        <h4>Operaton</h4>
        <a class="button" :class="{ tool }" @click.prevent="$emit('unselectTool')">
            {{ toolLinkLabel }}
        </a>

        <!-- operation buttons -->
        <h4>Actions</h4>
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
        selectedDatasets: { type: Array, required: true },
        hoverDataset: { type: Dataset, required: false, default: null },
        tool: { type: Tool, required: false, default: null }
    },
    computed: {
        hasSelection() {
            return this.selectedDatasets.length > 0;
        },
        toolLinkLabel() {
            return this.tool ? this.tool.name.substr(0,10) + "...": "Tool goes here";
        }
    }
}

</script>
