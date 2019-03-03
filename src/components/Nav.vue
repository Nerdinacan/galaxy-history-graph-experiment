<template>
    <header id="masthead">
        <nav>
            <ul>
                <li><a class="button" href="/#/history/0">Small</a></li>
                <li><a href="/#/history/1">Medium</a></li>
                <li><a href="/#/history/2">One Dot</a></li>
                <li><a href="/#/history/3">Very Small</a></li>
                <!-- <li><a href="/#/history/random/100">Random graph</a></li> -->
            </ul>
        </nav>
    </header>
</template>


<style lang="scss" scoped>

header {
    position: fixed;
    top: 1em;
    left: 1em;
    widows: auto;
    height: auto;
    z-index: 10;
    nav ul {
        display: flex;
        li {
            margin-right: 6px;
        }
    }
}

</style>