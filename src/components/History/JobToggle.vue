<template>    
    <div class="jobToggle">
        <input type="checkbox" v-model="jobToggle" /> Show Jobs
    </div>  
</template>

<script>

export default {
    props: {
        value: { type: Boolean, required: true }
    },
    computed: {
        jobToggle: {
            get() {
                return this.value;
            },
            set(newToggle) {
                this.$emit("input", newToggle);
            }
        }
    }
}

</script>