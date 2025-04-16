<template>
    <v-container>
        <v-card>
            <v-card-title>
                <h1>Your roadmap progress</h1>
            </v-card-title>
            <v-card-text>
                <p>{{ roadmap.introText }}</p>
                <v-tabs v-model="activeTab">
                    <v-tab v-for="phase in roadmap.phases?.sort((a, b) => a.index - b.index)" :key="phase.id" :value="phase.id" :class="getPhaseTabClass(phase)">
                        <v-icon v-if="isPhaseCompleted(phase)" small class="mr-1">mdi-check-circle</v-icon>
                        {{ phase.title }}
                    </v-tab>
                </v-tabs>
                <div v-for="phase in roadmap.phases?.sort((a, b) => a.index - b.index)" :key="phase.id" :ref="'phase-' + phase.id">
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
                                        <td class="text-vertical-center">{{ item.title }}</td>
                                        <td class="text-center">{{ item.repeatTimesRequired }}</td>
                                        <!--<td class="text-center">{{ item.timeSpentRequired }}</td>-->
                                        <td class="text-center">
                                            <span>{{ getProgressText(item) }}</span>
                                            <v-icon small class="ml-1">{{ getProgressIcon(item) }}</v-icon>
                                        </td>
                                        <td class="text-center">
                                            <v-btn v-if="item.status == 'current'" class="navigate-btn"
                                                @click="gotoLinkByEvent(item)">{{ text.Follow }}</v-btn>
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { getProgress } from '@/scripts/api/services/statisticsService';
import { getLinkByEventLabel, getLinkByRecommendation } from '@/scripts/api/services/activityLogService';
import { getCurrentRoadmapWithProgress } from '@/scripts/api/services/roadmapService';

export default {
    computed: {
        getTableHeaders() {
            return [
                { title: 'Milestone Title', value: 'title', align: 'center' },
                { title: 'Repeat Times Required', value: 'repeatTimesRequired', align: 'center' },
                /*{ title: 'Time Spent Required', value: 'timeSpentRequired', align: 'center' },*/
                { title: 'Progress', value: 'progress', align: 'center' },
                { title: 'Action', value: 'eventName', align: 'center' }
            ];
        }
    },
    data() {
        return {
            text: {
                Follow: 'Follow'
            },
            activeTab: null,
            roadmap: {},
            phasesStatus: {} // Lưu trạng thái của từng phase
        }
    },
    async beforeMount() {
        let tempRoadmap = await getCurrentRoadmapWithProgress();
        let phasesProgress = await getProgress();
        let completedMilestones = [];
        for (let phaseProgress of phasesProgress) {
            completedMilestones = [...completedMilestones, ...JSON.parse(phaseProgress.milestonesCompleted)]
        }

        for (let phase of tempRoadmap.phases) {
            let completedCount = 0;
            phase.totalMilestones = phase.milestones.length;

            for (let milestone of phase.milestones) {
                if (tempRoadmap.isCompleted) {
                    milestone.status = 'completed';
                    milestone.progress = 'Completed';
                    completedCount++;
                }
                else if (tempRoadmap.currentPhase) {
                    if (phase.index < tempRoadmap.currentPhase.index) {
                        milestone.status = 'completed';
                        milestone.progress = 'Completed';
                        completedCount++;
                    }
                    else if (phase.index > tempRoadmap.currentPhase.index) {
                        milestone.status = 'locked';
                        milestone.progress = 'Not Started';
                    }
                    else {
                        if (completedMilestones.includes(milestone.id)) {
                            milestone.status = 'completed';
                            milestone.progress = 'Completed';
                            completedCount++;
                        } else {
                            milestone.status = 'current';
                            milestone.progress = 'In Progress';
                        }
                    }
                }
            }
            
            // Xác định trạng thái của phase
            this.phasesStatus[phase.id] = {
                completed: completedCount === phase.totalMilestones,
                inProgress: phase.id == tempRoadmap.currentPhase?.id,
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
        gotoLinkByEvent(milestone) {
            if (milestone.recommendations?.length > 0) {
                //console.log(milestone.eventName, milestone.recommendations[0].targetEntityId);
                //console.log(getLinkByRecommendation(milestone.eventName, milestone.recommendations[0].targetEntityId));
                this.$router.push({ path: getLinkByRecommendation(milestone.eventName, milestone.recommendations[0].targetEntityId) });
            }
            else {
                this.$router.push({ path: getLinkByEventLabel(milestone.eventName) });
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

.text-vertical-center {
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

.navigate-btn {
    color: #000000;
}
</style>