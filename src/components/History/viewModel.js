export function DatasetNode(ds, props = {}) {
    this.selected = false;
    this.dataset = ds;
    Object.assign(this, props);
}

export function JobNode(job, props = {}) {
    this.selected = false;
    this.job = job;
    Object.assign(this, props);
}

export function PlaceHolderNode(connectedTo, isIncoming) {
    this.id = `placeholder-${PlaceHolderNode.counter++}`;
    this.startKey = isIncoming ? this.id : connectedTo.id;
    this.endKey = isIncoming ? connectedTo.id : this.id;
    this.type = "placeholder";
}

PlaceHolderNode.counter = 0;