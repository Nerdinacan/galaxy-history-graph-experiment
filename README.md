# historygraph

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Steps
x Perform an update of the graph
x Zoom
x Pan
x Select Event

Zoom/Pan diagram to center on selected node

Created "Windowed" scrollable graph, shows portion of history within designated "radius"
of selected point, move with mouse-wheel by picking random parent

Diagram:  Fly-out labels for tags, size, etc. on rollover in main graph instead
of static rollover location

Diagram:  Build "kraken" layout instead of stock force-directed layout, less
motion, try to avoid crossing the edges as much

Diagram: edge links should be arrows with little pointers indicating direction of processing

Selection operations: 
    Select all between two selected nodes by shortest route
    Select complete set of descendents for a given dataset
    Collapse Nodes into a group

Panels: Slide-in tool selection and tools parameters side-panels

Loading Indicator: 
    Show different style of "loading" edges and nodes for operations that are pending

