<template>
    <div class="yoga-creation">
      <h1 class="title">🧘‍♂️ Tạo Bài Viết Yoga 🧘‍♀️</h1>
  
      <form @submit.prevent="submitYoga" class="yoga-form">
        <div class="form-group">
          <label for="title">🖋️ Tiêu đề Bài Viết</label>
          <input type="text" id="title" v-model="yoga.title" placeholder="Nhập tiêu đề bài viết" required />
        </div>
  
        <div class="form-group">
          <label for="keywords">🏷️ Từ Khóa Liên Quan</label>
          <multiselect v-model="selectedKeywords" :options="availableKeywords" :multiple="true"
            :close-on-select="false" :clear-on-select="false" :preserve-search="true"
            placeholder="Chọn từ khóa" label="name" track-by="id" class="multiselect" />
          <small class="hint">Bạn có thể chọn nhiều từ khóa từ danh sách.</small>
        </div>
  
        <div class="form-group">
          <label for="thumb">🖼️ Hình ảnh Bài Viết</label>
          <input type="file" id="thumb" @change="handleThumbUpload" accept="image/*" />
          <div v-if="previewImage" class="image-preview">
            <img :src="previewImage" alt="Hình ảnh bài viết" />
          </div>
        </div>
  
        <div class="sections">
          <h2>📖 Thêm Các Phần Tập Luyện</h2>
          <div class="section" v-for="(section, index) in yoga.sections" :key="index">
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
          <button type="submit" class="btn submit">✅ Đăng Bài Viết</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import Multiselect from "vue-multiselect";
  import "vue-multiselect/dist/vue-multiselect.min.css";
  import { getPagedTags } from "@/scripts/api/services/tagService";
  import { createCourse } from "@/scripts/api/services/courseService";
  
  export default {
    name: "YogaCreation",
    components: { Multiselect },
    data() {
      return {
        yoga: {
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
          this.availableKeywords = response.map(tag => ({ name: tag.title, id: tag.id }));
        } catch (error) {
          console.error("Lỗi tải từ khóa:", error);
        }
      },
  
      handleThumbUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.yoga.thumb = file;
          const reader = new FileReader();
          reader.onload = e => this.previewImage = e.target.result;
          reader.readAsDataURL(file);
        }
      },
  
      handleSectionThumbUpload(event, index) {
        const file = event.target.files[0];
        if (file) {
          this.yoga.sections[index].thumb = file;
          const reader = new FileReader();
          reader.onload = e => this.yoga.sections[index].previewImage = e.target.result;
          reader.readAsDataURL(file);
        }
      },
  
      addSection() {
        this.yoga.sections.push({ title: "", thumb: null, previewImage: null, content: "" });
      },
  
      removeSection(index) {
        this.yoga.sections.splice(index, 1);
      },
  
      async submitYoga() {
        const formData = new FormData();
        formData.append("Title", this.yoga.title);
        formData.append("Status", "Published");
        formData.append("IsCommentDisabled", false);
        this.selectedKeywords.forEach(tag => formData.append("Tags[]", tag.id));
        if (this.yoga.thumb instanceof File) {
          formData.append("Thumb.File", this.yoga.thumb);
        }
        this.yoga.sections.forEach((section, index) => {
          formData.append(`Sections[${index}].header`, section.title);
          formData.append(`Sections[${index}].content`, section.content);
          if (section.thumb instanceof File) {
            formData.append(`Sections[${index}].media.file`, section.thumb);
          }
        });
        try {
          await createCourse(formData);
          this.$router.push("/yoga/manage");
        } catch (error) {
          console.error("Lỗi khi đăng bài viết:", error);
          alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
      },
    },
  };
  </script>
  