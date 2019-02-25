<template>
    <section v-if="item" :class="item.type" class="hover-selection">
        <h4>{{ item.type }}</h4>
        <h1>{{ itemKey.substr(0,16) }}</h1>
        <h3>in: {{ incoming.join(", ") }}</h3>
        <h3>out: {{ outgoing.join(", ") }}</h3>
    </section>
</template>

<script>

import Graph from "graph.js";

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
        }
    }
}

</script>
