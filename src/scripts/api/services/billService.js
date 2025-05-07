import { getBlob } from '@/scripts/api/apiClients';

const API_BASE_URL = '/Bills';

export const exportReport = async () => {
  try {
    const response = await getBlob(`/api${API_BASE_URL}/report`, 'Revenue Report.xlsx');
    return response.data;
  } catch (error) {
    throw error;
  }
};