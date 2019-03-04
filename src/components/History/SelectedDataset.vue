<template>
    <a href="#" class="button" @click.prevent="$emit('click', dataset)">
        {{ dataset.id }}
    </a>
</template>

<script>

import { Dataset } from "./lib/model";

export default {
    props: {
        dataset: { type: Dataset, required: true }
    }
}

</script>



<style lang="scss" scoped>
    
@import "./styles/colors";

.button:hover {
    background-color: $warning-color;
}

</style>