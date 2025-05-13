<template>
  <div class="container-fluid">
    <div class="row mb-4 p-2">
      <div class="col-12">
        <div class="d-flex align-items-center">
          <button class="btn btn-outline-secondary me-3" @click="goBack">
            <ArrowLeftIcon class="icon" />
            Quay lại
          </button>
          <h1 class="h3 mb-0">Cập nhật khóa học</h1>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-8">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white py-3">
            <h5 class="mb-0">Thông tin khóa học</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateCourse">
              <div class="mb-3">
                <label for="courseName" class="form-label">Tên khóa học</label>
                <input type="text" class="form-control" id="courseName" v-model="course.name"
                  placeholder="Nhập tên khóa học" required />
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="courseCategory" class="form-label">Danh mục</label>
                  <select class="form-select" id="courseCategory" v-model="course.category" required>
                    <option value="" disabled>Chọn danh mục</option>
                    <option v-for="category in categories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="coursePrice" class="form-label">Giá ($)</label>
                  <input type="number" class="form-control" id="coursePrice" v-model="course.price" min="0" step="0.01"
                    placeholder="0.00" required />
                </div>
              </div>

              <div class="mb-3">
                <label for="courseDescription" class="form-label">Mô tả</label>
                <textarea class="form-control" id="courseDescription" v-model="course.description" rows="4"
                  placeholder="Mô tả khóa học" required></textarea>
              </div>

              <div class="mb-3">
                <label for="courseImage" class="form-label">Hình ảnh khóa học</label>
                <div class="d-flex align-items-center mb-2">
                  <img :src="course.image" alt="Hình thu nhỏ khóa học" class="img-thumbnail me-3"
                    style="max-height: 100px" />
                  <div>Hình hiện tại</div>
                </div>
                <div class="input-group">
                  <input type="file" class="form-control" id="courseImage" @change="handleImageUpload"
                    accept="image/*" />
                  <label class="input-group-text" for="courseImage">
                    <UploadIcon class="icon me-1" /> Tải lên mới
                  </label>
                </div>
                <small class="text-muted">Kích thước khuyến nghị: 1280x720px (16:9)</small>

                <div v-if="course.imagePreview" class="mt-3">
                  <img :src="course.imagePreview" alt="Xem trước hình ảnh" class="img-thumbnail"
                    style="max-height: 200px" />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label d-block">Trạng thái</label>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="courseStatus" id="statusDraft" value="Draft"
                    v-model="course.status" />
                  <label class="form-check-label" for="statusDraft">Nháp</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="courseStatus" id="statusActive" value="Active"
                    v-model="course.status" />
                  <label class="form-check-label" for="statusActive">Đang hoạt động</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="courseStatus" id="statusInactive" value="Inactive"
                    v-model="course.status" />
                  <label class="form-check-label" for="statusInactive">Ngừng hoạt động</label>
                </div>
              </div>

              <hr class="my-4" />

              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">Bài giảng</h5>
                <div class="d-flex">
                  <button type="button" class="btn btn-sm btn-outline-secondary me-2" @click="reorderLectures">
                    <ListOrderedIcon class="icon me-1" /> Sắp xếp lại
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-primary" @click="addLecture">
                    <PlusIcon class="icon me-1" /> Thêm bài giảng
                  </button>
                </div>
              </div>

              <div v-for="(lecture, index) in course.lectures" :key="index" class="card mb-3">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="mb-0">Bài giảng {{ index + 1 }}</h6>
                    <div>
                      <button type="button" class="btn btn-sm btn-outline-danger d-flex align-items-center"
                        @click="removeLecture(index)">
                        <TrashIcon class="icon me-1" /> Xóa
                      </button>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label :for="`lectureTitle${index}`" class="form-label">Tiêu đề</label>
                    <input type="text" class="form-control" :id="`lectureTitle${index}`" v-model="lecture.title"
                      placeholder="Tiêu đề bài giảng" required />
                  </div>

                  <div class="mb-3">
                    <label :for="`lectureDescription${index}`" class="form-label">Mô tả</label>
                    <textarea class="form-control" :id="`lectureDescription${index}`" v-model="lecture.description"
                      rows="2" placeholder="Mô tả bài giảng"></textarea>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label :for="`lectureDuration${index}`" class="form-label">Thời lượng (phút)</label>
                      <input type="number" class="form-control" :id="`lectureDuration${index}`"
                        v-model="lecture.duration" min="1" placeholder="Thời lượng" />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label :for="`lectureType${index}`" class="form-label">Loại</label>
                      <select class="form-select" :id="`lectureType${index}`" v-model="lecture.type">
                        <option value="Video">Video</option>
                        <option value="Text">Văn bản</option>
                        <option value="Assignment">Bài tập</option>
                      </select>
                    </div>

                    <div v-if="lecture.type === 'Video'" class="mb-3">
                      <label class="form-label">Tải lên video</label>
                      <div
                        class="dropzone d-flex justify-content-center align-items-center border border-dashed rounded p-3"
                        @dragover.prevent @dragenter.prevent @dragleave.prevent @drop.prevent="onDrop($event, index)">
                        <input ref="fileInputs" type="file" accept="video/*" class="d-none"
                          @change="(e) => onVideoSelected(e, index)" />
                        <div class="text-center">
                          <UploadIcon class="icon-large mb-2" />
                          <p>
                            Kéo & thả video vào đây, hoặc
                            <span class="text-primary" @click="$refs.fileInputs[index].click()"
                              style="cursor: pointer">duyệt</span>
                          </p>
                          <small class="text-muted">MP4 hoặc MOV, tối đa 500MB</small>
                        </div>
                      </div>
                      <div v-if="lecture.videoFile" class="mt-3">
                        <video :src="lecture.preview" controls class="w-100 rounded" style="max-height: 240px"></video>
                      </div>
                    </div>

                    <div v-else class="mb-3">
                      <label :for="`lectureContent${index}`" class="form-label">Nội dung</label>
                      <textarea class="form-control" :id="`lectureContent${index}`" v-model="lecture.content" rows="4"
                        placeholder="Nhập nội dung văn bản hoặc bài tập"></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-outline-danger me-2" @click="goBack">
                  Hủy
                </button>
                <button type="submit" class="btn btn-outline-primary">
                  <SaveIcon class="icon me-1" /> Cập nhật khóa học
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white py-3">
            <h5 class="mb-0">Cài đặt khóa học</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="courseLanguage" class="form-label">Ngôn ngữ</label>
              <select class="form-select" id="courseLanguage" v-model="course.language">
                <option value="English">Tiếng Anh</option>
                <option value="Spanish">Tiếng Tây Ban Nha</option>
                <option value="French">Tiếng Pháp</option>
                <option value="German">Tiếng Đức</option>
                <option value="Chinese">Tiếng Trung</option>
                <option value="Japanese">Tiếng Nhật</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="courseDifficulty" class="form-label">Trình độ</label>
              <select class="form-select" id="courseDifficulty" v-model="course.difficulty">
                <option value="Beginner">Người mới</option>
                <option value="Intermediate">Trung cấp</option>
                <option value="Advanced">Nâng cao</option>
                <option value="All Levels">Mọi trình độ</option>
              </select>
            </div>

            <hr class="my-4" />

            <div class="mb-3">
              <label for="coursePrerequisites" class="form-label">Yêu cầu đầu vào</label>
              <textarea class="form-control" id="coursePrerequisites" v-model="course.prerequisites" rows="3"
                placeholder="Học viên cần biết gì trước khi tham gia khóa học?"></textarea>
            </div>

            <div class="mb-3">
              <label for="courseTargetAudience" class="form-label">Đối tượng học viên</label>
              <textarea class="form-control" id="courseTargetAudience" v-model="course.targetAudience" rows="3"
                placeholder="Khóa học này dành cho ai?"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="reorderModal" tabindex="-1" aria-labelledby="reorderModalLabel" aria-hidden="true"
      ref="reorderModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="reorderModalLabel">Sắp xếp bài giảng</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
          </div>
          <div class="modal-body">
            <p class="text-muted mb-3">
              Kéo thả bài giảng để thay đổi thứ tự.
            </p>
            <div class="list-group">
              <div v-for="(lecture, index) in course.lectures" :key="index"
                class="list-group-item list-group-item-action d-flex align-items-center">
                <div class="me-3 text-muted">
                  <GripVerticalIcon class="icon" />
                </div>
                <div>{{ lecture.title }}</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Hủy
            </button>
            <button type="button" class="btn btn-primary" @click="saveLectureOrder">
              Lưu thứ tự
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCourseById,
  updateCourse,
} from "@/scripts/api/services/courseService";
import {
  getLectures,
  updateLecture,
  createLecture,
  deleteLecture,
} from "@/scripts/api/services/lectureService";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import LoadingSpinner from "@/components/Common/Popup/LoadingSpinner.vue";
import SaveConfirmPopUp from "@/components/Common/Popup/SaveConfirmPopUp.vue";
import DeleteConfirmPopUp from "@/components/Common/Popup/DeleteConfirmPopup.vue";
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  SaveIcon,
  UploadIcon,
  ListOrderedIcon,
  GripVerticalIcon,
} from "lucide-vue-next";

export default {
  name: "UpdateCourse",
  components: {
    LoadingSpinner,
    SaveConfirmPopUp,
    DeleteConfirmPopUp,
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
        lectures: [],
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
        thumb: "",
      },
      lectureErrors: [],
      originalLectures: [],
      deletedLectureIds: [],
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
            title: courseData.title || "",
          },
          lectures: [],
        };
        this.previewImage = courseData.thumbUrl || "";
        const lectureResponse = await getLectures(courseId);
        const lectureList = lectureResponse?.items || [];
        this.course.lectures = lectureList.map((l) => ({
          id: l.id,
          title: l.title,
          content: l.content,
          contentSummary: l.contentSummary,
          isPreviewable: l.isPreviewable,
          medias: (l.materials || l.medias || []).map((m) => ({
            id: m.id,
            type: m.type,
            preview: m.type === 1 || m.type === 2 ? m.url : "",
            url: m.url,
            title: m.title,
            file: null,
            isDeleted: false,
          })),
          addedMedias: [],
          removedMedias: [],
          isNew: false,
        }));

        this.originalLectures = JSON.parse(
          JSON.stringify(this.course.lectures)
        );
        this.initializeLectureErrors();
      } catch (error) {
        toast.error("Không thể tải dữ liệu khóa học.");
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },
    initializeLectureErrors() {
      this.lectureErrors = Array(this.course.lectures.length)
        .fill()
        .map(() => ({
          title: "",
          content: "",
          contentSummary: "",
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
        isNew: true,
      });
      this.lectureErrors.push({
        title: "",
        content: "",
        contentSummary: "",
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
          if (this.$refs["fileInput" + lectureIndex]) {
            if (Array.isArray(this.$refs["fileInput" + lectureIndex])) {
              this.$refs["fileInput" + lectureIndex][0].value = "";
            } else {
              this.$refs["fileInput" + lectureIndex].value = "";
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
      reader.onload = (e) => (this.previewImage = e.target.result);
      reader.readAsDataURL(file);
    },
    handleLectureMediaUpload(event, lectureIndex) {
      Array.from(event.target.files).forEach((file) => {
        const type = file.type.startsWith("image")
          ? 1
          : file.type.startsWith("video")
            ? 2
            : 3;
        const reader = new FileReader();
        reader.onload = (e) => {
          const newMedia = {
            type,
            file,
            preview: type < 3 ? e.target.result : "",
            url: "",
            title: file.name,
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
        const existingLectures = this.course.lectures.filter(
          (lecture) => !lecture.isNew
        );
        const newLectures = this.course.lectures.filter(
          (lecture) => lecture.isNew
        );

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
            message: "Khóa học đã được cập nhật thành công!",
          },
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
            contentSummary: "",
          });
        }
      }

      const lec = this.course.lectures[index];
      const errors = {
        title: "",
        content: "",
        contentSummary: "",
      };

      if (!lec.title || !lec.title.trim()) {
        errors.title = `Bài giảng ${index + 1
          }: vui lòng nhập tiêu đề hoặc xóa bài giảng`;
      } else if (lec.title.trim().length < 5) {
        errors.title = `Bài giảng ${index + 1
          }: tiêu đề phải có ít nhất 5 ký tự`;
      } else if (lec.title.trim().length > 255) {
        errors.title = `Bài giảng ${index + 1}: tiêu đề phải nhỏ hơn 255 ký tự`;
      }

      if (!lec.content || !lec.content.trim()) {
        errors.content = `Bài giảng ${index + 1
          }: vui lòng nhập nội dung hoặc xóa bài giảng`;
      } else if (lec.content.trim().length < 10) {
        errors.content = `Bài giảng ${index + 1
          }: nội dung phải có ít nhất 10 ký tự`;
      } else if (lec.content.trim().length > 1000) {
        errors.content = `Bài giảng ${index + 1
          }: nội dung phải nhỏ hơn 1000 ký tự`;
      }

      if (!lec.contentSummary || !lec.contentSummary.trim()) {
        errors.contentSummary = `Bài giảng ${index + 1
          }: vui lòng nhập tóm tắt hoặc xóa bài giảng`;
      } else if (lec.contentSummary.trim().length < 5) {
        errors.contentSummary = `Bài giảng ${index + 1
          }: tóm tắt phải có ít nhất 5 ký tự`;
      } else if (lec.contentSummary.trim().length > 100) {
        errors.contentSummary = `Bài giảng ${index + 1
          }: tóm tắt phải nhỏ hơn 100 ký tự`;
      }

      this.lectureErrors[index] = errors;
      return (
        errors.title === "" &&
        errors.content === "" &&
        errors.contentSummary === ""
      );
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

      if (Object.values(this.errors).some((err) => err !== "")) {
        const firstError = Object.keys(this.errors).find(
          (key) => this.errors[key] !== ""
        );
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
    },
  },
  mounted() {
    this.fetchCourse();
  },
};
</script>

<style scoped>
.icon {
  width: 16px;
  height: 16px;
}
</style>