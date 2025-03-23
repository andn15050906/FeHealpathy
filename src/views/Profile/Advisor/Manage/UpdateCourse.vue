<template>
  <div class="container">
    <div class="card shadow custom-card">
      <div class="card-header bg-primary text-white text-center py-3">
        <h1 class="h3 mb-0">
          <i class="fas fa-book-open me-2 bold-icon"></i>
          <span class="bold-text">Update Course</span>
        </h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="openSavePopup">
          <div class="mb-3">
            <label for="title" class="form-label">
              <i class="fas fa-pen-nib me-1 bold-icon"></i>
              <span class="bold-text">Course Title</span>
            </label>
            <input type="text" id="title" v-model="course.title" class="form-control" placeholder="Insert course title"
              required />
          </div>
          <div class="mb-3">
            <label for="intro" class="form-label">
              <i class="fas fa-book me-1 bold-icon"></i>
              <span class="bold-text">Course Intro</span>
            </label>
            <textarea id="intro" v-model="course.intro" class="form-control"
              placeholder="Write a short intro for the course" rows="3" required></textarea>
          </div>
          <div class="mb-3">
            <label for="description" class="form-label">
              <i class="fas fa-align-left me-1 bold-icon"></i>
              <span class="bold-text">Course Description</span>
            </label>
            <textarea id="description" v-model="course.description" class="form-control"
              placeholder="Detailed course description" rows="5" required></textarea>
          </div>
          <div class="mb-3">
            <label for="thumb" class="form-label">
              <i class="fas fa-image me-1 bold-icon"></i>
              <span class="bold-text">Course Thumbnail</span>
            </label>
            <input type="file" id="thumb" @change="handleImageUpload" class="form-control" accept="image/*" />
            <div v-if="previewImage" class="mt-2 text-center">
              <img :src="previewImage" alt="Course Thumbnail" class="img-thumbnail" style="max-width: 200px;" />
            </div>
          </div>
          <!-- <div class="mb-3">
            <label for="category" class="form-label">
              <i class="fas fa-folder-open me-1 bold-icon"></i>
              <span class="bold-text">Course Category</span>
            </label>
            <select id="category" v-model="course.leafCategoryId" required class="form-select">
              <option value="" disabled>Choose a category</option>
              <option v-for="(category, index) in availableCategories" :key="index" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div> -->

          <div class="mb-3">
            <label for="price" class="form-label">
              <i class="fas fa-dollar-sign me-1 bold-icon"></i>
              <span class="bold-text">Course Price</span>
            </label>
            <input type="number" id="price" v-model="course.price" class="form-control" placeholder="Enter price (VND)"
              min="0" required />
          </div>
          <div class="mb-3">
            <label for="level" class="form-label">
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
            <label for="outcomes" class="form-label">
              <i class="fas fa-award me-1 bold-icon"></i>
              <span class="bold-text">Course Outcomes</span>
            </label>
            <textarea id="outcomes" v-model="course.outcomes" class="form-control"
              placeholder="Expected learning outcomes" rows="3"></textarea>
          </div>
          <div class="mb-3">
            <label for="requirements" class="form-label">
              <i class="fas fa-info-circle me-1 bold-icon"></i>
              <span class="bold-text">Course Requirements</span>
            </label>
            <textarea id="requirements" v-model="course.requirements" class="form-control"
              placeholder="Course prerequisites" rows="3"></textarea>
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
                <input type="text" v-model="lecture.title" class="form-control" placeholder="Lecture title" required />
              </div>
              <div class="mb-3">
                <label class="form-label">
                  <i class="fas fa-align-left me-1 bold-icon"></i>
                  <span class="bold-text">Lecture Content</span>
                </label>
                <textarea v-model="lecture.content" class="form-control" placeholder="Lecture content" rows="4"
                  required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">
                  <i class="fas fa-align-left me-1 bold-icon"></i>
                  <span class="bold-text">Content Summary</span>
                </label>
                <textarea v-model="lecture.contentSummary" class="form-control" placeholder="Lecture content" rows="4"
                  required></textarea>
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
                  <div v-if="lecture.medias && lecture.medias.length > 0" class="mt-2">
                  <div v-for="(media, mediaIndex) in lecture.medias" :key="mediaIndex"
                    class="d-flex align-items-center mb-2 p-2 border rounded">
                    <template v-if="media.type === 'image'">
                      <img :src="media.preview" alt="Lecture Image" class="img-thumbnail me-2"
                        style="max-width: 100px;" />
                    </template>
                    <template v-else-if="media.type === 'video'">
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
              <button class="btn btn-danger btn-sm" @click="removeLecture(index)">
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
            <button type="submit" class="btn btn-success custom-btn-lg">
              <i class="fas fa-check me-1 bold-icon"></i>
              <span class="bold-text">Save Course</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    <SaveConfirmPopUp :message="'Are you sure you want to save this course?'" :isVisible="showSavePopup"
      @confirmSave="handleSave" @update:isVisible="showSavePopup = $event" />
  </div>
</template>

<script>
import SaveConfirmPopUp from '../../../../components/Common/Popup/SaveConfirmPopUp.vue';
import { getCourseById, updateCourse } from "@/scripts/api/services/courseService";
import { getLectures } from "@/scripts/api/services/lectureService";

export default {
  name: "UpdateCourse",
  components: { SaveConfirmPopUp },
  data() {
    return {
      course: {
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
        lectures: [],
      },
      previewImage: null,
      isSubmitting: false,
      showSavePopup: false,
    };
  },
  methods: {
    async fetchCourse() {
  const courseId = this.$route.params.id;
  try {
    const [courseData, lectureResponse] = await Promise.all([
      getCourseById(courseId),
      getLectures({ courseId: courseId })
    ]);

    this.course = {
      ...courseData,
      thumb: {
        url: courseData.thumbUrl || '',
        file: null,
        title: ''
      },
      lectures: lectureResponse.items.map(lecture => ({
        title: lecture.title,
        content: lecture.content,
        contentSummary: lecture.contentSummary,
        isPreviewable: lecture.isPreviewable,
        medias: lecture.materials,
        id: lecture.id,
      }))
    };
    this.previewImage = courseData.thumbUrl || '';
  } catch (error) {
    console.error('Error fetching course details or lectures:', error);
    this.course.lectures = [];
  }
}

,
    addLecture() {
      this.course.lectures.push({
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
    openSavePopup() {
      this.showSavePopup = true;
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.course.thumb.file = file;
        this.course.thumb.title = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    handleLectureMediaUpload(event, lectureIndex) {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        const fileType = file.type.startsWith("image")
          ? "image"
          : file.type.startsWith("video")
            ? "video"
            : "document";
        const reader = new FileReader();
        reader.onload = (e) => {
          this.course.lectures[lectureIndex].medias.push({
            type: fileType,
            file: file,
            preview: e.target.result,
            url: "",
            title: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    },
    async handleSave(confirm) {
      if (this.validateCourse() && confirm) {
        this.isSubmitting = true;
        try {
          const response = await updateCourse(this.course);
          console.log('Course updated successfully:', response);
          this.$router.push('/courses');
        } catch (error) {
          console.error('Failed to update course:', error);
        } finally {
          this.isSubmitting = false;
        }
      }
    },
    validateCourse() {
      if (!this.course.title || this.course.price <= 0 || !this.course.leafCategoryId) {
        alert("Please fill out all required fields correctly.");
        return false;
      }
      return true;
    },
  },
  mounted() {
    this.fetchCourse();
  },
};
</script>





<style scoped>
body {
  font-family: "Arial", sans-serif;
  background-color: #f8f9fa;
}

.custom-card {
  border: none;
  border-radius: 10px;
  max-width: 100%;
  margin: auto;
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

.shadow {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}
</style>