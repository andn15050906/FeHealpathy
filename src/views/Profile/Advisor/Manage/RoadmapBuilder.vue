<template>
    <v-container>
        <v-card>
            <v-card-title>
                <h1>{{ roadmap.title }}</h1>
            </v-card-title>
            <v-card-text>
                <p>{{ roadmap.introText }}</p>
                <v-tabs v-model="activeTab">
                    <v-tab v-for="phase in roadmap.phases?.sort((a, b) => a.index - b.index)" :key="phase.id" :value="phase.id">
                        {{ phase.title }}
                    </v-tab>
                </v-tabs>
                <div v-for="phase in roadmap.phases?.sort((a, b) => a.index - b.index)" :key="phase.id" :ref="'phase-' + phase.id">
                <!--<v-tabs-items v-model="activeTab">
                    <v-tab-item v-for="phase in roadmap.phases" :key="phase.id">-->
                        <v-card>
                            <v-card-title>{{ phase.title }}</v-card-title>
                            <v-card-subtitle>{{ phase.description }}</v-card-subtitle>
                            <v-card-text>
                                <v-data-table :headers="getTableHeaders" :items="phase.milestones"></v-data-table>
                            </v-card-text>
                        </v-card>
                    <!--</v-tab-item>
                </v-tabs-items>-->
                </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { getRoadmaps } from '@/scripts/api/services/roadmapService';

export default {
    computed: {
        getTableHeaders() {
            return [
                { title: 'Tiêu đề', value: 'title'},
                { title: 'Tên sự kiện', value: 'eventName' },
                { title: 'Lặp lại lần', value: 'repeatTimesRequired' },
                { title: 'Thời gian cần thiết', value: 'timeSpentRequired' }
            ];
        }
    },
    data() {
        return {
            activeTab: null,
            roadmap: {}
        }
    },
    async beforeMount() {
        this.roadmap = (await getRoadmaps()).items[0];
    },
    watch: {
        activeTab(newVal) {
            this.scrollToPhase(newVal);
        },
    },
    methods: {
        scrollToPhase(phaseId) {
            const phaseElement = this.$refs['phase-' + phaseId];
            if (phaseElement) {
                phaseElement[0].scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
};
</script>

<style scoped>
.roadmap {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.phase {
    margin-bottom: 20px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
}

.milestones {
    margin-top: 10px;
}

.milestones ul {
    list-style-type: none;
    padding: 0;
}

.milestones li {
    margin: 5px 0;
}

.v-container {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.v-card {
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.v-card-title h1 {
    font-size: 2em;
    color: #333;
    margin: 0;
}

.v-card-text {
    padding: 20px;
}

.v-tabs {
    margin-top: 20px;
}

.v-tab {
    font-weight: bold;
    color: #007bff;
}

.v-tab:hover {
    background-color: rgba(0, 123, 255, 0.1);
}

.v-tabs-items {
    border-top: 1px solid #e0e0e0;
}

.v-card-subtitle {
    font-style: italic;
    color: #666;
}

.v-simple-table {
    width: 100%;
    margin-top: 10px;
}

.v-simple-table th {
    background-color: #007bff;
    color: white;
    padding: 10px;
    text-align: left;
}

.v-simple-table td {
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
}

.v-simple-table tr:hover {
    background-color: rgba(0, 123, 255, 0.05);
}

.v-data-table__td {
    text-align: center;
}
</style>