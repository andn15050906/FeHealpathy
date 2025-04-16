<!-- TODO: Update MEDIAS for courses and lectures -->

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
            @blur="validateTitle" required />
          <div v-if="errors.title" class="text-danger small mt-1">{{ errors.title }}</div>
        </div>

        <div class="mb-3">
          <label for="intro" class="form-label required">
            <i class="fas fa-book me-1 bold-icon"></i>
            <span class="bold-text">Course Intro</span>
          </label>
          <textarea id="intro" v-model="course.intro" class="form-control"
            placeholder="Write a short intro for the course" rows="3" @blur="validateIntro" required></textarea>
          <div v-if="errors.intro" class="text-danger small mt-1">{{ errors.intro }}</div>
        </div>

        <div class="mb-3">
          <label for="description" class="form-label required">
            <i class="fas fa-align-left me-1 bold-icon"></i>
            <span class="bold-text">Course Description</span>
          </label>
          <textarea id="description" v-model="course.description" class="form-control"
            placeholder="Detailed course description" rows="5" @blur="validateDescription" required></textarea>
          <div v-if="errors.description" class="text-danger small mt-1">{{ errors.description }}</div>
        </div>

        <div class="mb-3">
          <label for="thumb" class="form-label required">
            <i class="fas fa-image me-1 bold-icon"></i>
            <span class="bold-text">Course Thumbnail</span>
          </label>
          <input type="file" id="thumb" @change="handleImageUpload" class="form-control" accept="image/*" />
          <div v-if="errors.thumb" class="text-danger small mt-1">{{ errors.thumb }}</div>
          <div v-if="previewImage" class="mt-2 text-center">
            <img :src="previewImage" alt="Course Thumbnail" class="img-thumbnail" style="max-width: 200px;" />
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-4">
            <label for="price" class="form-label required">
              <i class="fas fa-dollar-sign me-1 bold-icon"></i>
              <span class="bold-text">Course Price</span>
            </label>
            <input type="number" id="price" v-model.number="course.price" class="form-control"
              placeholder="Enter price (VND)" min="10000" @blur="validatePrice" required />
            <div v-if="errors.price" class="text-danger small mt-1">{{ errors.price }}</div>
          </div>

          <div class="col-md-4">
            <label for="discount" class="form-label">
              <i class="fas fa-tags me-1 bold-icon"></i>
              <span class="bold-text">Discount (%)</span>
            </label>
            <input type="number" id="discount" v-model.number="course.discount" class="form-control"
              placeholder="Discount percentage" min="0" max="100" />
          </div>

          <div class="col-md-4">
            <label for="discountExpiry" class="form-label">
              <i class="fas fa-calendar-alt me-1 bold-icon"></i>
              <span class="bold-text">Discount Expiry Date</span>
            </label>
            <input type="date" id="discountExpiry" v-model="course.discountExpiry" class="form-control" />
          </div>
        </div>

        <div class="mb-3">
          <label for="status" class="form-label required">
            <i class="fas fa-flag me-1 bold-icon"></i>
            <span class="bold-text">Course Status</span>
          </label>
          <select id="status" v-model="course.status" required class="form-select">
            <option value="0">Draft</option>
            <option value="1">Published</option>
            <option value="2">Archived</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="level" class="form-label required">
            <i class="fas fa-signal me-1 bold-icon"></i>
            <span class="bold-text">Course Level</span>
          </label>
          <select id="level" v-model="course.level" required class="form-select" @blur="validateLevel">
            <option value="" disabled>Select level</option>
            <option value="0">Beginner</option>
            <option value="1">Intermediate</option>
            <option value="2">Advanced</option>
          </select>
          <div v-if="errors.level" class="text-danger small mt-1">{{ errors.level }}</div>
        </div>

        <div class="mb-3">
          <label for="outcomes" class="form-label required">
            <i class="fas fa-award me-1 bold-icon"></i>
            <span class="bold-text">Course Outcomes</span>
          </label>
          <textarea id="outcomes" v-model="course.outcomes" class="form-control"
            placeholder="Expected learning outcomes" rows="3" @blur="validateOutcomes" required></textarea>
          <div v-if="errors.outcomes" class="text-danger small mt-1">{{ errors.outcomes }}</div>
        </div>

        <div class="mb-3">
          <label for="requirements" class="form-label required">
            <i class="fas fa-info-circle me-1 bold-icon"></i>
            <span class="bold-text">Course Requirements</span>
          </label>
          <textarea id="requirements" v-model="course.requirements" class="form-control"
            placeholder="Course prerequisites" rows="3" @blur="validateRequirements" required></textarea>
          <div v-if="errors.requirements" class="text-danger small mt-1">{{ errors.requirements }}</div>
        </div>

        <div class="mb-4">
          <h2 class="h5 mb-3">
            <i class="fas fa-list-ul me-1 bold-icon"></i>
            <span class="bold-text">Course Lectures</span>
          </h2>

          <div class="mb-4 border rounded p-3" v-for="(lecture, index) in course.lectures" :key="index">
            <div class="mb-3">
              <label class="form-label required">
                <i class="fas fa-sticky-note me-1 bold-icon"></i>
                <span class="bold-text">Lecture Title</span>
              </label>
              <input type="text" v-model="lecture.title" class="form-control" placeholder="Lecture title"
                @blur="validateLecture(index)" required />
              <div v-if="lectureErrors[index] && lectureErrors[index].title" class="text-danger small mt-1">
                {{ lectureErrors[index].title }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label required">
                <i class="fas fa-align-left me-1 bold-icon"></i>
                <span class="bold-text">Lecture Content</span>
              </label>
              <textarea v-model="lecture.content" class="form-control" placeholder="Lecture content" rows="4"
                @blur="validateLecture(index)" required></textarea>
              <div v-if="lectureErrors[index] && lectureErrors[index].content" class="text-danger small mt-1">
                {{ lectureErrors[index].content }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label required">
                <i class="fas fa-align-left me-1 bold-icon"></i>
                <span class="bold-text">Content Summary</span>
              </label>
              <textarea v-model="lecture.contentSummary" class="form-control" placeholder="Lecture summary" rows="4"
                @blur="validateLecture(index)" required></textarea>
              <div v-if="lectureErrors[index] && lectureErrors[index].contentSummary" class="text-danger small mt-1">
                {{ lectureErrors[index].contentSummary }}
              </div>
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
              <input type="file" :ref="'fileInput' + index" class="form-control"
                @change="handleLectureMediaUpload($event, index)" accept="image/*,video/*,application/pdf" multiple />
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
import { getLectures, updateLecture, createLecture, deleteLecture } from "@/scripts/api/services/lectureService";
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
        status: 0,
        price: 0,
        level: "",
        outcomes: "",
        requirements: "",
        discount: 0,
        discountExpiry: "",
        lectures: []
      },
      previewImage: null,
      showSavePopup: false,
      showDeletePopup: false,
      lectureToDeleteIndex: null,
      errors: {
        title: "",
        intro: "",
        description: "",
        price: "",
        level: "",
        outcomes: "",
        requirements: "",
        thumb: ""
      },
      lectureErrors: [],
      originalLectures: [],
      deletedLectureIds: []
    };
  },
  methods: {
    async fetchCourse() {
      const courseId = this.$route.params.id;
      try {
        this.$refs.loadingSpinner.showSpinner();
        const courseData = await getCourseById(courseId);
        courseData.discount *= 100;
        if (courseData.discountExpiry) {
          const expiryDate = new Date(courseData.discountExpiry);
          courseData.discountExpiry = expiryDate.toISOString().split("T")[0];
        }
        this.course = {
          ...courseData,
          thumb: {
            url: courseData.thumbUrl || "",
            file: null,
            title: courseData.title || ""
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
            id: m.id,
            type: m.type,
            preview: m.type === 1 || m.type === 2 ? m.url : "",
            url: m.url,
            title: m.title,
            file: null,
            isDeleted: false
          })),
          addedMedias: [],
          removedMediaIds: [],
          isNew: false
        }));

        this.originalLectures = JSON.parse(JSON.stringify(this.course.lectures));
        this.initializeLectureErrors();
      } catch (error) {
        toast.error("Unable to load course data.");
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },
    initializeLectureErrors() {
      this.lectureErrors = Array(this.course.lectures.length).fill().map(() => ({
        title: "",
        content: "",
        contentSummary: ""
      }));
    },
    addLecture() {
      this.course.lectures.push({
        title: "",
        content: "",
        contentSummary: "",
        isPreviewable: false,
        medias: [],
        addedMedias: [],
        removedMediaIds: [],
        isNew: true
      });
      this.lectureErrors.push({
        title: "",
        content: "",
        contentSummary: ""
      });
    },
    removeLecture(index) {
      const lecture = this.course.lectures[index];
      if (lecture.id && !lecture.isNew) {
        this.deletedLectureIds.push(lecture.id);
      }
      this.course.lectures.splice(index, 1);
      this.lectureErrors.splice(index, 1);
    },
    removeLectureMedia(lectureIndex, mediaIndex) {
      const media = this.course.lectures[lectureIndex].medias[mediaIndex];

      if (media.id) {
        this.course.lectures[lectureIndex].removedMediaIds.push(media.id);
      }

      this.course.lectures[lectureIndex].medias.splice(mediaIndex, 1);

      if (this.course.lectures[lectureIndex].medias.length === 0) {
        this.$nextTick(() => {
          if (this.$refs['fileInput' + lectureIndex]) {
            if (Array.isArray(this.$refs['fileInput' + lectureIndex])) {
              this.$refs['fileInput' + lectureIndex][0].value = '';
            } else {
              this.$refs['fileInput' + lectureIndex].value = '';
            }
          }
        });
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.processThumbFile(file);
    },
    processThumbFile(file) {
      if (!file) return;
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.errors.thumb = "File size must be less than 5MB";
        return;
      }
      if (!file.type.startsWith("image/")) {
        this.errors.thumb = "Only image files are allowed";
        return;
      }
      this.errors.thumb = "";
      this.course.thumb.file = file;
      this.course.thumb.title = file.name;
      const reader = new FileReader();
      reader.onload = e => (this.previewImage = e.target.result);
      reader.readAsDataURL(file);
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
          const newMedia = {
            type,
            file,
            preview: type < 3 ? e.target.result : "",
            url: "",
            title: file.name
          };

          this.course.lectures[lectureIndex].medias.push(newMedia);
          this.course.lectures[lectureIndex].addedMedias.push(newMedia);
        };
        reader.readAsDataURL(file);
      });
    },
    openSavePopup() {
      if (this.validateForm()) {
        this.showSavePopup = true;
      }
    },
    openDeletePopup(index) {
      this.lectureToDeleteIndex = index;
      this.showDeletePopup = true;
    },
    async handleSave(confirm) {
      if (!confirm) return;

      this.$refs.loadingSpinner.showSpinner();
      try {
        const courseFormData = new FormData();
        courseFormData.append("Id", this.course.id);
        courseFormData.append("Title", this.course.title);
        courseFormData.append("Intro", this.course.intro);
        courseFormData.append("Description", this.course.description);
        courseFormData.append("Status", this.course.status);
        courseFormData.append("Price", this.course.price);
        courseFormData.append("Discount", this.course.discount / 100);
        courseFormData.append("DiscountExpiry", this.course.discountExpiry);
        courseFormData.append("Level", this.course.level);
        courseFormData.append("Outcomes", this.course.outcomes);
        courseFormData.append("Requirements", this.course.requirements);
        courseFormData.append("LeafCategoryId", this.course.leafCategoryId);

        if (this.course.thumb.file) {
          courseFormData.append("Thumb.File", this.course.thumb.file);
          courseFormData.append("Thumb.Title", this.course.thumb.title);
        } else if (this.course.thumb.url) {
          courseFormData.append("Thumb.Title", this.course.title);
          courseFormData.append("Thumb.Url", this.course.thumb.url);
        }

        await updateCourse(courseFormData);

        for (const lectureId of this.deletedLectureIds) {
          await deleteLecture(lectureId);
        }

        console.log("Deleted lecture IDs:", this.deletedLectureIds);

        const existingLectures = this.course.lectures.filter(lecture => !lecture.isNew);
        const newLectures = this.course.lectures.filter(lecture => lecture.isNew);

        for (const lecture of existingLectures) {
          const formData = new FormData();
          formData.append("Id", lecture.id);
          formData.append("CourseId", this.course.id);
          formData.append("Title", lecture.title);
          formData.append("Content", lecture.content);
          formData.append("ContentSummary", lecture.contentSummary);
          formData.append("IsPreviewable", lecture.isPreviewable);

          lecture.removedMediaIds.forEach((id, index) => {
            formData.append(`RemovedMediaIds[${index}]`, id);
          });

          if (lecture.addedMedias.length > 0) {
            lecture.addedMedias.forEach((media, index) => {
              if (media.file) {
                formData.append(`AddedMedias[${index}].File`, media.file);
                formData.append(`AddedMedias[${index}].Title`, media.title);
                formData.append(`AddedMedias[${index}].Type`, media.type);
              }
            });
          }

          await updateLecture(formData);
        }

        for (const lecture of newLectures) {
          const formData = new FormData();
          formData.append("CourseId", this.course.id);
          formData.append("Title", lecture.title);
          formData.append("Content", lecture.content);
          formData.append("ContentSummary", lecture.contentSummary);
          formData.append("IsPreviewable", lecture.isPreviewable);

          lecture.addedMedias.forEach((media, index) => {
            if (media.file) {
              formData.append(`AddedMedias[${index}].File`, media.file);
              formData.append(`AddedMedias[${index}].Title`, media.title);
              formData.append(`AddedMedias[${index}].Type`, media.type);
            }
          });

          await createLecture(formData);
        }

        toast.success("Course updated successfully!", { autoClose: 3000 });
        this.$router.push({
          path: "/advisor/content",
          query: {
            updateSuccess: true,
            message: "Course updated successfully!"
          }
        });
      } catch (error) {
        toast.error("An error occurred while updating the course.");
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
    validateTitle() {
      if (!this.course.title.trim()) {
        this.errors.title = "Please enter course title";
      } else if (this.course.title.trim().length < 5) {
        this.errors.title = "Course title must be at least 5 characters";
      } else if (this.course.title.trim().length > 255) {
        this.errors.title = "Course title must be less than 255 characters";
      } else {
        this.errors.title = "";
      }
    },
    validateIntro() {
      if (!this.course.intro.trim()) {
        this.errors.intro = "Please enter course intro";
      } else {
        this.errors.intro = "";
      }
    },
    validateDescription() {
      if (!this.course.description.trim()) {
        this.errors.description = "Please enter course description";
      } else {
        this.errors.description = "";
      }
    },
    validatePrice() {
      if (!this.course.price || this.course.price < 10000) {
        this.errors.price = "Price must be at least 10,000 VND";
      } else {
        this.errors.price = "";
      }
    },
    validateLevel() {
      if (this.course.level === "" || this.course.level === null) {
        this.errors.level = "Please select course level";
      } else {
        this.errors.level = "";
      }
    },
    validateOutcomes() {
      if (!this.course.outcomes.trim()) {
        this.errors.outcomes = "Please enter course outcomes";
      } else {
        this.errors.outcomes = "";
      }
    },
    validateRequirements() {
      if (!this.course.requirements.trim()) {
        this.errors.requirements = "Please enter course requirements";
      } else {
        this.errors.requirements = "";
      }
    },
    validateThumb() {
      if (!this.course.thumb.file && !this.course.thumb.url) {
        this.errors.thumb = "Please select a thumbnail image";
      } else {
        this.errors.thumb = "";
      }
    },
    validateLecture(index) {
      if (!this.lectureErrors[index]) {
        while (this.lectureErrors.length <= index) {
          this.lectureErrors.push({
            title: "",
            content: "",
            contentSummary: ""
          });
        }
      }

      const lec = this.course.lectures[index];
      const errors = {
        title: "",
        content: "",
        contentSummary: ""
      };

      if (!lec.title || !lec.title.trim()) {
        errors.title = `Lecture ${index + 1}: please enter a title or remove this lecture`;
      } else if (lec.title.trim().length < 5) {
        errors.title = `Lecture ${index + 1}: title must be at least 5 characters`;
      } else if (lec.title.trim().length > 255) {
        errors.title = `Lecture ${index + 1}: title must be less than 255 characters`;
      }

      if (!lec.content || !lec.content.trim()) {
        errors.content = `Lecture ${index + 1}: please enter content or remove this lecture`;
      } else if (lec.content.trim().length < 10) {
        errors.content = `Lecture ${index + 1}: content must be at least 10 characters`;
      } else if (lec.content.trim().length > 1000) {
        errors.content = `Lecture ${index + 1}: content must be less than 1000 characters`;
      }

      if (!lec.contentSummary || !lec.contentSummary.trim()) {
        errors.contentSummary = `Lecture ${index + 1}: please enter summary or remove this lecture`;
      } else if (lec.contentSummary.trim().length < 5) {
        errors.contentSummary = `Lecture ${index + 1}: summary must be at least 5 characters`;
      } else if (lec.contentSummary.trim().length > 100) {
        errors.contentSummary = `Lecture ${index + 1}: summary must be less than 100 characters`;
      }

      this.lectureErrors[index] = errors;
      return errors.title === "" && errors.content === "" && errors.contentSummary === "";
    },
    validateAllLectures() {
      this.initializeLectureErrors();

      let allValid = true;
      for (let i = 0; i < this.course.lectures.length; i++) {
        const isValid = this.validateLecture(i);
        if (!isValid) {
          allValid = false;
        }
      }
      return allValid;
    },
    validateForm() {
      this.validateTitle();
      this.validateIntro();
      this.validateDescription();
      this.validatePrice();
      this.validateLevel();
      this.validateOutcomes();
      this.validateRequirements();
      this.validateThumb();

      const lecturesValid = this.validateAllLectures();

      if (Object.values(this.errors).some(err => err !== "")) {
        const firstError = Object.keys(this.errors).find(key => this.errors[key] !== "");
        toast.error(`Please fix the error: ${this.errors[firstError]}`);
        return false;
      }

      if (!lecturesValid) {
        for (let i = 0; i < this.lectureErrors.length; i++) {
          const err = this.lectureErrors[i];
          if (err.title) {
            return false;
          } else if (err.content) {
            return false;
          } else if (err.contentSummary) {
            return false;
          }
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