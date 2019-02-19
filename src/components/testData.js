const setType = type => o => Object.assign(o, { type });


// Before

export const testDatasets = [
    { id: "1", time: 0 },
    { id: "2", time: 0 },
    { id: "3", time: 2 }
].map(setType("dataset"));

export const testJobs = [
    { id: "a", inputs: ["1","2"], outputs: ["3"], time: 1 }
].map(setType("job"));


// After

export const testDatasets2 = [
    { id: "1", time: 0 },
    { id: "2", time: 0 },
    { id: "3", time: 2 },
    { id: "4", time: 4 },
    { id: "5", time: 6 },
    { id: "6", time: 6 },
    { id: "7", time: 6 }
].map(setType("dataset"));

export const testJobs2 = [
    { id: "a", inputs: ["1","2"], outputs: ["3"], time: 1 },
    { id: "b", inputs: ["1","3"], outputs: ["4"], time: 3 },
    { id: "c", inputs: ["1","4"], outputs: ["5","6","7"], time: 5 }
].map(setType("job"));

