import { histories, tools } from "./testData";
import { createDataset, createJob } from "./model";
import uuidv4 from "uuid/v4";

export async function loadHistoryById(id) {
    return histories.get(parseInt(id));
}

export async function getTools() {
    return tools;
}

/**
 * Creates a single new dataset from a tool and a set of inputs, 
 * this is a temp function. In reality several output sets might
 * be generated.
 * 
 * @param {Set} inputs  Set of input dataset ids
 * @param {*} tool Tool description
 * @param {*} toolParams Paraeters for the tool
 */
export async function executeJob(inputs, tool, toolParams) {

    // console.log("executeJob", inputs, tool, toolParams);
    
    if (!tool) {
        throw new Error("missing tool");
    }
    if (!inputs.size) {
        throw new Error("no selected inputs");
    }  

    // Gin up a new result set
    let newDataset = createDataset({ id: uuidv4() });

    let newJob = createJob({
        id: uuidv4(),
        inputs: Array.from(inputs).map(input => input.id),
        outputs: [ newDataset.id ],
    });

    return { newJob, newDataset };
}

