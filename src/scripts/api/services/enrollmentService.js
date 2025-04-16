import { get } from '@/scripts/api/apiClients';

const API_BASE_URL = '/Enrollments';

export const getEnrollments = async (params = { pageIndex: 0, pageSize: 20 }) => {
  try {
    const queryParams = {
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
      isGetEnrolledCourse: true
    };

    console.log('Calling API with params:', queryParams);

    const response = await get(API_BASE_URL, queryParams);
    console.log('API Response:', response);
    
    if (!response) {
      return {
        items: [],
        totalCount: 0,
        pageIndex: 0,
        pageSize: params.pageSize,
        pageCount: 0
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return {
      items: [],
      totalCount: 0,
      pageIndex: 0,
      pageSize: params.pageSize,
      pageCount: 0
    };
  }
};