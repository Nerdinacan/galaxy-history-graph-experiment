<template>
    <history v-if="history" v-model="history" @runJob="runJob" />
</template>

<script>

import History from "@/components/History/History";
import { loadHistoryById, loadRandomHistory, executeJob } 
    from "@/components/History/lib/service";

export default {
    components: {
        History
    },
    data() {
        return {
            history: null
        }
    },
    methods: {
        
        setHistory(history) {
            this.history = history;
        },

        runJob({ tool, toolParams, selection }) {

            executeJob(selection, tool, toolParams)
                .then(({ newDataset, newJob }) => {

                    // create new history object
                    let h = Object.assign({}, this.history);
                    h.datasets = [ ...h.datasets, newDataset ];
                    h.jobs = [ ...h.jobs, newJob ];

                    this.history = h;
                })
                .catch(err => {
                    console.warn("save job all messed-up", err);
                });
        }
    },
    beforeRouteEnter(to, from, next) {
        loadHistoryById(to.params.id)
            .then(h => {
                next(vm => vm.setHistory(h));
            });
    },
    beforeRouteUpdate(to, from, next) {
        loadHistoryById(to.params.id)
            .then(h => {
                this.setHistory(h);
                next();
            });
    }
}

</script>