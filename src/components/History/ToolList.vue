<template>
    <section class="tool-list">
        <header>
            <h4>Tools</h4>
            <hgroup>
                <input type="filter" v-model="filter" />
            </hgroup>
        </header>
        <div class="content">
            <ol class="tool-search-results">
                <li class="tool" v-for="tool in filteredTools">
                    <a @click.prevent="$emit('toolSelected', tool)">{{ tool.name }}</a>
                </li>
            </ol>
        </div>
    </section>
</template>

<script>

import { getTools } from "./service";

export default {
    data() {
        return {
            tools: [],
            filter: ""
        }
    },
    computed: {
        filteredTools() {
            let matchRe = new RegExp(this.filter, "gi");
            return this.tools.filter(tool => {
                return tool.name.match(matchRe);
            })
        }
    },
    methods: {
        loadTools() {
            getTools().then(tools => {
                this.tools = tools;
            })
        }
    },
    mounted() {
        this.loadTools();
    }
}

</script>

<style lang="scss">

@import "./styles/colors";

.tool-list {

    header {
        margin-bottom: 1rem;
        
        hgroup input {
            width: 98%;
            border: none;
            border-bottom: 1px solid $tool-color;
            font-size: 1rem;
            outline: none;
            padding: 0;
            margin: 0;
            padding-bottom: 0.5rem;
        }
    }

    ol.tool-search-results {
        
        background-color: rgba(255,255,255,0.7);

        li.tool a {
            color: grey;
            background: transparent;
            border: none;
            &:hover {
                color: white;
                background: black;
            }
        }
    }

}

</style>