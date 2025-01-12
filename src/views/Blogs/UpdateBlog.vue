<template>
  <div class="blog-update">
    <h1 class="title">✨ Cập Nhật Blog ✨</h1>

    <form @submit.prevent="submitBlog" class="blog-form">
      <div class="form-group">
        <label for="title">🖋️ Tiêu đề Blog</label>
        <input
          type="text"
          id="title"
          v-model="blog.title"
          placeholder="Cập nhập tiêu đề blog"
          required
        />
      </div>

    <div class="form-group">
      <label for="keywords">🏷️ Từ Khóa Liên Quan</label>
      <input
        type="text"
        id="keywords"
        v-model="blog.keywords"
        placeholder="Cập nhập từ khóa, cách nhau bằng dấu phẩy"
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
        <h2>📚 Quản Lý Các Phần</h2>
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
        <button type="submit" class="btn submit">✅ Cập Nhật Blog</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "BlogUpdate",
  data() {
  return {
    blog: {
      title: "Khám phá Yoga và Sức khỏe",
      keywords: "yoga, sức khỏe, thể chất",
      image: null,
      previewImage: "https://api-healthcontent.dai-ichi-life.com.vn/api/api/v1/app/downloadFile?fileName=news//thumnailtacdungcuayoga_1729496086755.png",
      sections: [
  {
    title: "Lợi ích của Yoga",
    image: null,
    previewImage: "https://api-healthcontent.dai-ichi-life.com.vn/api/api/v1/app/downloadFile?fileName=news//thumnailtacdungcuayoga_1729496086755.png", // Hình ảnh mẫu
    content:
      "Yoga không chỉ giúp tăng cường sức khỏe thể chất mà còn giúp cải thiện sức khỏe tinh thần, giảm căng thẳng và cải thiện giấc ngủ.",
  }
],
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
    mounted() {
  this.blog = {
    title: "Khám phá Yoga và Sức khỏe",
    keywords: "yoga, sức khỏe, thể chất",
    image: null,
    sections: [
      {
        title: "Lợi ích của Yoga",
        image: null,
        previewImage: "https://via.placeholder.com/200x150",
        content:
          "Yoga không chỉ giúp tăng cường sức khỏe thể chất mà còn giúp cải thiện sức khỏe tinh thần, giảm căng thẳng và cải thiện giấc ngủ.",
      },
      {
        title: "Các bài tập Yoga cơ bản",
        image: null,
        previewImage: "https://via.placeholder.com/200x150",
        content:
          "Dành cho người mới bắt đầu, các bài tập như Tư thế Núi, Tư thế Chó úp mặt, và Tư thế Chiến binh là những bài tập hiệu quả và dễ thực hiện.",
      },
    ],
  };
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

.blog-update {
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
