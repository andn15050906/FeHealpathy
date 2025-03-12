import { get } from "@/scripts/api/apiClients";

export const getRoadmaps = async () => {
  return await get(`/Roadmaps`);
};

export const getProgress = async () => {
  return await get(`/RoadmapProgress`);
}