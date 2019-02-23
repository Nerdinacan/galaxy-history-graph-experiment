import { createDataset, createJob, createTool } from "./model";


let indexToId = source => i => {
    return source[i].id;
};

let mapJobInputs = source => job => {
    let newJob = Object.assign({}, job);
    newJob.inputs = job.inputs.map(indexToId(source));
    newJob.outputs = job.outputs.map(indexToId(source));
    return newJob;
}

let buildDatasets = n => {
    return Array(n).fill({})
        .map((props, i) => createDataset({ ...props, id: `dataset-${i}` }));
}

let buildJobData = (datasets, jobData) => {
    return jobData
        .map(mapJobInputs(datasets))
        .map((props, i) => createJob({ ...props, id: `job-${i}` }));
}




// Little Set

export const littleDatasets = buildDatasets(4);

export const littleJobs = buildJobData(littleDatasets, [ 
    { inputs: [0,1], outputs: [2] },
    { inputs: [1,2], outputs: [3] }
]);

// console.log("littleDatasets", littleDatasets);
// console.log("littleJobs", littleJobs);



// Big Set

export const bigDatasets = buildDatasets(10);

export const bigJobs = buildJobData(bigDatasets, [
    { inputs: [1,0], outputs: [2] },
    { inputs: [2,1], outputs: [3] },
    { inputs: [0,3], outputs: [4,5,6] },
    { inputs: [2,3], outputs: [7] },
    { inputs: [4,5], outputs: [8] },
    { inputs: [6], outputs: [] }
]);

// console.log("bigDatasets", bigDatasets);
// console.log("bigJobs", bigJobs);



// 2 histories

export const histories = new Map();
histories.set(0, { datasets: littleDatasets, jobs: littleJobs });
histories.set(1, { datasets: bigDatasets, jobs: bigJobs });



// Big list of Fake tools

export const tools = Array(400).fill(0).map(createTool);
