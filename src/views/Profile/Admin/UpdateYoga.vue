<template>
    <div class="yoga-update">
      <h1 class="title">🧘‍♂️ Cập Nhật Bài Viết Yoga 🧘‍♀️</h1>
  
      <form @submit.prevent="submitYoga" class="yoga-form">
        <div class="form-group">
          <label for="title">🖋️ Tiêu đề Bài Viết</label>
          <input type="text" id="title" v-model="yoga.title" placeholder="Nhập tiêu đề bài viết" required />
        </div>
  
        <div class="form-group">
          <label for="thumb">🖼️ Hình ảnh Bài Viết</label>
          <input type="file" id="thumb" @change="handleThumbUpload" accept="image/*" />
          <div v-if="previewImage" class="image-preview">
            <img :src="previewImage" alt="Hình ảnh bài viết" />
          </div>
        </div>
  
        <div class="form-group">
          <label for="keywords">🏷️ Từ Khóa Liên Quan</label>
          <multiselect v-model="yoga.selectedKeywords" :options="availableKeywords" :multiple="true"
            :close-on-select="false" :clear-on-select="false" :preserve-search="true"
            placeholder="Chọn từ khóa" label="name" track-by="id" class="multiselect" />
          <small class="hint">Bạn có thể chọn nhiều từ khóa từ danh sách.</small>
        </div>
  
        <div class="sections">
          <h2>📖 Thêm Các Phần Tập Luyện</h2>
          <div class="section" v-for="(section, index) in yoga.sections" :key="index">
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
          <button type="submit" class="btn submit">✅ Cập Nhật Bài Viết</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Multiselect from "vue-multiselect";
  import "vue-multiselect/dist/vue-multiselect.min.css";
  import { updateCourse } from "@/scripts/api/services/courseService";
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const emits = defineEmits(['yogaUpdated']);
  const props = defineProps({
    yogaData: {
      type: Object,
      required: true,
    },
  });
  const yoga = ref({
    title: props.yogaData?.title || "",
    thumb: props.yogaData?.Id || null,
    selectedKeywords: Array.isArray(props.yogaData?.tags) 
      ? props.yogaData.tags.map(tag => ({ id: tag.id, name: tag.title })) 
      : [],
    sections: Array.isArray(props.yogaData?.sections) ? [...props.yogaData.sections] : [],
  });
  
  const availableKeywords = ref([]);
  const previewImage = ref(props.yogaData?.id || null);
  
  onMounted(async () => {
    await fetchAvailableKeywords();
    if (props.yogaData?.thumb?.url) {
      previewImage.value = props.yogaData.thumb.url;
    }
  
    if (props.yogaData?.sections) {
      yoga.value.sections = props.yogaData.sections.map(section => ({
        header: section.header || "",
        content: section.content || "",
        thumb: null,
        previewImage: section.media?.url || null,
      }));
    }
  });
  
  const submitYoga = async () => {
    try {
      const formData = new FormData();
      formData.append("Id", props.yogaData.id);
      formData.append("Title", yoga.value.title);
      formData.append("Status", "Draft");
      formData.append("IsCommentDisabled", JSON.stringify(false));
      yoga.value.selectedKeywords.forEach(tag => formData.append("Tags[]", tag.id));
      if (yoga.value.thumb instanceof File) {
        formData.append("Thumb.File", yoga.value.thumb);
      } else if (props.yogaData.thumb?.url) {
        formData.append("Thumb.Url", props.yogaData.thumb.url);
      }
      yoga.value.sections.forEach((section, index) => {
        formData.append(`Sections[${index}].Title`, section.header);
        formData.append(`Sections[${index}].Content`, section.content);
        if (section.thumb) {
          formData.append(`Sections[${index}].Thumb.File`, section.thumb);
        } else if (section.previewImage) {
          formData.append(`Sections[${index}].Thumb.Url`, section.previewImage);
        }
      });
      await updateCourse(formData);
      router.go(0);
    } catch (error) {
      console.error("❌ Lỗi cập nhật bài viết Yoga:", error);
    }
  };
  </script>
  