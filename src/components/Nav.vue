<template>
    <header id="masthead">
        <nav>
            <ul>
                <li><a href="/#/history/0">Small</a></li>
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
    top: 0;
    left: 0;
    widows: auto;
    height: auto;
    z-index: 10;
    /* border: 1px solid red; */

    nav ul {
        
        list-style: none;
        padding-left: 0;        
        display: flex;
        margin: 10px;

        li {
            margin-right: 6px;
    
            a {
                color: rgba(0,0,0,0.5);
                /* background-color: white; */
                font-size: 1em;
                text-decoration: none;
                display: inline-block;
                padding: 8px;

                &:hover {
                    background-color: rgba(0,0,0,0.25);
                    color: white;
                }
            }
        }
    }
}

</style>