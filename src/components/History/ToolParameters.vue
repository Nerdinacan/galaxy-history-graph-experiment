<template>
    <section class="tool-parameters">
        <header>
            <h4>Tool Parameters for:</h4>
            <h2>{{ tool.name }}</h2>
        </header>
        <form>

            <fieldset>
                <input type="text" placeholder="stuff" />
                <label>Enter a thing...</label>
            </fieldset>

            <fieldset>
                <input type="text" placeholder="more stuff" />
                <label>Enter a thing...</label>
            </fieldset>

            <fieldset>
                <input type="text" placeholder="yet more stuff" />
                <label>Enter a thing...</label>
            </fieldset>

            <div class="buttons">
                <a class="button" @click.prevent="validate">Pretend Params Are Valid</a>
            </div>

        </form>
    </section>
</template>

<script>

export default {
    props: {
        value: { type: Boolean, required: true },
        tool: { type: Object, required: true }
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
    },
    methods: {
        validate() {
            this.isValid = true;
        }
    }
}

</script>
