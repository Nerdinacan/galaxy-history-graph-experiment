<template>
    <header id="masthead">
        <nav>
            <ul>
                <li><a href="/#/history/2">One Dot</a></li>
                <li><a href="/#/history/0">Small</a></li>
                <li><a href="/#/history/3">Also Small</a></li>
                <li><a href="/#/history/1">Medium</a></li>
                <!-- <li><a href="/#/history/random/100">Random graph</a></li> -->
            </ul>
        </nav>
    </header>
</template>


<style lang="scss" scoped>

header {
    position: fixed;
    top: 0em;
    left: 0em;
    widows: auto;
    height: auto;
    z-index: 10;
    nav ul {
        display: flex;
        li {
            margin-right: 1px;
        }
    }
}

</style>