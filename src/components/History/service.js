import { histories, tools } from "./testData";
import { createDataset, createJob } from "./model";
import uuidv4 from "uuid/v4";

export async function loadHistoryById(id) {
    let history = histories.get(id);
    history.id = id;
    return history;
}

export async function getTools() {
    return tools;
}

export async function saveNewJob(datasets, tool, toolParams) {

    console.log("saveNewJob", datasets, tool, toolParams);

    if (!tool) {
        throw new Error("missing tool");
    }
    if (!datasets.size) {
        throw new Error("no selected datasets");
    }  

    // Gin up a new result set
    let newDataset = createDataset({ id: uuidv4() });

    let newJob = createJob({
        id: uuidv4(),
        inputs: Array.from(datasets.values()).map(ds => ds.id),
        outputs: [ newDataset.id ],
    });

    return { newJob, newDataset };
}
