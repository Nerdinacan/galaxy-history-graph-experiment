<template>
    <section class="dataset-selection">


        <!-- This section summarizes the currently selected 
        parts we need to execute a new job -->

        <header>
            <h4>Current Operation</h4>
        </header>

        <ol v-if="selectedDatasets.size">
            <li v-for="ds of selectedDatasets">
                <selected-dataset class="dataset" :dataset="ds" 
                    @click="$emit('clickDataset', $event)" />
            </li>
            <li v-if="hoverDataset">
                <selected-dataset class="dataset hoverselect" 
                    :dataset="hoverDataset" />
            </li>
        </ol>
        <ol>
            <li>
                <a class="button tool-link" 
                    :class="toolClasses" 
                    @click.prevent="$emit('clickTool', tool)">
                    {{ tool ? tool.name : "Select Tool..." }}
                </a>
            </li>
        </ol>
        

        <header>
            <h4>Available Actions</h4>
        </header>

        <slot></slot>


    </section>
</template>

<script>

import SelectedDataset from "./SelectedDataset";
import { Tool, Dataset} from "./lib/model";

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
        }
    }

}

</script>

<style lang="scss">
    
@import "./styles/colors";

.button.tool {
    background-color: $ready-color;
    &:hover {
        background-color: $warning-color;
    }
}

</style>