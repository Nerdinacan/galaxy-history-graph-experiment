<template>
    <section class="testButtons">
        <nav>
            <a @click.prevent="bigGraph">Big Graph</a>
            <a @click.prevent="littleGraph">Little Graph</a>
        </nav>
    </section>
</template>

<script>

import { testDatasets, testJobs, testDatasets2, testJobs2 } from "./testData";

export default {
    methods: {

        loadHistory(id) {
            this.$store.dispatch("loadHistoryGraph", id);
        },

        bigGraph() {
            this.loadHistory(2);
        },

        littleGraph() {
            this.loadHistory(1);
        }
    }
}
</script>

<style lang="scss">

.testButtons {
    position: fixed;
    bottom: 2em;
    left: 2em;
    z-index: 1;
    
    a {
        margin-right: 1em;
        display: inline-block;
        padding: 6px;
        &:hover {
            background-color: black;
            color: white;
        }
    }
}

</style>