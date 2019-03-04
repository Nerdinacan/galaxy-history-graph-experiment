<template>
    <section v-if="item" :class="classDef" class="hover-selection">
        <h4>{{ item.constructor.name }}</h4>
        <h1>{{ itemKey }}</h1>
        <p>in: {{ incoming.join(", ") }}</p>
        <p>out: {{ outgoing.join(", ") }}</p>
    </section>
</template>

<script>

import Graph from "graph.js";
import { Dataset, Job } from "./lib/model";

export default {
    props: {
        graph: { type: Graph, required: true },
        itemKey: { type: String, required: true },
    },
    computed: {
        item() {
            if (this.itemKey) {
                return this.graph.vertexValue(this.itemKey);
            }
            return null;
        },
        incomingNodes() {
            if (this.itemKey) {
                return Array.from(this.graph.verticesTo(this.itemKey));
            }
            return [];
        },
        outgoingNodes() {
            if (this.itemKey) {
                return Array.from(this.graph.verticesFrom(this.itemKey));
            }
            return [];
        },
        incoming() {
            return this.incomingNodes.map(([key]) => key);
        },
        outgoing() {
            return this.outgoingNodes.map(([key]) => key);
        },
        classDef() {
            return {
                "dataset": (this.item instanceof Dataset),
                "job": (this.item instanceof Job)
            }
        }
    }
}

</script>

<style src="./styles/hoverSelection.scss" lang="scss"></style>