import { get, postForm, patchForm, del } from '../api/apiCall';

const API_BASE_URL = '/Articles';

export const getPagedArticles = async (queryParams = {}) => {
    return await get(`${API_BASE_URL}`, queryParams);
};

export const createArticle = async (articleData) => {
    return await postForm(`${API_BASE_URL}`, articleData);
};

export const updateArticle = async (articleData) => {
    const formData = new FormData();
    formData.append("Id", articleData.id);
    formData.append("Title", articleData.title);
    formData.append("Content", articleData.content);
    if (articleData.thumb) {
        formData.append("Thumb", articleData.thumb);
    }
    if (articleData.sections) {
        articleData.sections.forEach((section, index) => {
            formData.append(`Sections[${index}].Id`, section.id);
            formData.append(`Sections[${index}].Content`, section.content);
            if (section.addedMedia) {
                formData.append(`Sections[${index}].AddedMedia`, section.addedMedia);
            }
            if (section.removedMedia) {
                formData.append(`Sections[${index}].RemovedMedia`, section.removedMedia);
            }
        });
    }

    return await patchForm(`/Articles`, formData);
};



export const deleteArticle = async (articleId) => {
    return await del(`${API_BASE_URL}/${articleId}`);
};

export const getBlogById = async (blogId) => {
    try {
      const response = await get(`/Articles/${blogId}`);
      console.log("Dữ liệu blog trả về:", response);
      return response.data;  
    } catch (error) {
      console.error("Lỗi khi lấy blog:", error);
      alert("Blog không tồn tại");
      throw new Error("Blog không tồn tại");
    }
  };
  
