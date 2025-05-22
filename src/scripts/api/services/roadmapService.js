import { getUserProfile } from "@/scripts/api/services/authService";
import { getProgress } from '@/scripts/api/services/statisticsService';
import { get, post, patch, del, postForm } from "@/scripts/api/apiClients"

const API_BASE_URL = "/Roadmaps"

export const getRoadmaps = async (queryParams = {}) => {
  try {
    const response = await get(API_BASE_URL)

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

export const getRoadmapById = async (roadmapId) => {
  try {
    const response = await get(API_BASE_URL)

    if (!Array.isArray(response)) {
      console.warn("Unexpected roadmap response format", response)
      return null
    }

    return response.find(_ => _.id?.toLowerCase() == roadmapId?.toLowerCase());
  } catch (error) {
    console.error("Error fetching roadmaps:", error)
    return null
  }
}

export const getRoadmapSteps = async (roadmapId) => {
  try {
    const response = await get(API_BASE_URL)

    if (!Array.isArray(response)) {
      console.warn("Unexpected roadmap response format", response)
      return []
    }

    return response.find(_ => _.id?.toLowerCase() == roadmapId?.toLowerCase())?.phases ?? [];
  } catch (error) {
    console.error("Error fetching roadmaps:", error)
    return []
  }
}

export const getPhaseDetails = async (roadmapId, phaseId) => {
  try {
    const response = await get(API_BASE_URL)

    if (!Array.isArray(response)) {
      console.warn("Unexpected roadmap response format", response)
      return null
    }

    return response.find(_ => _.id?.toLowerCase() == roadmapId?.toLowerCase())?.phases?.find(_ => _.id?.toLowerCase() == phaseId?.toLowerCase());
  } catch (error) {
    console.error("Error fetching roadmaps:", error)
    return null
  }
}

export const getPhaseDetailsById = async (phaseId) => {
  try {
    const response = await get(API_BASE_URL)

    if (!Array.isArray(response)) {
      console.warn("Unexpected roadmap response format", response)
      return null;
    }

    for (let roadmap of response) {
      for (let phase of (roadmap?.phases ?? [])) {
        if (phase.id?.toLowerCase() == phaseId?.toLowerCase())
          return phase;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching roadmaps:", error)
    return null;
  }
}

export const createRoadmap = async (formData) => {
  try {
    const response = await postForm(API_BASE_URL, formData);
    return response;
  } catch (error) {
    console.error('Error creating roadmap:', error);
    throw error;
  }
}

export const updateRoadmap = async (data) => patch(API_BASE_URL, data)
export const deleteRoadmap = async (id) => del(`${API_BASE_URL}/${id}`)
export const getCompletionData = async () => get(`/recommendations/completion`)
export const getCompletionViewData = async () => get(`/recommendations/completion-view`)
export const getSuggestionData = async () => get(`/surveys?Name=First_Evaluation`)

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