// Directed Graph

export class Graph {

    _edges = new Map();

    addVertex(v) {
        this._edges.set(v, new Set());
    }

    addEdge(v, w) {
        this.checkVertices(v, w);
        this._edges.get(v).add(w);
    }

    checkVertices(...vertices) {
        vertices.filter(v => !this._edges.has(v))
            .map(v => this.addVertex(v));
    }

    get vertices() {
        return Array.from(this._edges.keys());
    }

    get edges() {
       
        let result = [];
        
        this._edges.forEach(function(dest, source) {
            dest.forEach(function(d) {
                result.push({ source: source, target: d });
            })
        });

        return result;
    }

}
