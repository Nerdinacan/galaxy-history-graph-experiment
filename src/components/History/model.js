/**
 * Generate graph representation of list of datasets and jobs
 * https://www.geeksforgeeks.org/implementation-graph-javascript/
 */

import uuidv4 from "uuid/v4";

export function Dataset(props = {}) {
    this.id = null;
    this.type = "dataset";
    Object.assign(this, props);
}

export function Job(props = {}) {
    this.id = null;
    this.type = "job";
    this.inputs = [];
    this.outputs = [];
    Object.assign(this, props);
}

export function Tool(props = {}) {
    this.id = null;
    this.name = uuidv4();
    Object.assign(this, props);
}

export const createDataset = props => new Dataset(props);
export const createJob = props => new Job(props);
export const createTool = props => new Tool(props);

