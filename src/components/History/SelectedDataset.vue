<template>
    <a href="#" @click.prevent="$emit('click', dataset)">
        {{ dataset.id }}
    </a>
</template>

<script>

import { Dataset } from "./model";

export default {
    props: {
        dataset: { type: Dataset, required: true }
    }
}

</script>
