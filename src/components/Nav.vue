<template>
    <header id="masthead">
        <nav>
            <ul>
                <li><a href="/#/history/0">Small</a></li>
                <li><a href="/#/history/0/1">Small (no jobs)</a></li>
                <li><a href="/#/history/1">Medium</a></li>
                <li><a href="/#/history/1/1">Medium (no jobs)</a></li>
            </ul>
        </nav>
    </header>
</template>


<style lang="scss" scoped>

header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: auto;
    z-index: 10;

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