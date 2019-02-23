<template>
    <main>
        <temp-nav />
        <router-view/>
    </main>
</template>

<script>

import TempNav from "@/components/Nav";

export default {
    components: { TempNav }
}

</script>

<style lang="scss">

main {
    margin: 0;
    padding: 0;
    font-family: Arial;
    position: relative;
}

</style>