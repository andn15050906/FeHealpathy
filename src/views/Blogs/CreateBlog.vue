<template>
  <div class="blog-creation">
    <h1 class="title">✨ Tạo Blog Mới ✨</h1>

    <form @submit.prevent="submitBlog" class="blog-form">
      <div class="form-group">
        <label for="title">🖋️ Tiêu đề Blog</label>
        <input type="text" id="title" v-model="blog.title" placeholder="Nhập tiêu đề blog" required />
      </div>

      <div class="form-group">
        <label for="keywords">🏷️ Từ Khóa Liên Quan</label>
        <multiselect v-model="selectedKeywords" :options="availableKeywords" :multiple="true"
          :close-on-select="false" :clear-on-select="false" :preserve-search="true"
          placeholder="Chọn từ khóa" label="name" track-by="id" class="multiselect" />
        <small class="hint">Bạn có thể chọn nhiều từ khóa từ danh sách.</small>
      </div>

      <div class="form-group">
        <label for="thumb">🖼️ Hình ảnh Blog</label>
        <input type="file" id="thumb" @change="handleThumbUpload" accept="image/*" />
        <div v-if="previewImage" class="image-preview">
          <img :src="previewImage" alt="Hình ảnh blog" />
        </div>
      </div>

      <div class="sections">
        <h2>📚 Thêm Các Phần Tùy Chọn</h2>
        <div class="section" v-for="(section, index) in blog.sections" :key="index">
          <div class="form-group">
            <label>📌 Tiêu đề Phần {{ index + 1 }}</label>
            <input type="text" v-model="section.title" placeholder="Nhập tiêu đề phần" required />
          </div>
          <div class="form-group">
            <label>🖼️ Hình ảnh Phần {{ index + 1 }}</label>
            <input type="file" @change="(e) => handleSectionThumbUpload(e, index)" accept="image/*" />
            <div v-if="section.previewImage" class="image-preview">
              <img :src="section.previewImage" alt="Hình ảnh phần" />
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
        <button type="submit" class="btn submit">✅ Tạo Blog</button>
      </div>
    </form>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import { getPagedTags } from "@/services/tagService";
import { createArticle } from "@/services/blogService";

export default {
  name: "BlogCreation",
  components: { Multiselect },
  data() {
    return {
      blog: {
        title: "",
        thumb: null,
        sections: [],
      },
      previewImage: null,
      selectedKeywords: [],
      availableKeywords: [],
    };
  },
  mounted() {
    this.fetchAvailableKeywords();
  },
  methods: {
    async fetchAvailableKeywords() {
      try {
        const response = await getPagedTags();
        if (Array.isArray(response) && response.length > 0) {
          this.availableKeywords = response.map((tag) => ({
            name: tag.title,
            id: tag.id,
          }));
        } else {
          this.availableKeywords = [];
        }
      } catch (error) {
        console.error("Lỗi tải từ khóa:", error);
        alert("Không thể tải danh sách từ khóa.");
      }
    },

    handleThumbUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.blog.thumb = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    handleSectionThumbUpload(event, index) {
      const file = event.target.files[0];
      if (file) {
        this.blog.sections[index].thumb = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.blog.sections[index].previewImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    addSection() {
      this.blog.sections.push({
        title: "",
        thumb: null,
        previewImage: null,
        content: "",
      });
    },

    removeSection(index) {
      this.blog.sections.splice(index, 1);
    },

    async submitBlog() {
  const formData = new FormData();

  // Gửi tiêu đề Blog
  formData.append("Title", this.blog.title);

  // Gửi trạng thái Blog (Ví dụ: "Draft", "Published", ...)
  const status = "Draft";  // Ví dụ
  formData.append("Status", status);

  // Gửi trạng thái IsCommentDisabled (boolean, có thể lấy từ checkbox hoặc toggle)
  const isCommentDisabled = false; // Ví dụ
  formData.append("IsCommentDisabled", isCommentDisabled);

  // Gửi Tags
  this.selectedKeywords.forEach(tag => {
    formData.append("Tags[]", tag.id);
  });
  
  // Gửi Thumb (Hình ảnh đại diện của blog)
  if (this.blog.thumb instanceof File) {
    formData.append("Thumb.File", this.blog.thumb); // Gửi file ảnh
  }

  if (this.previewImage) {
    formData.append("Thumb.Url", "https://fastly.picsum.photos/id/216/200/300.jpg?hmac=c3OXbiUxWPMgwnaFpX8ZAfBL5TZzWjnof6mb4OwuSPs"); // Gửi URL của ảnh thumb
  }

  formData.append("Thumb.Title", "Thumbnail for the blog"); // Tiêu đề của ảnh thumb

  // Gửi các phần của Blog
  this.blog.sections.forEach((section, index) => {
    // Gửi ID cho phần nếu có
    const sectionId = section.id || this.generateUUID();  // Nếu chưa có id, tạo một UUID ngẫu nhiên
    formData.append(`Sections[${index}].id`, sectionId);

    // Gửi tiêu đề (header) và nội dung (content) của phần
    formData.append(`Sections[${index}].header`, section.title);
    formData.append(`Sections[${index}].content`, section.content);

    // Gửi media cho mỗi section (file hoặc url)
    if (section.thumb instanceof File) {
      formData.append(`Sections[${index}].media.file`, section.thumb);  // Gửi file hình ảnh nếu có
    }

    if (section.previewImage) {
      formData.append(`Sections[${index}].media.url`, "https://fastly.picsum.photos/id/216/200/300.jpg?hmac=c3OXbiUxWPMgwnaFpX8ZAfBL5TZzWjnof6mb4OwuSPs");  // Gửi URL của hình ảnh nếu có
    }

    // Gửi title cho media (nếu cần thiết)
    formData.append(`Sections[${index}].media.title`, `Image for section ${index + 1}`);
  });

  this.logFormData(formData);  // Để log dữ liệu gửi lên API (sử dụng khi cần debug)

  try {
    const response = await createArticle(formData);  // API tạo bài viết
    alert("Blog đã được tạo thành công!");
  } catch (error) {
    console.error("Lỗi khi tạo blog:", error);
    if (error.response && error.response.data) {
      console.error("Chi tiết lỗi:", error.response.data);
      alert(`Lỗi: ${error.response.data.title}`);
    } else {
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  }
},

// Hàm tạo UUID ngẫu nhiên (nếu không có sẵn)
generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

,
    logFormData(formData) {
    console.log("🚀 Dữ liệu gửi đi:");
    for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
            console.log(`${pair[0]}: [File] ${pair[1].name}`);
        } else {
            console.log(`${pair[0]}:`, pair[1]);
        }
    }
}
  },
};
</script>

  
  <style scoped>
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f9;
    margin: 0;
    padding: 0;
  }
  
  .blog-creation {
    max-width: 800px;
    margin: 20px auto;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px 30px;
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
  