<template>
    <div class="container">
        <div class="card shadow-sm">
            <div class="card-header bg-white py-3">
                <h2 class="mb-0" style="font-weight: 600;">Tiến độ lộ trình</h2>
            </div>
            <div class="card-body">
                <p>{{ roadmap.introText }}</p>

                <ul class="nav nav-tabs mb-4" id="roadmapTabs">
                    <li class="nav-item" v-for="phase in roadmap.phases?.sort((a, b) => a.index - b.index)"
                        :key="phase.id">
                        <button class="nav-link" :class="[
                            activeTab === phase.id ? 'active' : '',
                            getPhaseTabClass(phase)
                        ]" @click="activeTab = phase.id">
                            <i v-if="isPhaseCompleted(phase)" class="bi bi-check-circle-fill me-1"></i>
                            {{ phase.title }}
                        </button>
                    </li>
                </ul>

                <div v-for="phase in roadmap.phases?.sort((a, b) => a.index - b.index)" :key="phase.id"
                    :ref="'phase-' + phase.id">
                    <div class="card mb-4">
                        <div class="card-header py-3" :class="getPhaseHeaderClass(phase)">
                            <div class="d-flex align-items-center">
                                <h5 class="mb-0">{{ phase.title }}</h5>
                                <i v-if="isPhaseCompleted(phase)" class="bi bi-check-circle-fill ms-2"></i>
                                <i v-else-if="isPhaseInProgress(phase)" class="bi bi-clock-history ms-2"></i>
                            </div>
                        </div>
                        <div class="card-body">
                            <p class="text-muted">{{ phase.description }}</p>

                            <div class="table-responsive">
                                <table class="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th scope="col">Tiêu đề</th>
                                            <th scope="col" class="text-center">Số lần thực hiện</th>
                                            <th scope="col" class="text-center">Tiến độ</th>
                                            <th scope="col" class="text-center">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in phase.milestones?.sort((a,b) => a.index - b.index)" :key="item.id"
                                            :class="getMilestoneClass(item)">
                                            <td>{{ item.title }}</td>
                                            <td class="text-center">{{ item.repeatTimesRequired }}</td>
                                            <td class="text-center">
                                                <span>{{ getProgressText(item) }}</span>
                                                <i class="ms-1" :class="getProgressIcon(item)"></i>
                                            </td>
                                            <td class="text-center">
                                                <button v-if="item.status == 'current'" class="btn btn-primary btn-sm"
                                                    @click="gotoLinkByEvent(item)">
                                                    {{ text.Follow }}
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getProgress } from '@/scripts/api/services/statisticsService';
import { getLinkByEventLabel, getLinkByObjectId } from '@/scripts/api/services/activityLogService';
import { getCurrentRoadmapWithProgress } from '@/scripts/api/services/roadmapService';

export default {
    data() {
        return {
            text: {
                Follow: 'Theo dõi'
            },
            activeTab: null,
            roadmap: {},
            phasesStatus: {}
        }
    },
    async beforeMount() {
        let tempRoadmap = await getCurrentRoadmapWithProgress();
        let phasesProgress = (await getProgress()).progress;
        let completedMilestones = phasesProgress.map(_ => _.milestone);

        for (let phase of tempRoadmap.phases) {
            let completedCount = 0;
            phase.totalMilestones = phase.milestones.length;

            let belowLocked = false;
            for (let milestone of phase.milestones.sort((a, b) => a.index - b.index)) {
                if (belowLocked) {
                    milestone.status = 'locked';
                    milestone.progress = 'Hãy hoàn thành bước trước';
                    continue;
                }

                if (tempRoadmap.isCompleted) {
                    milestone.status = 'completed';
                    milestone.progress = 'Đã hoàn thành';
                    completedCount++;
                }
                else if (tempRoadmap.currentPhase) {
                    if (phase.index < tempRoadmap.currentPhase.index) {
                        milestone.status = 'completed';
                        milestone.progress = 'Đã hoàn thành';
                        completedCount++;
                    }
                    else if (phase.index > tempRoadmap.currentPhase.index) {
                        milestone.status = 'locked';
                        milestone.progress = 'Hãy hoàn thành bước trước';
                    }
                    else if (completedMilestones.includes(milestone.id)) {
                        milestone.status = 'completed';
                        milestone.progress = 'Đã hoàn thành';
                        completedCount++;
                    } else {
                        milestone.status = 'current';
                        milestone.progress = 'Đang thực hiện';
                    }
                }

                if (milestone.status == 'current' && milestone.isRequired) {
                    belowLocked = true;
                }
            }

            this.phasesStatus[phase.id] = {
                completed: completedCount === phase.totalMilestones,
                inProgress: phase.id == tempRoadmap.currentPhase?.id,
                completedCount: completedCount,
                totalMilestones: phase.totalMilestones
            };
        }

        this.roadmap = tempRoadmap;

        if (!this.activeTab && tempRoadmap.phases.length > 0) {
            for (let phase of tempRoadmap.phases) {
                if (this.phasesStatus[phase.id].inProgress) {
                    this.activeTab = phase.id;
                    break;
                }
            }

            if (!this.activeTab) {
                for (let phase of tempRoadmap.phases) {
                    if (!this.phasesStatus[phase.id].completed) {
                        this.activeTab = phase.id;
                        break;
                    }
                }
            }

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
            switch (milestone.status) {
                case 'completed':
                    return 'table-primary';
                case 'current':
                    return 'table-success';
                default:
                    return 'table-light';
            }
        },
        getProgressText(milestone) {
            return milestone.progress || 'Chưa bắt đầu';
        },
        getProgressIcon(milestone) {
            switch (milestone.status) {
                case 'completed':
                    return 'bi bi-check-circle-fill text-primary';
                case 'current':
                    return 'bi bi-rocket-takeoff-fill text-success';
                default:
                    return 'bi bi-lock-fill text-secondary';
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
                return 'text-primary phase-completed';
            } else if (this.isPhaseInProgress(phase)) {
                return 'text-success phase-progress';
            } else {
                return 'text-secondary phase-locked';
            }
        },
        getPhaseHeaderClass(phase) {
            if (this.isPhaseCompleted(phase)) {
                return 'bg-light-primary';
            } else if (this.isPhaseInProgress(phase)) {
                return 'bg-light-success';
            } else {
                return 'bg-light';
            }
        },
        gotoLinkByEvent(milestone) {
            if (milestone.recommendations?.length > 0) {
                this.$router.push({ path: getLinkByObjectId(milestone.eventName, milestone.recommendations[0].targetEntityId) });
            }
            else {
                this.$router.push({ path: getLinkByEventLabel(milestone.eventName) });
            }
        }
    }
};
</script>

<style>
/* Bootstrap icons - add link to bootstrap icons in your main index.html */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css");

.bg-light-primary {
    background-color: rgba(13, 110, 253, 0.05);
}

.bg-light-success {
    background-color: rgba(25, 135, 84, 0.05);
}

.nav-tabs .nav-link {
    border-radius: 0;
    font-weight: 500;
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    transition: all 0.2s ease;
}

.nav-tabs .nav-link.active {
    font-weight: 700;
    font-size: 1.15rem;
    padding-top: 0.65rem;
    padding-bottom: 0.65rem;
}

.phase-completed.active {
    border-bottom: 3px solid #0d6efd !important;
}

.phase-progress.active {
    border-bottom: 3px solid #198754 !important;
}

.phase-locked.active {
    border-bottom: 3px solid #6c757d !important;
}

.card-header {
    border-bottom: 0;
}

.table> :not(caption)>*>* {
    padding: 0.75rem 1rem;
}

.table>tbody>tr.table-primary {
    --bs-table-bg: rgba(13, 110, 253, 0.1);
    font-weight: 500;
}

.table>tbody>tr.table-success {
    --bs-table-bg: rgba(25, 135, 84, 0.1);
    font-weight: 500;
    border-left: 4px solid #198754;
}

.table>tbody>tr.table-light {
    --bs-table-bg: rgba(108, 117, 125, 0.05);
    color: #6c757d;
}

.btn-primary {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.btn-primary:hover {
    background-color: #0b5ed7;
    border-color: #0a58ca;
}

.card {
    border: none;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-body {
    padding: 1.5rem;
}

.shadow-sm {
    box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075) !important;
}
</style>