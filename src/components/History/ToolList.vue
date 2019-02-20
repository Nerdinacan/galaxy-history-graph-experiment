<template>
    <section class="tool-list">
        <header>
            <h4>Tools</h4>
        </header>
        <div class="content">
            <ol class="tool">
                <li v-for="tool in filteredTools">
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
            tools: []
        }
    },
    computed: {
        filteredTools() {
            return this.tools;
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
