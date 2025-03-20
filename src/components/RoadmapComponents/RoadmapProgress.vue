<template>
    <v-container>
        <v-card>
            <v-card-title>
                <h1>Your roadmap progress</h1>
            </v-card-title>
            <v-card-text>
                <p>{{ roadmap.introText }}</p>
                <v-tabs v-model="activeTab">
                    <v-tab v-for="phase in roadmap.phases" :key="phase.id" :value="phase.id" :class="getPhaseTabClass(phase)">
                        <v-icon v-if="isPhaseCompleted(phase)" small class="mr-1">mdi-check-circle</v-icon>
                        {{ phase.title }}
                    </v-tab>
                </v-tabs>
                <div v-for="phase in roadmap.phases" :key="phase.id" :ref="'phase-' + phase.id">
                <!--<v-tabs-items v-model="activeTab">
                    <v-tab-item v-for="phase in roadmap.phases" :key="phase.id">-->
                        <v-card>
                            <v-card-title :class="getPhaseHeaderClass(phase)">
                                {{ phase.title }}
                                <v-icon v-if="isPhaseCompleted(phase)" class="ml-2">mdi-check-circle</v-icon>
                                <v-icon v-else-if="isPhaseInProgress(phase)" class="ml-2">mdi-progress-clock</v-icon>
                            </v-card-title>
                            <v-card-subtitle>{{ phase.description }}</v-card-subtitle>
                            <v-card-text>
                                <v-data-table :headers="getTableHeaders" :items="phase.milestones" item-class="milestone-row">
                                    <template v-slot:item="{ item }">
                                        <tr :class="getMilestoneClass(item)">
                                            <td class="text-center">{{ item.title }}</td>
                                            <td class="text-center">
                                                <router-link :to="getLinkByEvent(item.eventName)">{{ item.eventName }}</router-link>
                                            </td>
                                            <td class="text-center">{{ item.repeatTimesRequired }}</td>
                                            <td class="text-center">{{ item.timeSpentRequired }}</td>
                                            <td class="text-center">
                                                <span>{{ getProgressText(item) }}</span>
                                                <v-icon small class="ml-1">{{ getProgressIcon(item) }}</v-icon>
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
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
import { getProgress } from '@/scripts/api/services/statisticsService';
import { getLinkByEvent } from '@/scripts/api/services/activityLogService';

export default {
    computed: {
        getTableHeaders() {
            return [
                { title: 'Milestone Title', value: 'title', align: 'center' },
                { title: 'Event Name', value: 'eventName', align: 'center' },
                { title: 'Repeat Times Required', value: 'repeatTimesRequired', align: 'center' },
                { title: 'Time Spent Required', value: 'timeSpentRequired', align: 'center' },
                { title: 'Progress', value: 'progress', align: 'center' }
            ];
        }
    },
    data() {
        return {
            activeTab: null,
            roadmap: {},
            currentMilestoneId: null,
            phasesStatus: {} // Lưu trạng thái của từng phase
        }
    },
    async beforeMount() {
        let tempRoadmap = (await getRoadmaps()).items[0];
        let phasesProgress = await getProgress();
        let completedMilestones = [];
        for (let phaseProgress of phasesProgress) {
            completedMilestones = [...completedMilestones, ...JSON.parse(phaseProgress.milestonesCompleted)]
        }

        console.log(completedMilestones);
        
        // Find current milestone (first non-completed one)
        let foundCurrent = false;
        
        for (let phase of tempRoadmap.phases) {
            let completedCount = 0;
            phase.totalMilestones = phase.milestones.length;
            
            for (let milestone of phase.milestones) {
                if (completedMilestones.includes(milestone.id)) {
                    milestone.status = 'completed';
                    milestone.progress = 'Completed';
                    completedCount++;
                    console.log(milestone);
                } else if (!foundCurrent) {
                    // First non-completed milestone is the current one
                    milestone.status = 'current';
                    milestone.progress = 'In Progress';
                    this.currentMilestoneId = milestone.id;
                    foundCurrent = true;
                } else {
                    // All other non-completed milestones are locked
                    milestone.status = 'locked';
                    milestone.progress = 'Not Started';
                }
            }
            
            // Xác định trạng thái của phase
            this.phasesStatus[phase.id] = {
                completed: completedCount === phase.totalMilestones,
                inProgress: completedCount > 0 && completedCount < phase.totalMilestones,
                completedCount: completedCount,
                totalMilestones: phase.totalMilestones
            };
        }
        
        this.roadmap = tempRoadmap;
        
        // Đặt active tab là phase đầu tiên chưa hoàn thành hoặc đang thực hiện
        if (!this.activeTab && tempRoadmap.phases.length > 0) {
            for (let phase of tempRoadmap.phases) {
                if (this.phasesStatus[phase.id].inProgress) {
                    this.activeTab = phase.id;
                    break;
                }
            }
            
            // Nếu không có phase nào đang thực hiện, chọn phase đầu tiên chưa hoàn thành
            if (!this.activeTab) {
                for (let phase of tempRoadmap.phases) {
                    if (!this.phasesStatus[phase.id].completed) {
                        this.activeTab = phase.id;
                        break;
                    }
                }
            }
            
            // Nếu vẫn không có, chọn phase đầu tiên
            if (!this.activeTab && tempRoadmap.phases.length > 0) {
                this.activeTab = tempRoadmap.phases[0].id;
            }
        }
    },
    watch: {
        activeTab(newVal) {
            console.log(newVal);
            this.scrollToPhase(newVal);
        },
    },
    methods: {
        scrollToPhase(phaseId) {
            const phaseElement = this.$refs['phase-' + phaseId];
            if (phaseElement) {
                phaseElement[0].scrollIntoView({ behavior: 'smooth' });
            }
        },
        getMilestoneClass(milestone) {
            return `milestone-${milestone.status || 'locked'}`;
        },
        getProgressText(milestone) {
            return milestone.progress || 'Not Started';
        },
        getProgressIcon(milestone) {
            switch(milestone.status) {
                case 'completed':
                    return 'mdi-check-circle';
                case 'current':
                    return 'mdi-rocket';
                default:
                    return 'mdi-lock';
            }
        },
        isPhaseCompleted(phase) {
            return this.phasesStatus[phase.id]?.completed || false;
        },
        isPhaseInProgress(phase) {
            return this.phasesStatus[phase.id]?.inProgress || false;
        },
        getPhaseTabClass(phase) {
            if (this.isPhaseCompleted(phase)) {
                return 'phase-tab-completed';
            } else if (this.isPhaseInProgress(phase)) {
                return 'phase-tab-in-progress';
            } else {
                return 'phase-tab-locked';
            }
        },
        getPhaseHeaderClass(phase) {
            if (this.isPhaseCompleted(phase)) {
                return 'phase-header-completed';
            } else if (this.isPhaseInProgress(phase)) {
                return 'phase-header-in-progress';
            } else {
                return 'phase-header-locked';
            }
        },
        getLinkByEvent
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
    text-align: center;
}

.v-simple-table td {
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
    text-align: center;
    vertical-align: middle;
}

.v-simple-table tr:hover {
    background-color: rgba(0, 123, 255, 0.05);
}

.v-data-table__td {
    text-align: center;
    vertical-align: middle;
}

/* Milestone status styles */
.milestone-completed {
    background-color: rgba(0, 123, 255, 0.15) !important;
    font-weight: bold;
    color: #0056b3;
}

.milestone-current {
    background-color: rgba(40, 167, 69, 0.15) !important;
    font-weight: bold;
    color: #28a745;
    border-left: 4px solid #28a745;
}

.milestone-locked {
    background-color: rgba(108, 117, 125, 0.1) !important;
    color: #6c757d;
}

.milestone-completed td {
    border-bottom: 1px solid rgba(0, 123, 255, 0.3);
}

.milestone-current td {
    border-bottom: 1px solid rgba(40, 167, 69, 0.3);
}

.milestone-locked td {
    border-bottom: 1px solid rgba(108, 117, 125, 0.2);
}

.text-center {
    text-align: center !important;
    vertical-align: middle !important;
}

/* Phase tab styles */
.phase-tab-completed {
    color: #0056b3 !important;
    background-color: rgba(0, 123, 255, 0.05);
}

.phase-tab-completed.v-tab--active {
    background-color: rgba(0, 123, 255, 0.15);
    border-bottom: 3px solid #0056b3;
}

.phase-tab-in-progress {
    color: #28a745 !important;
    background-color: rgba(40, 167, 69, 0.05);
}

.phase-tab-in-progress.v-tab--active {
    background-color: rgba(40, 167, 69, 0.15);
    border-bottom: 3px solid #28a745;
}

.phase-tab-locked {
    color: #6c757d !important;
}

.phase-tab-locked.v-tab--active {
    background-color: rgba(108, 117, 125, 0.1);
    border-bottom: 3px solid #6c757d;
}

/* Phase header styles */
.phase-header-completed {
    color: #0056b3;
    border-bottom: 2px solid rgba(0, 123, 255, 0.3);
}

.phase-header-in-progress {
    color: #28a745;
    border-bottom: 2px solid rgba(40, 167, 69, 0.3);
}

.phase-header-locked {
    color: #6c757d;
    border-bottom: 2px solid rgba(108, 117, 125, 0.2);
}
</style>

<!--<template>
    <div class="container">
        <div class="red-flag"></div>
        <div class="red-flag"></div>
        <div class="red-flag"></div>
        <div class="red-flag"></div>
    </div>
</template>

<script setup>

</script>

<style>
.container {
    background-image: url("/assets/images/roadmap/Roadmap.jpg");
    width: 100%;
    height: 80vh;
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center top;
}

.red-flag {
    width: 150px;
    height: 100px;
    background-image: url("/assets/images/roadmap/Flag_Red.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center top;
    /*background-attachment: fixed*/
}
</style>-->