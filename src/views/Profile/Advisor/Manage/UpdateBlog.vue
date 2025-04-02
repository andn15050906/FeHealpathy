<template>
  <div class="blog-creation">
    <h1 class="title">✨ Cập Nhật Blog ✨</h1>

    <form @submit.prevent="submitBlog" class="blog-form">
      <div class="form-group">
        <label for="title">🖋️ Tiêu đề Blog</label>
        <input type="text" id="title" v-model="blog.title" placeholder="Nhập tiêu đề blog" required />
      </div>

      <div class="form-group">
        <label for="thumb">🖼️ Hình ảnh Blog</label>
        <input type="file" id="thumb" @change="handleThumbUpload" accept="image/*" />
        <div v-if="previewImage" class="image-preview">
          <img :src="previewImage" alt="Hình ảnh blog" />
        </div>
      </div>

      <div class="form-group">
        <label for="keywords">🏷️ Từ Khóa Liên Quan</label>
        <multiselect v-model="blog.selectedKeywords" :options="availableKeywords" :multiple="true"
          :close-on-select="false" :clear-on-select="false" :preserve-search="true"
          placeholder="Chọn từ khóa" label="name" track-by="id" class="multiselect" />
        <small class="hint">Bạn có thể chọn nhiều từ khóa từ danh sách.</small>
      </div>

      <div class="sections">
        <h2>📚 Thêm Các Phần Tùy Chọn</h2>
        <div class="section" v-for="(section, index) in blog.sections" :key="index">
          <div class="form-group">
            <label>📌 Tiêu đề Phần {{ index + 1 }}</label>
            <input type="text" v-model="section.header" placeholder="Nhập tiêu đề phần" required />
          </div>
          <div class="form-group">
          <label>🖼️ Hình ảnh Phần {{ index + 1 }}</label>
          <input type="file" @change="(e) => handleSectionThumbUpload(e, index)" accept="image/*" />
  
          <div v-if="section.previewImage" class="image-preview">
        <img :src="section.previewImage" alt="Hình ảnh phần {{ index + 1 }}" />
      </div>



</div>
          <div class="form-group">
            <label>✏️ Nội dung Phần {{ index + 1 }}</label>
            <textarea v-model="section.content" placeholder="Nhập nội dung chi tiết" rows="4" required></textarea>
          </div>
          <button type="button" class="btn remove" @click="removeSection(index)">❌ Xóa Phần</button>
          <div class="divider"></div>
        </div>
        <button type="button" class="btn add" @click="addSection">➕ Thêm Phần</button>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn submit">✅ Cập Nhật Blog</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { toast } from "vue3-toastify";
import { ref, onMounted } from 'vue';
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import { getPagedTags } from "@/scripts/api/services/tagService";
import { updateArticle, getBlogById } from "@/scripts/api/services/blogService";
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const emits = defineEmits(['blogUpdated']);

const blogData = ref(null);
const blog = ref({
  title: "",
  thumb: null,
  selectedKeywords: [],
  sections: [],
});

const availableKeywords = ref([]);
const previewImage = ref(null);

onMounted(async () => {
  try {
    const blogId = route.params.id;
    const response = await getBlogById(blogId);
    blogData.value = response;

    // Log response từ API
    console.log("API Response:", response);

    // Khởi tạo dữ liệu blog
    blog.value = {
      title: blogData.value.title,
      thumb: null, // Sẽ được cập nhật khi upload file mới
      selectedKeywords: blogData.value.tags.map(tag => ({
        id: tag.id,
        name: tag.title
      })),
      sections: blogData.value.sections.map(section => ({
        id: section.id,
        header: section.header || section.title, // Hỗ trợ cả 2 trường hợp
        content: section.content,
        thumb: null, // Sẽ được cập nhật khi upload file mới
        previewImage: section.media?.url || section.thumb?.url,
        thumbTitle: section.media?.title || section.thumb?.title
      }))
    };

    // Set preview image cho thumbnail chính
    if (blogData.value.thumb?.url) {
      previewImage.value = blogData.value.thumb.url;
    }

    // Log dữ liệu đã khởi tạo
    console.log("Initialized blog data:", blog.value);

    // Fetch keywords
    const keywordsResponse = await getPagedTags();
    availableKeywords.value = keywordsResponse.map(keyword => ({
      id: keyword.id,
      name: keyword.title
    }));

  } catch (error) {
    console.error("Error initializing blog data:", error);
    toast.error("Không thể tải dữ liệu blog.");
  }
});

const handleThumbUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    blog.value.thumb = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleSectionThumbUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            blog.value.sections[index] = {
                ...blog.value.sections[index],
                thumb: file,
                previewImage: e.target.result,
            };
        };
        reader.readAsDataURL(file);
    }
};

const addSection = () => {
  blog.value.sections.push({
    title: "",
    thumb: null,
    previewImage: null,
    content: "",
  });
};

const removeSection = (index) => {
  blog.value.sections.splice(index, 1);
};

const validateForm = () => {
  if (!blog.value.title.trim()) {
    toast.error("Vui lòng nhập tiêu đề blog.");
    return false;
  }

  if (!blog.value.thumb && !previewImage.value) {
    toast.error("Vui lòng chọn hoặc giữ lại hình ảnh đại diện.");
    return false;
  }

  if (!blog.value.selectedKeywords || blog.value.selectedKeywords.length === 0) {
    toast.error("Vui lòng chọn ít nhất một từ khóa.");
    return false;
  }

  if (!blog.value.sections || blog.value.sections.length === 0) {
    toast.error("Vui lòng thêm ít nhất một phần nội dung.");
    return false;
  }

  for (let i = 0; i < blog.value.sections.length; i++) {
    const section = blog.value.sections[i];

    if (!section.header || !section.header.trim()) {
      toast.error(`Phần ${i + 1} thiếu tiêu đề.`);
      return false;
    }

    if (!section.content || !section.content.trim()) {
      toast.error(`Phần ${i + 1} thiếu nội dung.`);
      return false;
    }

    if (!section.thumb && !section.previewImage) {
      toast.error(`Phần ${i + 1} thiếu hình ảnh.`);
      return false;
    }
  }

  return true;
};

const submitBlog = async () => {
  if (!validateForm()) return;
  try {
    const formData = new FormData();

    // Log dữ liệu gốc
    console.log("Original blog data:", {
      id: blogData.value.id,
      title: blogData.value.title,
      status: blogData.value.status,
      isCommentDisabled: blogData.value.isCommentDisabled,
      thumb: {
        id: blogData.value.thumb.id,
        url: blogData.value.thumb.url,
        title: blogData.value.thumb.title
      },
      sections: blogData.value.sections,
      tags: blogData.value.tags
    });

    // Append dữ liệu cơ bản
    formData.append("Id", blogData.value.id);
    formData.append("Title", blog.value.title);
    formData.append("Status", blogData.value.status);
    formData.append("IsCommentDisabled", blogData.value.isCommentDisabled);

    // Xử lý tags
    const currentTags = blog.value.selectedKeywords.map(tag => tag.id);
    const previousTags = blogData.value.tags.map(tag => tag.id);
    const removedTags = previousTags.filter(tag => !currentTags.includes(tag));
    const addedTags = currentTags.filter(tag => !previousTags.includes(tag));

    removedTags.forEach(tag => formData.append("RemovedTags", tag));
    addedTags.forEach(tag => formData.append("AddedTags", tag));

    // Xử lý thumb
    if (blog.value.thumb instanceof File) {
      formData.append("Thumb.File", blog.value.thumb);
      formData.append("Thumb.Title", blog.value.thumb.name);
    } else {
      formData.append("Thumb.Url", blogData.value.thumb.url);
      formData.append("Thumb.Title", blogData.value.thumb.title);
    }

    // Xử lý sections
    if (blog.value.sections && blog.value.sections.length > 0) {
      blog.value.sections.forEach((section, index) => {
        formData.append(`Sections[${index}].Id`, section.id || '');
        formData.append(`Sections[${index}].Title`, section.header);
        formData.append(`Sections[${index}].Content`, section.content);

        if (section.thumb instanceof File) {
          formData.append(`Sections[${index}].Thumb.File`, section.thumb);
          formData.append(`Sections[${index}].Thumb.Title`, section.thumb.name);
        } else if (section.previewImage) {
          formData.append(`Sections[${index}].Thumb.Url`, section.previewImage);
          formData.append(`Sections[${index}].Thumb.Title`, section.thumbTitle);
        }
      });
    }

    // Log FormData một cách chi tiết
    console.log("Form data entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await updateArticle(formData);
    console.log("Update response:", response);
    
    toast.success("Cập nhật blog thành công!");
    router.push('/advisor/content');
  } catch (error) {
    console.error("Lỗi khi cập nhật blog:", error);
    if (error.response) {
      console.error("Error response:", error.response);
      const errorMessage = error.response.data?.message || 'Vui lòng thử lại';
      toast.error(`Cập nhật blog thất bại: ${errorMessage}`);
    } else {
      toast.error("Cập nhật blog thất bại! Vui lòng thử lại.");
    }
  }
};
</script>


<style scoped>
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f9;
    margin: 0;
    padding: 0;
  }

  
  .title {
    text-align: center;
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }
  
  .form-group label {
    font-weight: bold;
    color: #555;
  }
  
  .form-group input,
  textarea {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  textarea {
    resize: none;
  }
  
  .image-preview img {
    width: 100%;
    max-width: 200px;
    border-radius: 10px;
    margin-top: 10px;
  }
  
  .sections {
    margin-top: 20px;
  }
  
  .section {
    background: #fafafa;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  
  .divider {
    border-top: 1px dashed #ddd;
    margin: 15px 0;
  }
  
  .btn {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
  }
  
  .btn.add {
    background: #007bff;
    color: white;
    display: block;
    margin: 0 auto;
  }
  
  .btn.remove {
    background: #ff6868;
    color: white;
  }
  
  .btn.submit {
    margin-top: 20px;
    background: #28a745;
    color: white;
    width: 100%;
    text-align: center;
  }
  
  .btn:hover {
    opacity: 0.9;
  }
  .multiselect {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #fff;
}

.multiselect__tags {
  min-height: 36px;
  display: flex;
  align-items: center;
}

.multiselect__input {
  font-size: 1rem;
  margin-left: 5px;
  padding: 5px;
  border: none;
  outline: none;
}

.multiselect--active {
  border-color: #007bff;
}

.multiselect__tag {
  background: #007bff;
  color: #fff;
  border-radius: 3px;
  padding: 3px 5px;
  margin: 2px 5px 2px 0;
}

.multiselect__tag:hover {
  background: #0056b3;
}

.multiselect__clear {
  color: #007bff;
  font-size: 1rem;
  cursor: pointer;
}

.multiselect__clear:hover {
  color: #0056b3;
}
  </style>
  
