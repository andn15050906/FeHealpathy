import { get, post, patch, del } from '@/scripts/api/apiClients';
import { getUserProfile } from "@/scripts/api/services/authService";
import { getProgress } from '@/scripts/api/services/statisticsService';

const API_BASE_URL = '/Roadmaps';

export const getRoadmaps = async (queryParams = {}) => {
    return await get(`${API_BASE_URL}`, queryParams);    
};

export const createRoadmap = async (roadmapData) => {
    return await post(`${API_BASE_URL}`, roadmapData);
};

export const updateRoadmap = async (roadmapData) => {
    return await patch(`${API_BASE_URL}`, roadmapData);
};

export const deleteRoadmap = async (roadmapId) => {
    return await del(`${API_BASE_URL}/${roadmapId}`);
};


export const getRoadmapById = async (id) => {
  try {
    const response = await get(`${API_BASE_URL}/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    throw error;
  }
};



export const getCurrentRoadmapWithProgress = async () => {
  let roadmapPromise = getRoadmaps();
  let progressPromise = getProgress();
  await Promise.all([roadmapPromise, progressPromise]);
  let roadmap = (await roadmapPromise).items.find(_ => _.id == getUserProfile().roadmapId);
  if (!roadmap)
    return null;

  let phasesProgress = (await progressPromise).progress;
  let completedMilestones = phasesProgress.map(_ => _.milestone);

  roadmap.phases = roadmap.phases?.sort((a, b) => a.index - b.index) ?? [];
  for (let phase of roadmap.phases) {
    let isPhaseCompleted = true;
    for (let milestone of phase.milestones) {
      if (completedMilestones.includes(milestone.id))
        milestone.progress = 'Completed 📈';
      else
        isPhaseCompleted = false;
    }

    phase.progress = isPhaseCompleted;
    if (!isPhaseCompleted && !roadmap.currentPhase)
      roadmap.currentPhase = phase;
  }
  if (!roadmap.currentPhase)
    roadmap.isCompleted = true;
  
  return roadmap;
}