import uuidv4 from "uuid/v4";
import { createDataset, createJob, createTool } from "./lib/model";


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


// Big Set

export const bigDatasets = buildDatasets(11);

export const bigJobs = buildJobData(bigDatasets, [
    { inputs: [1,0], outputs: [2] },
    { inputs: [2,1], outputs: [3] },
    { inputs: [0,3], outputs: [4,5,6] },
    { inputs: [2,3], outputs: [7] },
    { inputs: [4,5], outputs: [8] },
    { inputs: [6], outputs: [9] }
]);


// Very small
export const verySmall = buildDatasets(3);

export const verSmallJobs = buildJobData(verySmall, [
    { inputs: [0], outputs: [1] },
    { inputs: [0,1], outputs: [2] }
]);


// 2 histories

export const histories = new Map();
histories.set(0, { id: 0, datasets: littleDatasets, jobs: littleJobs });
histories.set(1, { id: 1, datasets: bigDatasets, jobs: bigJobs });
histories.set(2, { id: 2, datasets: buildDatasets(1), jobs: [] });
histories.set(3, { id: 3, datasets: verySmall, jobs: verSmallJobs });



// Big list of Fake tools

export const tools = Array(400).fill(0).map(createTool);



/**
 * Build a random history with provided dataset count
 * @param {integer} datasetCount 
 */
export async function loadRandomHistory(jobCount) {

    // makes fake inputs/outputs from that dataset
    let jobMap = buildRandomJobMap(parseInt(jobCount));

    // get set of all datasetIDs from jobMap
    let ids = new Set();
    jobMap.forEach(m => {
        m.inputs.forEach(id => ids.add(id));
        m.outputs.forEach(id => ids.add(id));
    });

    // make datasets
    let datasets = Array.from(ids).map(id => createDataset({ id: `dataset-${id}` }));

    // makes jobs out of the parts
    let jobs = jobMap
        .map(jd => {
            return {
                inputs: jd.inputs.map(id => `dataset-${id}`),
                outputs: jd.outputs.map(id => `dataset-${id}`)
            }
        })
        .map((props, i) => createJob({ ...props, id: `job-${i}` }));

    // Ta-daaa a history
    return { id: uuidv4(), datasets, jobs };
}


function buildRandomJobMap(jobCount) {

    // keep moving forward;
    let lastDS = 0

    let jobMap = Array(jobCount).fill(0).map((job, jobnum) => {

        // pick 1-4 random datasets
        let inputCount = randomNum(1,4);
        let inputArray = Array(inputCount).fill(0).map((arr, i) => {
            let val = randomNum(0, lastDS + inputCount);
            lastDS = Math.max(lastDS, val);
            return val;
        });
        let inputSet = new Set(inputArray);


        // 0-4 outputs
        let outputCount = randomNum(1,3);
        let outputArray = Array(outputCount).fill(0).map((arr, i) => {
            let val = randomNum(lastDS + inputCount, lastDS + inputCount + outputCount);
            lastDS = Math.max(lastDS, val);
            return val;
        });
        let outputSet = new Set(outputArray);

        return { 
            inputs: Array.from(inputSet),
            outputs: Array.from(outputSet)
        };
    });

    return jobMap;
}

function randomNum(start, end) {
    let numVals = end - start;
    return start + Math.floor( Math.random() * 10000 ) % numVals;
}