<template>
  <div class="container">
    <LoadingSpinner ref="loadingSpinner" />
    <h1 class="title text-center mb-4">Update Blog</h1>

    <form @submit.prevent="openSaveConfirm" class="blog-form">
      <div class="card mb-4">
        <div class="card-body">
          <div class="mb-3">
            <label for="title" class="form-label">
              <i class="fas fa-pen"></i> Blog Title
            </label>
            <input type="text" class="form-control" id="title" v-model="blog.title" placeholder="Enter blog title"
              @blur="validateTitle" required />
            <div v-if="errors.title" class="text-danger small mt-1">{{ errors.title }}</div>
          </div>

          <div class="mb-3">
            <label for="thumb" class="form-label">
              <i class="fas fa-image"></i> Blog Image
            </label>
            <input type="file" class="form-control" id="thumb" @change="handleThumbUpload" accept="image/*" />
            <div v-if="errors.thumb" class="text-danger small mt-1">{{ errors.thumb }}</div>
            <div v-if="previewImage" class="image-preview mt-2">
              <img :src="previewImage" alt="Blog image" class="img-thumbnail" />
            </div>
          </div>

          <div class="mb-3">
            <label for="keywords" class="form-label">
              <i class="fas fa-tags"></i> Related Keywords
            </label>
            <multiselect v-model="blog.selectedKeywords" :options="availableKeywords" :multiple="true"
              :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Select keywords"
              label="name" track-by="id" class="multiselect" />
            <small class="form-text text-muted">You can select multiple keywords from the list.</small>
            <div v-if="errors.selectedKeywords" class="text-danger small mt-1">
              {{ errors.selectedKeywords }}
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-light">
          <h2 class="mb-0 fs-5">
            <i class="fas fa-book"></i> Add Optional Sections
          </h2>
        </div>
        <div class="card-body">
          <div class="sections">
            <div class="section card mb-3" v-for="(section, index) in blog.sections" :key="index">
              <div class="card-body">
                <div class="mb-3">
                  <label class="form-label">
                    <i class="fas fa-heading"></i> Section Title {{ index + 1 }}
                  </label>
                  <input type="text" class="form-control" v-model="section.header" placeholder="Enter section title"
                    @blur="() => validateSection(index)" required />
                  <div v-if="errors.sections[index]?.header" class="text-danger small mt-1">
                    {{ errors.sections[index].header }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">
                    <i class="fas fa-image"></i> Section Image {{ index + 1 }}
                  </label>
                  <input type="file" class="form-control" @change="(e) => handleSectionThumbUpload(e, index)"
                    accept="image/*" />
                  <div v-if="errors.sections[index]?.thumb" class="text-danger small mt-1">
                    {{ errors.sections[index].thumb }}
                  </div>
                  <div v-if="section.previewImage" class="image-preview mt-2">
                    <img :src="section.previewImage" alt="Section image" class="img-thumbnail" />
                  </div>
                  <small class="form-text text-muted">Optional: upload a related image.</small>
                </div>

                <div class="mb-3">
                  <label class="form-label">
                    <i class="fas fa-align-left"></i> Section Content {{ index + 1 }}
                  </label>
                  <textarea class="form-control" v-model="section.content" placeholder="Enter detailed content" rows="4"
                    @blur="() => validateSection(index)" required></textarea>
                  <div v-if="errors.sections[index]?.content" class="text-danger small mt-1">
                    {{ errors.sections[index].content }}
                  </div>
                </div>

                <button class="btn btn-danger" @click.prevent="openDeleteConfirm(index)">
                  <i class="fas fa-trash-alt me-1 bold-icon"></i>
                  <span class="bold-text">Remove Section</span>
                </button>
              </div>
            </div>

            <button class="btn btn-secondary custom-btn mt-5" @click.prevent="addSection">
              <i class="fas fa-plus me-1 bold-icon"></i>
              <span class="bold-text">Add Section</span>
            </button>
          </div>
        </div>
      </div>

      <div class="form-actions text-center d-grid">
        <button class="btn btn-success custom-btn-lg">
          <i class="fas fa-check me-1 bold-icon"></i>
          <span class="bold-text">Update Blog</span>
        </button>
      </div>
    </form>

    <DeleteConfirmPopup v-model:isVisible="deleteDialogVisible" message="Are you sure you want to delete this section?"
      @confirmDelete="handleConfirmDelete" />

    <SaveConfirmPopUp v-model:isVisible="saveDialogVisible" message="Are you sure you want to save the changes?"
      @confirmSave="handleConfirmSave" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import { getPagedTags } from "@/scripts/api/services/tagService";
import { updateArticle, getBlogById } from "@/scripts/api/services/blogService";
import LoadingSpinner from "@/components/Common/Popup/LoadingSpinner.vue";
import DeleteConfirmPopup from "@/components/Common/Popup/DeleteConfirmPopup.vue";
import SaveConfirmPopUp from "@/components/Common/Popup/SaveConfirmPopUp.vue";

const router = useRouter();
const route = useRoute();

const blogData = ref(null);
const blog = ref({
  title: "",
  thumb: null,
  selectedKeywords: [],
  sections: [],
});

const availableKeywords = ref([]);
const previewImage = ref(null);
const loadingSpinner = ref(null);

const deleteDialogVisible = ref(false);
const sectionToDeleteIndex = ref(null);
const saveDialogVisible = ref(false);

const errors = reactive({
  title: "",
  thumb: "",
  selectedKeywords: "",
  sections: []
});

onMounted(async () => {
  loadingSpinner.value.showSpinner();
  try {
    const blogId = route.params.id;
    const response = await getBlogById(blogId);
    blogData.value = response;
    blog.value = {
      title: blogData.value.title,
      thumb: null,
      selectedKeywords: blogData.value.tags.map((tag) => ({
        id: tag.id,
        name: tag.title,
      })),
      sections: blogData.value.sections.map((section) => ({
        id: section.id,
        header: section.header || section.title,
        content: section.content,
        thumb: null,
        addedMedia: null,
        removedMedia: null,
        previewImage: section.thumb?.url || null,
        existingThumb: section.thumb ? {
          id: section.thumb.id,
          url: section.thumb.url,
          title: section.thumb.title
        } : null
      })),
    };

    errors.sections = blog.value.sections.map(() => ({
      header: "",
      content: "",
      thumb: ""
    }));

    if (blogData.value.thumb?.url) {
      previewImage.value = blogData.value.thumb.url;
    }

    const keywordsResponse = await getPagedTags();
    availableKeywords.value = keywordsResponse.map((keyword) => ({
      id: keyword.id,
      name: keyword.title,
    }));
  } catch (error) {
    toast.error("Unable to load blog data.");
  } finally {
    loadingSpinner.value.hideSpinner();
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
    errors.thumb = "";
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
        addedMedia: file
      };
      if (blog.value.sections[index].existingThumb?.id) {
        blog.value.sections[index].removedMedia = blog.value.sections[index].existingThumb.id;
      }
      errors.sections[index].thumb = "";
    };
    reader.readAsDataURL(file);
  }
};

const addSection = () => {
  blog.value.sections.push({
    header: "",
    thumb: null,
    previewImage: null,
    content: "",
    addedMedia: null,
    removedMedia: null
  });
  errors.sections.push({ header: "", content: "", thumb: "" });
};

const openDeleteConfirm = (index) => {
  sectionToDeleteIndex.value = index;
  deleteDialogVisible.value = true;
};

const handleConfirmDelete = (confirm) => {
  if (confirm && sectionToDeleteIndex.value !== null) {
    blog.value.sections.splice(sectionToDeleteIndex.value, 1);
    errors.sections.splice(sectionToDeleteIndex.value, 1);
  }
  sectionToDeleteIndex.value = null;
  deleteDialogVisible.value = false;
};

const openSaveConfirm = () => {
  if (!validateForm()) return;
  saveDialogVisible.value = true;
};

const handleConfirmSave = (confirm) => {
  saveDialogVisible.value = false;
  if (confirm) {
    submitBlogInternal();
  }
};

const submitBlogInternal = async () => {
  loadingSpinner.value.showSpinner();
  try {
    const formData = new FormData();
    formData.append("Id", blogData.value.id);
    formData.append("Title", blog.value.title);
    formData.append("Status", blogData.value.status);
    formData.append("IsCommentDisabled", blogData.value.isCommentDisabled);

    const currentTags = blog.value.selectedKeywords.map((tag) => tag.id);
    const previousTags = blogData.value.tags.map((tag) => tag.id);
    const removedTags = previousTags.filter((tag) => !currentTags.includes(tag));
    const addedTags = currentTags.filter((tag) => !previousTags.includes(tag));

    removedTags.forEach((tag) => formData.append("RemovedTags", tag));
    addedTags.forEach((tag) => formData.append("AddedTags", tag));

    if (blog.value.thumb instanceof File) {
      formData.append("Thumb.File", blog.value.thumb);
      formData.append("Thumb.Title", blog.value.thumb.name);
    } else {
      formData.append("Thumb.Url", blogData.value.thumb.url);
      formData.append("Thumb.Title", blogData.value.thumb.title);
    }

    if (blog.value.sections && blog.value.sections.length > 0) {
      blog.value.sections.forEach((section, index) => {
        formData.append(`Sections[${index}].Id`, section.id || "");
        formData.append(`Sections[${index}].Header`, section.header);
        formData.append(`Sections[${index}].Content`, section.content);

        if (section.removedMedia) {
          formData.append(`Sections[${index}].RemovedMedia`, section.removedMedia);
        }

        if (section.addedMedia instanceof File) {
          formData.append(`Sections[${index}].AddedMedia.File`, section.addedMedia);
          formData.append(`Sections[${index}].AddedMedia.Title`, section.addedMedia.name);
          formData.append(`Sections[${index}].AddedMedia.Type`, 1); // 1 for image type
        } else if (section.existingThumb && !section.removedMedia) {
          formData.append(`Sections[${index}].Thumb.Id`, section.existingThumb.id || "");
          formData.append(`Sections[${index}].Thumb.Url`, section.existingThumb.url);
          formData.append(`Sections[${index}].Thumb.Title`, section.existingThumb.title || "Section Image");
        }
      });
    }
    const response = await updateArticle(formData);
    toast.success("Blog updated successfully!");
    router.push("/advisor/content");
  } catch (error) {
    console.error("Error updating blog:", error);
    toast.error("Blog update failed! Please try again.");
  } finally {
    loadingSpinner.value.hideSpinner();
  }
};

const validateTitle = () => {
  if (!blog.value.title.trim()) {
    errors.title = "Please enter the blog title.";
  } else if (blog.value.title.trim().length < 3) {
    errors.title = "Blog title must be at least 3 characters.";
  } else if (blog.value.title.trim().length > 100) {
    errors.title = "Blog title must be less than 100 characters.";
  } else {
    errors.title = "";
  }
};

const validateThumb = () => {
  if (!blog.value.thumb && !previewImage.value) {
    errors.thumb = "Please select or keep the featured image.";
  } else {
    errors.thumb = "";
  }
};

const validateKeywords = () => {
  if (!blog.value.selectedKeywords || blog.value.selectedKeywords.length === 0) {
    errors.selectedKeywords = "Please select at least one keyword.";
  } else {
    errors.selectedKeywords = "";
  }
};

const validateSection = (index) => {
  const section = blog.value.sections[index];
  if (!errors.sections[index]) {
    errors.sections[index] = { header: "", content: "", thumb: "" };
  }
  if (!section.header || !section.header.trim()) {
    errors.sections[index].header = `Section ${index + 1} is missing a title.`;
  } else {
    errors.sections[index].header = "";
  }
  if (!section.content || !section.content.trim()) {
    errors.sections[index].content = `Section ${index + 1} is missing content.`;
  } else {
    errors.sections[index].content = "";
  }
  errors.sections[index].thumb = "";
};

const validateForm = () => {
  validateTitle();
  validateThumb();
  validateKeywords();
  blog.value.sections.forEach((_, index) => {
    validateSection(index);
  });

  if (errors.title || errors.thumb || errors.selectedKeywords) {
    toast.error("Please fix the errors in the form.");
    return false;
  }
  for (const secError of errors.sections) {
    if (secError.header || secError.content || secError.thumb) {
      toast.error("Please fix the errors in the sections.");
      return false;
    }
  }
  return true;
};
</script>

<style scoped>
.title {
  color: #343a40;
  font-weight: bold;
}

.image-preview img {
  max-width: 200px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: none;
}

.card-header {
  font-weight: bold;
}

.section {
  transition: all 0.3s ease;
}

.section:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.form-actions {
  margin-top: 30px;
}

.multiselect {
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

:deep(.multiselect__tags) {
  border: none;
  padding: 8px;
}

:deep(.multiselect__tag) {
  background-color: #3c98fb;
  padding: 4px 8px;
  display: inline-flex;
  align-items: center;
  width: auto;
  margin-right: 5px;
  border-radius: 4px;
}

:deep(.multiselect__tag-icon) {
  margin-left: 8px;
  position: static;
  line-height: 1;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.multiselect__tag span) {
  display: inline-block;
  white-space: nowrap;
}

:deep(.multiselect--active) {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

:deep(.multiselect__tag-icon:after) {
  color: white;
}

:deep(.multiselect__tag-icon:hover) {
  background-color: rgba(255, 255, 255, 0.2);
}

:deep(.multiselect__tag-icon:hover:after) {
  color: white;
}

:deep(.loading-spinner) {
  z-index: 9999;
}

.btn,
.custom-btn,
.custom-btn-lg {
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-size: 1.1rem;
  padding: 12px 20px;
  border-radius: 5px;
  border: none;
}

.btn:hover,
.custom-btn:hover,
.custom-btn-lg:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.btn-success.custom-btn-lg {
  background: linear-gradient(45deg, #28a745, #218838);
  color: #fff;
}

.btn-danger {
  background: linear-gradient(45deg, #ff6868, #e63946);
  color: #fff;
}

.btn-secondary.custom-btn {
  background: linear-gradient(45deg, #6c757d, #5a6268);
  color: #fff;
}

.img-thumbnail {
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.bold-icon {
  font-weight: 700;
  font-size: 1.2rem;
}

.bold-text {
  font-weight: 700;
}
</style>