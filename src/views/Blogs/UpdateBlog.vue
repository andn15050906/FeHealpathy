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
import { ref, defineEmits, defineProps, onMounted } from 'vue';
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import { getPagedTags } from "@/services/tagService";
import { updateArticle } from "@/services/blogService";


const emits = defineEmits(['blogUpdated']);
const props = defineProps({
  blogData: {
    type: Object,
    required: true,
  },
});
const blog = ref({
  title: props.blogData?.title || "",
  thumb: props.blogData?.Id || null,
  selectedKeywords: Array.isArray(props.blogData?.tags) 
    ? props.blogData.tags.map(tag => ({ id: tag.id, name: tag.title })) 
    : [],
  sections: Array.isArray(props.blogData?.sections) ? [...props.blogData.sections] : [],
});


const availableKeywords = ref([]);
const previewImage = ref(props.blogData?.id || null);

onMounted(async () => {
  await fetchAvailableKeywords();

  if (props.blogData?.thumb?.url) {
    previewImage.value = props.blogData.thumb.url;
  } else {
    console.log("⚠️ Không có URL ảnh đại diện.");
  }

  if (props.blogData?.sections) {
    console.log("📌 Dữ liệu Sections từ API:", props.blogData.sections);

    blog.value.sections = props.blogData.sections.map((sections, index) => {
      console.log(`📌 Sections ${index + 1} dữ liệu gốc:`, sections);

      return {
        header: sections.header || "",
        content: sections.content || "",
        thumb: null,
        previewImage: sections.media?.url || null,
      };
    });
  }
});




const fetchAvailableKeywords = async () => {
  try {
    const response = await getPagedTags();
    availableKeywords.value = response.map(tag => ({
      name: tag.title,
      id: tag.id,
    }));
  } catch (error) {
    console.error("Lỗi tải từ khóa:", error);
  }
};

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
                thumb: file, // Cập nhật file ảnh mới
                previewImage: e.target.result, // Hiển thị ảnh mới
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



const submitBlog = async () => {
    try {
        const formData = new FormData();

        // 🆗 1. Gửi ID, Title, Status
        formData.append("Id", props.blogData.id);
        formData.append("Title", blog.value.title);
        formData.append("Status", "Draft");

        // 🆗 2. Sửa lỗi IsCommentDisabled (boolean)
        formData.append("IsCommentDisabled", false);

        // 🛠 3. Khai báo removedTags & addedTags trước khi sử dụng
        const currentTags = blog.value.selectedKeywords.map(tag => tag.id);
        const previousTags = props.blogData.tags ? props.blogData.tags.map(tag => tag.id) : [];
        const removedTags = previousTags.filter(tag => !currentTags.includes(tag));
        const addedTags = currentTags.filter(tag => !previousTags.includes(tag));

        // 🛠 4. Đảm bảo RemovedTags & AddedTags luôn có dữ liệu (ngay cả khi rỗng)
        if (removedTags.length === 0) formData.append("RemovedTags", "[]");
        else removedTags.forEach(tag => formData.append("RemovedTags", tag));

        if (addedTags.length === 0) formData.append("AddedTags", "[]");
        else addedTags.forEach(tag => formData.append("AddedTags", tag));

        // 🆗 5. Gửi hình ảnh đại diện (Thumb)
        if (blog.value.thumb) {
            formData.append("Thumb.File", blog.value.thumb);
            formData.append("Thumb.Title", "Ảnh đại diện");
        } else if (props.blogData.thumb?.url) {
            formData.append("Thumb.Url", props.blogData.thumb.url);
        }

        // 🆗 6. Gửi danh sách Sections
        blog.value.sections.forEach((section, index) => {
            formData.append(`Sections[${index}].Title`, section.header); 
            formData.append(`Sections[${index}].Content`, section.content);

            if (section.thumb) {
                formData.append(`Sections[${index}].Thumb.File`, section.thumb);
                formData.append(`Sections[${index}].Thumb.Title`, `Ảnh cho phần ${index + 1}`);
            } else if (section.previewImage) {
                formData.append(`Sections[${index}].Thumb.Url`, section.previewImage);
            }
        });

        console.log("🔍 Dữ liệu gửi lên API:", [...formData]);

        // Gọi API cập nhật bài viết
        const response = await updateArticle(formData);
        console.log("✅ Cập nhật blog thành công:", response);
    } catch (error) {
        console.error("❌ Lỗi cập nhật blog:", error);
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
  
