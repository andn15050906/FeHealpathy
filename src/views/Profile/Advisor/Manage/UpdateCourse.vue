<template>
  <div class="container">
    <LoadingSpinner ref="loadingSpinner" />
    <h1 class="title text-center mb-4 bold-text">Cập nhật khóa học</h1>

    <div class="card-body">
      <form @submit.prevent="openSavePopup">
        <div class="mb-3">
          <label for="title" class="form-label required">
            <i class="fas fa-pen-nib me-1 bold-icon"></i>
            <span class="bold-text">Tiêu đề khóa học</span>
          </label>
          <input type="text" id="title" v-model="course.title" class="form-control" placeholder="Nhập tiêu đề khóa học"
            @blur="validateTitle" required />
          <div v-if="errors.title" class="text-danger small mt-1">{{ errors.title }}</div>
        </div>

        <div class="mb-3">
          <label for="intro" class="form-label required">
            <i class="fas fa-book me-1 bold-icon"></i>
            <span class="bold-text">Giới thiệu khóa học</span>
          </label>
          <textarea id="intro" v-model="course.intro" class="form-control"
            placeholder="Viết một giới thiệu ngắn cho khóa học" rows="3" @blur="validateIntro" required></textarea>
          <div v-if="errors.intro" class="text-danger small mt-1">{{ errors.intro }}</div>
        </div>

        <div class="mb-3">
          <label for="description" class="form-label required">
            <i class="fas fa-align-left me-1 bold-icon"></i>
            <span class="bold-text">Mô tả chi tiết khóa học</span>
          </label>
          <textarea id="description" v-model="course.description" class="form-control"
            placeholder="Mô tả chi tiết khóa học" rows="5" @blur="validateDescription" required></textarea>
          <div v-if="errors.description" class="text-danger small mt-1">{{ errors.description }}</div>
        </div>

        <div class="mb-3">
          <label for="thumb" class="form-label required">
            <i class="fas fa-image me-1 bold-icon"></i>
            <span class="bold-text">Hình ảnh khóa học</span>
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
              <span class="bold-text">Giá khóa học</span>
            </label>
            <input type="number" id="price" v-model.number="course.price" class="form-control"
              placeholder="Enter price (VND)" min="10000" @blur="validatePrice" required />
            <div v-if="errors.price" class="text-danger small mt-1">{{ errors.price }}</div>
          </div>

          <div class="col-md-4">
            <label for="discount" class="form-label">
              <i class="fas fa-tags me-1 bold-icon"></i>
              <span class="bold-text">Giảm giá (%)</span>
            </label>
            <input type="number" id="discount" v-model.number="course.discount" class="form-control"
              placeholder="Phần trăm giảm giá" min="0" max="100" />
          </div>

          <div class="col-md-4">
            <label for="discountExpiry" class="form-label">
              <i class="fas fa-calendar-alt me-1 bold-icon"></i>
              <span class="bold-text">Ngày hết hạn giảm giá</span>
            </label>
            <input type="date" id="discountExpiry" v-model="course.discountExpiry" class="form-control" />
          </div>
        </div>

        <div class="mb-3">
          <label for="status" class="form-label required">
            <i class="fas fa-flag me-1 bold-icon"></i>
            <span class="bold-text">Trạng thái khóa học</span>
          </label>
          <select id="status" v-model="course.status" required class="form-select">
            <option value="0">Bản nháp</option>
            <option value="1">Đã xuất bản</option>
            <option value="2">Đã lưu trữ</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="level" class="form-label required">
            <i class="fas fa-signal me-1 bold-icon"></i>
            <span class="bold-text">Cấp độ khóa học</span>
          </label>
          <select id="level" v-model="course.level" required class="form-select" @blur="validateLevel">
            <option value="" disabled>Chọn cấp độ</option>
            <option value="0">Người mới bắt đầu</option>
            <option value="1">Trung bình</option>
            <option value="2">Nâng cao</option>
          </select>
          <div v-if="errors.level" class="text-danger small mt-1">{{ errors.level }}</div>
        </div>

        <div class="mb-3">
          <label for="outcomes" class="form-label required">
            <i class="fas fa-award me-1 bold-icon"></i>
            <span class="bold-text">Kết quả học tập</span>
          </label>
          <textarea id="outcomes" v-model="course.outcomes" class="form-control"
            placeholder="Kết quả học tập mong đợi" rows="3" @blur="validateOutcomes" required></textarea>
          <div v-if="errors.outcomes" class="text-danger small mt-1">{{ errors.outcomes }}</div>
        </div>

        <div class="mb-3">
          <label for="requirements" class="form-label required">
            <i class="fas fa-info-circle me-1 bold-icon"></i>
            <span class="bold-text">Yêu cầu khóa học</span>
          </label>
          <textarea id="requirements" v-model="course.requirements" class="form-control"
            placeholder="Điều kiện tiên quyết" rows="3" @blur="validateRequirements" required></textarea>
          <div v-if="errors.requirements" class="text-danger small mt-1">{{ errors.requirements }}</div>
        </div>

        <div class="mb-4">
          <h2 class="h5 mb-3">
            <i class="fas fa-list-ul me-1 bold-icon"></i>
            <span class="bold-text">Bài giảng khóa học</span>
          </h2>

          <div class="mb-4 border rounded p-3" v-for="(lecture, index) in course.lectures" :key="index">
            <div class="mb-3">
              <label class="form-label required">
                <i class="fas fa-sticky-note me-1 bold-icon"></i>
                <span class="bold-text">Tiêu đề bài giảng</span>
              </label>
              <input type="text" v-model="lecture.title" class="form-control" placeholder="Tiêu đề bài giảng"
                @blur="validateLecture(index)" required />
              <div v-if="lectureErrors[index] && lectureErrors[index].title" class="text-danger small mt-1">
                {{ lectureErrors[index].title }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label required">
                <i class="fas fa-align-left me-1 bold-icon"></i>
                <span class="bold-text">Nội dung bài giảng</span>
              </label>
              <textarea v-model="lecture.content" class="form-control" placeholder="Nội dung bài giảng" rows="4"
                @blur="validateLecture(index)" required></textarea>
              <div v-if="lectureErrors[index] && lectureErrors[index].content" class="text-danger small mt-1">
                {{ lectureErrors[index].content }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label required">
                <i class="fas fa-align-left me-1 bold-icon"></i>
                <span class="bold-text">Tóm tắt nội dung</span>
              </label>
              <textarea v-model="lecture.contentSummary" class="form-control" placeholder="Tóm tắt nội dung" rows="4"
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
                <span class="bold-text">Có thể xem trước</span>
              </label>
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="fas fa-upload me-1 bold-icon"></i>
                  <span class="bold-text">Tải lên tài liệu bài giảng</span>
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
              <span class="bold-text">Xóa bài giảng</span>
            </button>
          </div>

          <button type="button" class="btn btn-secondary custom-btn" @click="addLecture">
            <i class="fas fa-plus me-1 bold-icon"></i>
            <span class="bold-text">Thêm bài giảng</span>
          </button>
        </div>

        <div class="d-grid">
          <button class="btn btn-success custom-btn-lg">
            <i class="fas fa-check me-1 bold-icon"></i>
            <span class="bold-text">Lưu khóa học</span>
          </button>
        </div>
      </form>
    </div>

    <SaveConfirmPopUp :message="'Bạn có chắc chắn muốn lưu khóa học này?'" :isVisible="showSavePopup"
      @confirmSave="handleSave" @update:isVisible="showSavePopup = $event" />

    <DeleteConfirmPopUp :message="'Bạn có chắc chắn muốn xóa bài giảng này?'" :isVisible="showDeletePopup"
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
import DeleteConfirmPopUp from "@/components/Common/Popup/DeleteConfirmPopup.vue";

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
          removedMedias: [],
          isNew: false
        }));

        this.originalLectures = JSON.parse(JSON.stringify(this.course.lectures));
        this.initializeLectureErrors();
      } catch (error) {
        toast.error("Không thể tải dữ liệu khóa học.");
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
        removedMedias: [],
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
        this.course.lectures[lectureIndex].removedMedias.push(media.id);
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
        this.errors.thumb = "Kích thước file phải nhỏ hơn 5MB";
        return;
      }
      if (!file.type.startsWith("image/")) {
        this.errors.thumb = "Chỉ cho phép tải lên file hình ảnh";
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

          lecture.removedMedias.forEach((id, index) => {
            formData.append(`RemovedMedias[${index}]`, id);
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
            message: "Khóa học đã được cập nhật thành công!"
          }
        });
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi cập nhật khóa học.");
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
        this.errors.title = "Vui lòng nhập tiêu đề khóa học";
      } else if (this.course.title.trim().length < 5) {
        this.errors.title = "Tiêu đề khóa học phải có ít nhất 5 ký tự";
      } else if (this.course.title.trim().length > 255) {
        this.errors.title = "Tiêu đề khóa học phải nhỏ hơn 255 ký tự";
      } else {
        this.errors.title = "";
      }
    },
    validateIntro() {
      if (!this.course.intro.trim()) {
        this.errors.intro = "Vui lòng nhập giới thiệu khóa học";
      } else {
        this.errors.intro = "";
      }
    },
    validateDescription() {
      if (!this.course.description.trim()) {
        this.errors.description = "Vui lòng nhập mô tả khóa học";
      } else {
        this.errors.description = "";
      }
    },
    validatePrice() {
      if (!this.course.price || this.course.price < 10000) {
        this.errors.price = "Giá khóa học phải tối thiểu 10,000 VNĐ";
      } else {
        this.errors.price = "";
      }
    },
    validateLevel() {
      if (this.course.level === "" || this.course.level === null) {
        this.errors.level = "Vui lòng chọn cấp độ khóa học";
      } else {
        this.errors.level = "";
      }
    },
    validateOutcomes() {
      if (!this.course.outcomes.trim()) {
        this.errors.outcomes = "Vui lòng nhập kết quả học tập";
      } else {
        this.errors.outcomes = "";
      }
    },
    validateRequirements() {
      if (!this.course.requirements.trim()) {
        this.errors.requirements = "Vui lòng nhập điều kiện tiên quyết";
      } else {
        this.errors.requirements = "";
      }
    },
    validateThumb() {
      if (!this.course.thumb.file && !this.course.thumb.url) {
        this.errors.thumb = "Vui lòng chọn hình ảnh bìa";
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
        errors.title = `Bài giảng ${index + 1}: vui lòng nhập tiêu đề hoặc xóa bài giảng`;
      } else if (lec.title.trim().length < 5) {
        errors.title = `Bài giảng ${index + 1}: tiêu đề phải có ít nhất 5 ký tự`;
      } else if (lec.title.trim().length > 255) {
        errors.title = `Bài giảng ${index + 1}: tiêu đề phải nhỏ hơn 255 ký tự`;
      }

      if (!lec.content || !lec.content.trim()) {
        errors.content = `Bài giảng ${index + 1}: vui lòng nhập nội dung hoặc xóa bài giảng`;
      } else if (lec.content.trim().length < 10) {
        errors.content = `Bài giảng ${index + 1}: nội dung phải có ít nhất 10 ký tự`;
      } else if (lec.content.trim().length > 1000) {
        errors.content = `Bài giảng ${index + 1}: nội dung phải nhỏ hơn 1000 ký tự`;
      }

      if (!lec.contentSummary || !lec.contentSummary.trim()) {
        errors.contentSummary = `Bài giảng ${index + 1}: vui lòng nhập tóm tắt hoặc xóa bài giảng`;
      } else if (lec.contentSummary.trim().length < 5) {
        errors.contentSummary = `Bài giảng ${index + 1}: tóm tắt phải có ít nhất 5 ký tự`;
      } else if (lec.contentSummary.trim().length > 100) {
        errors.contentSummary = `Bài giảng ${index + 1}: tóm tắt phải nhỏ hơn 100 ký tự`;
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
        toast.error(`Vui lòng sửa lỗi: ${this.errors[firstError]}`);
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
