import { get } from "@/scripts/api/apiClients";
import { getUserProfile } from "@/scripts/api/services/authService";
import { getProgress } from '@/scripts/api/services/statisticsService';

export const getRoadmaps = async () => {
  return await get(`/Roadmaps`);
};






export const getCurrentRoadmapWithProgress = async () => {
  let roadmap = (await getRoadmaps()).items.find(_ => _.id == getUserProfile().roadmapId);
  let phasesProgress = await getProgress();
  let completedMilestones = [];
  for (let phaseProgress of phasesProgress) {
    completedMilestones = [...completedMilestones, ...JSON.parse(phaseProgress.milestonesCompleted)]
  }

  for (let phase of roadmap.phases) {
    let isPhaseCompleted = true;
    for (let milestone of phase.milestones) {
      if (completedMilestones.includes(milestone.id)) {
        milestone.progress = 'Completed 📈';
      }
      else {
        isPhaseCompleted = false;
      }
    }
    phase.progress = isPhaseCompleted;
    if (!isPhaseCompleted && !roadmap.currentPhase)
      roadmap.currentPhase = phase;
  }
  
  console.log(roadmap);
  return roadmap;
}