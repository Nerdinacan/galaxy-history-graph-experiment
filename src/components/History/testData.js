import uuidv4 from "uuid/v4";

import { createDataset, createJob, createTool } from "./model";


const indexToId = source => i => source[i].id;

const mapJobInputs = source => job => {
    let newJob = Object.assign({}, job);
    newJob.inputs = job.inputs.map(indexToId(source));
    newJob.outputs = job.outputs.map(indexToId(source));
    return newJob;
}


// Little Set

export const littleDatasets = Array(4).fill(0).map(createDataset);

let littleJobData = [ 
    { inputs: [0,1], outputs: [2] },
    { inputs: [0,2], outputs: [3] }
];

export const littleJobs = littleJobData
    .map(mapJobInputs(littleDatasets))
    .map(createJob);


// Big Set

export const bigDatasets = Array(9).fill(0).map(createDataset);

let bigJobData = [
    { inputs: [0,1], outputs: [2] },
    { inputs: [0,2], outputs: [3] },
    { inputs: [0,3], outputs: [4,5,6] }
];

export const bigJobs = bigJobData
    .map(mapJobInputs(bigDatasets))
    .map(createJob);


// 2 histories

export const histories = new Map();
histories.set(0, { datasets: littleDatasets, jobs: littleJobs });
histories.set(1, { datasets: bigDatasets, jobs: bigJobs });



// Big list of Fake tools

export const tools = Array(400).fill(0).map(createTool);
