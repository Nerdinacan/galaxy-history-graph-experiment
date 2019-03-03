<template>    
    <div class="jobToggle">
        <input id="jobToggle" type="checkbox" v-model="jobToggle" />
        <label for="jobToggle">Show Jobs</label>
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