<template>
    <section class="tool-parameters">
        <header>
            <h4>Tool params</h4>
        </header>
        <form>
            <input type="checkbox" v-model="isValid">
            <label>Pretend params are valid</label>
        </form>
    </section>
</template>

<script>
export default {
    props: {
        value: { type: Boolean, required: true }
    },
    data() {
        return {
            params: {}
        }
    },
    computed: {
        isValid: {
            get() {
                return this.value;
            },
            set(newval) {
                this.$emit("input", newval);
            }
        }
    }
}
</script>