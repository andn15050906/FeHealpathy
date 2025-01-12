<template>
    <div class="blog-creation">
      <h1 class="title">✨ Tạo Blog Mới ✨</h1>
  
      <form @submit.prevent="submitBlog" class="blog-form">
        <div class="form-group">
          <label for="title">🖋️ Tiêu đề Blog</label>
          <input
            type="text"
            id="title"
            v-model="blog.title"
            placeholder="Nhập tiêu đề blog"
            required
          />
        </div>
  
      <div class="form-group">
        <label for="keywords">🏷️ Từ Khóa Liên Quan</label>
        <input
          type="text"
          id="keywords"
          v-model="blog.keywords"
          placeholder="Nhập từ khóa, cách nhau bằng dấu phẩy"
        />
        <small class="hint">Ví dụ: yoga, helth, meditation, soothaway</small>
      </div>

        <div class="form-group">
          <label for="image">🖼️ Hình ảnh Blog</label>
          <input
            type="file"
            id="image"
            @change="handleImageUpload"
            accept="image/*"
          />
          <div v-if="previewImage" class="image-preview">
            <img :src="previewImage" alt="Hình ảnh blog" />
          </div>
        </div>
  
        <div class="sections">
          <h2>📚 Thêm Các Phần Tùy Chọn</h2>
          <div
            class="section"
            v-for="(section, index) in blog.sections"
            :key="index"
          >
            <div class="form-group">
              <label>📌 Tiêu đề Phần {{ index + 1 }}</label>
              <input
                type="text"
                v-model="section.title"
                placeholder="Nhập tiêu đề phần"
                required
              />
            </div>
            <div class="form-group">
              <label>🖼️ Hình ảnh Phần {{ index + 1 }}</label>
              <input
                type="file"
                @change="(e) => handleSectionImageUpload(e, index)"
                accept="image/*"
              />
              <div v-if="section.previewImage" class="image-preview">
                <img :src="section.previewImage" alt="Hình ảnh phần" />
              </div>
            </div>
            <div class="form-group">
              <label>✏️ Nội dung Phần {{ index + 1 }}</label>
              <textarea
                v-model="section.content"
                placeholder="Nhập nội dung chi tiết"
                rows="4"
                required
              ></textarea>
            </div>
            <button type="button" class="btn remove" @click="removeSection(index)">
              ❌ Xóa Phần
            </button>
            <div class="divider"></div>
          </div>
          <button type="button" class="btn add" @click="addSection">
            ➕ Thêm Phần
          </button>
        </div>
  
        <div class="form-actions">
          <button type="submit" class="btn submit">✅ Tạo Blog</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: "BlogCreation",
    data() {
      return {
        blog: {
          title: "",
          image: null,
          sections: [],
        },
        previewImage: null,
      };
    },
    methods: {
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.blog.image = file;
          const reader = new FileReader();
          reader.onload = (e) => {
            this.previewImage = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      addSection() {
        this.blog.sections.push({
          title: "",
          image: null,
          previewImage: null,
          content: "",
        });
      },
      handleSectionImageUpload(event, index) {
        const file = event.target.files[0];
        if (file) {
          this.blog.sections[index].image = file;
          const reader = new FileReader();
          reader.onload = (e) => {
            this.$set(this.blog.sections[index], "previewImage", e.target.result);
          };
          reader.readAsDataURL(file);
        }
      },
      removeSection(index) {
        this.blog.sections.splice(index, 1);
      },
      submitBlog() {
        if (!this.blog.title) {
          alert("Vui lòng nhập tiêu đề blog!");
          return;
        }
        alert("Blog đã được tạo thành công!");
        this.resetForm();
      },
      resetForm() {
        this.blog = {
          title: "",
          image: null,
          sections: [],
        };
        this.previewImage = null;
      },
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
  </style>
  