import { get, patchForm } from '@/scripts/api/apiClients';
import apiClient from '@/scripts/api/apiClients';
import { getUsers } from './userService';

const API_BASE_URL = '/Advisors';


export const getAllAdvisors = async () => {
  try {
    let advisors = (await get(`${API_BASE_URL}`)).items;

    let advisor_users = [];
    for (let advisor of advisors) {
      let user = (await getUsers({ advisorId: advisor.id }))?.items?.shift() ?? null;
      advisor_users.push({
        advisorId: advisor.id,
        userId: user.id,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        creationTime: advisor.creationTime,
        intro: advisor.intro,
        experience: advisor.experience,
        balance: advisor.balance,
        courseCount: advisor.courseCount
      });
    }
    
    return advisor_users;
  }
  catch (error) {
    throw error;
  }
}

export const getAdvisorProfile = async (userId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}?UserId=${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdvisorProfile = async (advisorData) => {
    return await patchForm(`${API_BASE_URL}`, advisorData);
};
