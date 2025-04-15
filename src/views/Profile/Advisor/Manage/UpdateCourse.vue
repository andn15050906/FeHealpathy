<template>
  <div class="container">
    <LoadingSpinner ref="loadingSpinner" />
    <h1 class="title text-center mb-4 bold-text">Update Course</h1>

    <div class="card-body">
      <form @submit.prevent="openSavePopup">
        <div class="mb-3">
          <label for="title" class="form-label required">
            <i class="fas fa-pen-nib me-1 bold-icon"></i>
            <span class="bold-text">Course Title</span>
          </label>
          <input type="text" id="title" v-model="course.title" class="form-control" placeholder="Insert course title"
            required />
        </div>

        <div class="mb-3">
          <label for="intro" class="form-label required">
            <i class="fas fa-book me-1 bold-icon"></i>
            <span class="bold-text">Course Intro</span>
          </label>
          <textarea id="intro" v-model="course.intro" class="form-control"
            placeholder="Write a short intro for the course" rows="3" required></textarea>
        </div>

        <div class="mb-3">
          <label for="description" class="form-label required">
            <i class="fas fa-align-left me-1 bold-icon"></i>
            <span class="bold-text">Course Description</span>
          </label>
          <textarea id="description" v-model="course.description" class="form-control"
            placeholder="Detailed course description" rows="5" required></textarea>
        </div>

        <div class="mb-3">
          <label for="thumb" class="form-label required">
            <i class="fas fa-image me-1 bold-icon"></i>
            <span class="bold-text">Course Thumbnail</span>
          </label>
          <input type="file" id="thumb" @change="handleImageUpload" class="form-control" accept="image/*" />
          <div v-if="previewImage" class="mt-2 text-center">
            <img :src="previewImage" alt="Course Thumbnail" class="img-thumbnail" style="max-width: 200px;" />
          </div>
        </div>

        <div class="mb-3">
          <label for="price" class="form-label required">
            <i class="fas fa-dollar-sign me-1 bold-icon"></i>
            <span class="bold-text">Course Price</span>
          </label>
          <input type="number" id="price" v-model="course.price" class="form-control" placeholder="Enter price (VND)"
            min="10000" required />
        </div>

        <div class="mb-3">
          <label for="level" class="form-label required">
            <i class="fas fa-signal me-1 bold-icon"></i>
            <span class="bold-text">Course Level</span>
          </label>
          <select id="level" v-model="course.level" required class="form-select">
            <option value="" disabled>Select level</option>
            <option value="0">Beginner</option>
            <option value="1">Intermediate</option>
            <option value="2">Advanced</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="outcomes" class="form-label required">
            <i class="fas fa-award me-1 bold-icon"></i>
            <span class="bold-text">Course Outcomes</span>
          </label>
          <textarea id="outcomes" v-model="course.outcomes" class="form-control"
            placeholder="Expected learning outcomes" rows="3" required></textarea>
        </div>

        <div class="mb-3">
          <label for="requirements" class="form-label required">
            <i class="fas fa-info-circle me-1 bold-icon"></i>
            <span class="bold-text">Course Requirements</span>
          </label>
          <textarea id="requirements" v-model="course.requirements" class="form-control"
            placeholder="Course prerequisites" rows="3" required></textarea>
        </div>

        <div class="mb-4">
          <h2 class="h5 mb-3">
            <i class="fas fa-list-ul me-1 bold-icon"></i>
            <span class="bold-text">Course Lectures</span>
          </h2>

          <div class="mb-4 border rounded p-3" v-for="(lecture, index) in course.lectures" :key="index">
            <div class="mb-3">
              <label class="form-label">
                <i class="fas fa-sticky-note me-1 bold-icon"></i>
                <span class="bold-text">Lecture Title {{ index + 1 }}</span>
              </label>
              <input type="text" v-model="lecture.title" class="form-control" placeholder="Lecture title" />
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="fas fa-align-left me-1 bold-icon"></i>
                <span class="bold-text">Lecture Content</span>
              </label>
              <textarea v-model="lecture.content" class="form-control" placeholder="Lecture content"
                rows="4"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="fas fa-align-left me-1 bold-icon"></i>
                <span class="bold-text">Content Summary</span>
              </label>
              <textarea v-model="lecture.contentSummary" class="form-control" placeholder="Lecture summary"
                rows="4"></textarea>
            </div>

            <div class="form-check form-switch mb-3">
              <input type="checkbox" class="form-check-input" v-model="lecture.isPreviewable"
                :id="'previewable-' + index" />
              <label class="form-check-label bold-text" :for="'previewable-' + index">
                <i class="fas fa-eye me-1 bold-icon"></i>
                <span class="bold-text">Is Previewable</span>
              </label>
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="fas fa-upload me-1 bold-icon"></i>
                <span class="bold-text">Upload Lecture Materials</span>
              </label>
              <input type="file" class="form-control" @change="handleLectureMediaUpload($event, index)"
                accept="image/*,video/*,application/pdf" multiple />
              <div v-if="lecture.medias.length" class="mt-2">
                <div v-for="(media, mediaIndex) in lecture.medias" :key="mediaIndex"
                  class="d-flex align-items-center mb-2 p-2 border rounded">
                  <template v-if="media.type === 1">
                    <img :src="media.preview" alt="Lecture Image" class="img-thumbnail me-2"
                      style="max-width: 100px;" />
                  </template>
                  <template v-else-if="media.type === 2">
                    <video controls :src="media.preview" class="me-2"
                      style="max-width: 100px; border-radius: 5px;"></video>
                  </template>
                  <template v-else>
                    <a :href="media.url" target="_blank" class="me-2">
                      <i class="fas fa-file-alt me-1 bold-icon"></i>
                      <span class="bold-text">{{ media.title }}</span>
                    </a>
                  </template>
                  <button class="btn btn-danger btn-sm ms-auto" @click="removeLectureMedia(index, mediaIndex)">
                    <i class="fas fa-times bold-icon"></i>
                  </button>
                </div>
              </div>
            </div>

            <button type="button" class="btn btn-danger btn-sm" @click="openDeletePopup(index)">
              <i class="fas fa-trash-alt me-1 bold-icon"></i>
              <span class="bold-text">Remove Lecture</span>
            </button>
          </div>

          <button type="button" class="btn btn-secondary custom-btn" @click="addLecture">
            <i class="fas fa-plus me-1 bold-icon"></i>
            <span class="bold-text">Add Lecture</span>
          </button>
        </div>

        <div class="d-grid">
          <button class="btn btn-success custom-btn-lg">
            <i class="fas fa-check me-1 bold-icon"></i>
            <span class="bold-text">Save Course</span>
          </button>
        </div>
      </form>
    </div>

    <SaveConfirmPopUp :message="'Are you sure you want to save this course?'" :isVisible="showSavePopup"
      @confirmSave="handleSave" @update:isVisible="showSavePopup = $event" />

    <DeleteConfirmPopUp :message="'Are you sure you want to delete this lecture?'" :isVisible="showDeletePopup"
      @confirmDelete="handleDelete" @update:isVisible="showDeletePopup = $event" />
  </div>
</template>

<script>
import { getCourseById, updateCourse } from "@/scripts/api/services/courseService";
import { getLectures } from "@/scripts/api/services/lectureService";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import LoadingSpinner from "@/components/Common/Popup/LoadingSpinner.vue";
import SaveConfirmPopUp from "@/components/Common/Popup/SaveConfirmPopUp.vue";
import DeleteConfirmPopUp from "@/components/Common/Popup/DeleteConfirmPopUp.vue";

export default {
  name: "UpdateCourse",
  components: {
    LoadingSpinner,
    SaveConfirmPopUp,
    DeleteConfirmPopUp
  },
  data() {
    return {
      course: {
        id: "",
        title: "",
        intro: "",
        description: "",
        thumb: { url: "", file: null, title: "" },
        leafCategoryId: "",
        price: 0,
        level: 0,
        outcomes: "",
        requirements: "",
        discount: 0,
        discountExpiry: "",
        lectures: []
      },
      previewImage: null,
      showSavePopup: false,
      showDeletePopup: false,
      lectureToDeleteIndex: null
    };
  },
  methods: {
    async fetchCourse() {
      const courseId = this.$route.params.id;
      try {
        const courseData = await getCourseById(courseId);
        this.course = {
          ...courseData,
          thumb: {
            url: courseData.thumbUrl || "",
            file: null,
            title: ""
          },
          lectures: []
        };
        this.previewImage = courseData.thumbUrl || "";
        const lectureResponse = await getLectures(courseId);
        const lectureList = lectureResponse?.items || [];
        this.course.lectures = lectureList.map(l => ({
          id: l.id,
          title: l.title,
          content: l.content,
          contentSummary: l.contentSummary,
          isPreviewable: l.isPreviewable,
          medias: (l.materials || l.medias || []).map(m => ({
            ...m,
            preview: m.type === 1 || m.type === 2 ? m.url : "",
            file: null
          }))
        }));
      } catch {
        toast.error("Unable to load course data.");
      }
    },
    addLecture() {
      this.course.lectures.push({
        id: "",
        title: "",
        content: "",
        contentSummary: "",
        isPreviewable: false,
        medias: []
      });
    },
    removeLecture(index) {
      this.course.lectures.splice(index, 1);
    },
    removeLectureMedia(lectureIndex, mediaIndex) {
      this.course.lectures[lectureIndex].medias.splice(mediaIndex, 1);
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.course.thumb.file = file;
        this.course.thumb.title = file.name;
        const reader = new FileReader();
        reader.onload = e => (this.previewImage = e.target.result);
        reader.readAsDataURL(file);
      }
    },
    handleLectureMediaUpload(event, lectureIndex) {
      Array.from(event.target.files).forEach(file => {
        const type = file.type.startsWith("image")
          ? 1
          : file.type.startsWith("video")
            ? 2
            : 3;
        const reader = new FileReader();
        reader.onload = e => {
          this.course.lectures[lectureIndex].medias.push({
            type,
            file,
            preview: type < 3 ? e.target.result : "",
            url: "",
            title: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    },
    openSavePopup() {
      this.showSavePopup = true;
    },
    openDeletePopup(index) {
      this.lectureToDeleteIndex = index;
      this.showDeletePopup = true;
    },
    async handleSave(confirm) {
      if (!confirm || !this.validateForm()) return;
      this.$refs.loadingSpinner.showSpinner();
      try {
        const formData = new FormData();
        formData.append("Id", this.course.id);
        formData.append("Title", this.course.title);
        formData.append("Intro", this.course.intro);
        formData.append("Description", this.course.description);
        formData.append("Price", this.course.price);
        formData.append("Level", this.course.level);
        formData.append("Outcomes", this.course.outcomes);
        formData.append("Requirements", this.course.requirements);
        formData.append("LeafCategoryId", this.course.leafCategoryId);

        if (this.course.thumb.file) {
          const thumbBase64 = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result.split(",")[1]);
            reader.readAsDataURL(this.course.thumb.file);
          });
          formData.append("Thumb.File", thumbBase64);
          formData.append("Thumb.Title", this.course.thumb.title);
        } else if (this.course.thumb.url) {
          formData.append("Thumb.Url", this.course.thumb.url);
        }

        for (let i = 0; i < this.course.lectures.length; i++) {
          const lec = this.course.lectures[i];
          formData.append(`Lectures[${i}].Id`, lec.id || "");
          formData.append(`Lectures[${i}].Title`, lec.title);
          formData.append(`Lectures[${i}].Content`, lec.content);
          formData.append(
            `Lectures[${i}].ContentSummary`,
            lec.contentSummary
          );
          formData.append(
            `Lectures[${i}].IsPreviewable`,
            lec.isPreviewable
          );

          for (let mi = 0; mi < lec.medias.length; mi++) {
            const m = lec.medias[mi];
            if (m.file) {
              const mediaBase64 = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result.split(",")[1]);
                reader.readAsDataURL(m.file);
              });
              formData.append(
                `Lectures[${i}].Medias[${mi}].File`,
                mediaBase64
              );
              formData.append(
                `Lectures[${i}].Medias[${mi}].Title`,
                m.title
              );
            }
          }
        }

        await updateCourse(formData);
        toast.success("Course updated successfully!", { autoClose: 3000 });
        this.$router.push({
          path: "/advisor/content",
          query: {
            updateSuccess: true,
            message: "Course updated successfully!"
          }
        });
      } catch {
        toast.error(
          "An error occurred while updating the course."
        );
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },
    handleDelete(confirm) {
      if (confirm && this.lectureToDeleteIndex !== null) {
        this.removeLecture(this.lectureToDeleteIndex);
      }
      this.lectureToDeleteIndex = null;
    },
    validateForm() {
      if (!this.course.title.trim()) {
        toast.error("Please enter course title");
        return false;
      }
      if (!this.course.intro.trim()) {
        toast.error("Please enter course intro");
        return false;
      }
      if (!this.course.description.trim()) {
        toast.error("Please enter course description");
        return false;
      }
      if (!this.course.thumb.file && !this.course.thumb.url) {
        toast.error("Please select a thumbnail image");
        return false;
      }
      if (!this.course.price || this.course.price < 10000) {
        toast.error("Price must be at least 10,000 VND");
        return false;
      }
      if (this.course.level === "" || this.course.level === null) {
        toast.error("Please select course level");
        return false;
      }
      if (!this.course.outcomes.trim()) {
        toast.error("Please enter course outcomes");
        return false;
      }
      if (!this.course.requirements.trim()) {
        toast.error("Please enter course requirements");
        return false;
      }
      for (let i = 0; i < this.course.lectures.length; i++) {
        const lec = this.course.lectures[i];
        if (!lec.title.trim()) {
          toast.error(
            `Lecture ${i + 1}: please enter a title or remove this lecture`
          );
          return false;
        }
        if (!lec.content.trim()) {
          toast.error(
            `Lecture ${i + 1}: please enter content or remove this lecture`
          );
          return false;
        }
        if (!lec.contentSummary.trim()) {
          toast.error(
            `Lecture ${i + 1}: please enter summary or remove this lecture`
          );
          return false;
        }
      }
      return true;
    }
  },
  mounted() {
    this.fetchCourse();
  }
};
</script>

<style scoped>
body {
  font-family: "Arial", sans-serif;
  background-color: #f8f9fa;
}

.form-label {
  font-weight: 700;
  color: #495057;
  font-size: 1.1rem;
}

.bold-icon {
  font-weight: 700;
  font-size: 1.2rem;
}

.bold-text {
  font-weight: 700;
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

.border {
  border-color: #dee2e6 !important;
}

.form-label.required::after {
  content: " *";
  color: red;
  font-weight: bold;
}

:deep(.loading-spinner) {
  z-index: 9999;
}
</style>
