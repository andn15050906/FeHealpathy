import { get } from "@/scripts/api/apiClients";
import { getUserProfile } from "@/scripts/api/services/authService";
import { getProgress } from '@/scripts/api/services/statisticsService';

export const getRoadmaps = async () => {
  return await get(`/Roadmaps`);
};






export const getCurrentRoadmapWithProgress = async () => {
  let roadmapPromise = getRoadmaps();
  let progressPromise = getProgress();
  await Promise.all([roadmapPromise, progressPromise]);
  let roadmap = (await roadmapPromise).items.find(_ => _.id == getUserProfile().roadmapId);
  let phasesProgress = await progressPromise;
  let completedMilestones = [];
  for (let phaseProgress of phasesProgress) {
    completedMilestones = [...completedMilestones, ...JSON.parse(phaseProgress.milestonesCompleted)]
  }

  roadmap.phases = roadmap.phases?.sort((a, b) => a.index - b.index) ?? [];
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
  if (!roadmap.currentPhase)
    roadmap.isCompleted = true;
  
  //console.log(roadmap);
  return roadmap;
}