<template>
    <section :class="item.type" class="hover-selection">
        <h4>{{ item.type }}</h4>
        <h1>{{ item.id.substr(0,16) }}...</h1>
    </section>
</template>

<script>
        
// import ToolSelection from "./ToolSelection";
// import ToolParameters from "./ToolParameters";

export default {
    props: {
        item: { type: Object, required: true }
    }
}

</script>
