import { histories, tools } from "./testData";

export async function loadHistoryById(id) {
    let history = histories.get(id);
    history.id = id;
    return history;
}

export async function getTools() {
    return tools;
}