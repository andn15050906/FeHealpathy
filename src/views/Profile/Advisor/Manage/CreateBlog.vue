<template>
  <div class="blog-creation">
    <LoadingSpinner ref="loadingSpinner" />
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
import { toast } from "vue3-toastify";
import "vue-multiselect/dist/vue-multiselect.min.css";
import { getPagedTags } from "@/scripts/api/services/tagService";
import { createArticle } from "@/scripts/api/services/blogService";
import LoadingSpinner from '@/components/Common/Popup/LoadingSpinner.vue';

export default {
  name: "BlogCreation",
  components: { 
    Multiselect,
    LoadingSpinner 
  },
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

    showLoading() {
      if (this.$refs.loadingSpinner) {
        this.$refs.loadingSpinner.showSpinner();
      }
    },

    hideLoading() {
      if (this.$refs.loadingSpinner) {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },

    async submitBlog() {
      if (!this.validateForm()) {
        return;
      }

      this.showLoading();

      try {
        const formData = new FormData();
        formData.append("Title", this.blog.title);
        const status = "Draft"; 
        formData.append("Status", status);
        const isCommentDisabled = false;
        formData.append("IsCommentDisabled", isCommentDisabled);
        
        this.selectedKeywords.forEach(tag => {
          formData.append("Tags[]", tag.id);
        });
        
        if (this.blog.thumb instanceof File) {
          formData.append("Thumb.File", this.blog.thumb);
        }
        formData.append("Thumb.Title", this.blog.thumb?.name || "thumb.jpg");
        
        this.blog.sections.forEach((section, index) => {
          const sectionId = section.id || this.generateUUID();
          formData.append(`Sections[${index}].id`, sectionId);
          formData.append(`Sections[${index}].header`, section.title);
          formData.append(`Sections[${index}].content`, section.content);
          if (section.thumb instanceof File) {
            formData.append(`Sections[${index}].media.file`, section.thumb);
          }
          const mediaTitle = section.thumb?.name || `section-${index + 1}.jpg`;
          formData.append(`Sections[${index}].media.title`, mediaTitle);
        });

        const response = await createArticle(formData);
        
        this.$router.push({ 
          path: "/advisor/content",
          query: { 
            createSuccess: true,
            message: 'Tạo blog thành công!'
          }
        });

      } catch (error) {
        console.error("Lỗi khi tạo blog:", error);
        toast.error(error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        this.hideLoading();
      }
    },

    validateForm() {
      if (!this.blog.title.trim()) {
        toast.error("Vui lòng nhập tiêu đề blog.");
        return false;
      }

      if (!this.blog.thumb) {
        toast.error("Vui lòng chọn hình ảnh cho blog.");
        return false;
      }

      if (this.selectedKeywords.length === 0) {
        toast.error("Vui lòng chọn ít nhất một từ khóa.");
        return false;
      }

      if (!this.blog.sections || this.blog.sections.length === 0) {
        toast.error("Vui lòng thêm ít nhất một phần nội dung.");
        return false;
      }

      for (let i = 0; i < this.blog.sections.length; i++) {
        const section = this.blog.sections[i];
        if (!section.title.trim()) {
          toast.error(`Phần ${i + 1} thiếu tiêu đề.`);
          return false;
        }
        if (!section.content.trim()) {
          toast.error(`Phần ${i + 1} thiếu nội dung.`);
          return false;
        }
        if (!section.thumb) {
          toast.error(`Phần ${i + 1} thiếu hình ảnh.`);
          return false;
        }
      }

      return true;
    },

    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
              v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    formattedContent(text) {
      if (!text) return "";
      return text.replace(/\n/g, "<br>");
    },
  },
};
</script>

<style scoped>
body {
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

:deep(.loading-spinner) {
  z-index: 9999;
}
</style>