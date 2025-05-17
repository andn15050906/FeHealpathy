import { getUserProfile } from "@/scripts/api/services/authService";
import { getProgress } from '@/scripts/api/services/statisticsService';
import { get, post, patch, del } from "@/scripts/api/apiClients"

const API_BASE_URL = "/Roadmaps"

export const getRoadmaps = async (queryParams = {}) => {
  try {
    const response = await get(API_BASE_URL, queryParams)

    if (!Array.isArray(response)) {
      console.warn("Unexpected roadmap response format", response)
      return []
    }

    return response
  } catch (error) {
    console.error("Error fetching roadmaps:", error)
    return []
  }
}

export const createRoadmap = async (data) => post(API_BASE_URL, data)
export const updateRoadmap = async (data) => patch(API_BASE_URL, data)
export const deleteRoadmap = async (id) => del(`${API_BASE_URL}/${id}`)
export const getRoadmapById = async (id) => get(`${API_BASE_URL}/details/${id}`)
export const getPhaseDetails = async (roadmapId, phaseId) =>
  get(`${API_BASE_URL}/phase`, { roadmapId, phaseId })
export const getStepDetails = async (stepId) =>
  get(`${API_BASE_URL}/phase/${stepId}`)
export const getCompletionData = async () => get(`${API_BASE_URL}/completion`)
export const getCompletionViewData = async () =>
  get(`${API_BASE_URL}/completion-view`)
export const getSuggestionData = async () =>
  get(`${API_BASE_URL}/suggestions`)

// old code
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