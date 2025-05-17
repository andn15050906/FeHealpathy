<template>
  <div class="create-course-container">
    <div class="header-section py-2">
      <div class="container-fluid">
        <div class="row p-2">
          <div class="col-12">
            <div class="d-flex align-items-center">
              <button class="btn btn-outline-secondary me-3 d-flex align-items-center" @click="goBack">
                <ArrowLeftIcon class="icon me-1" /> Quay lại
              </button>
              <h1 class="h3 mb-0">Cập nhật khóa học</h1>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="container-fluid">
        <div class="row g-4 mb-2">
          <div class="col-lg-8">
            <div class="card shadow-sm h-100">
              <div class="card-header bg-white py-3 border-bottom">
                <h5 class="mb-0 fw-bold">Thông tin khóa học</h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="updateCourse">
                  <div class="mb-4">
                    <label for="courseName" class="form-label fw-medium">Tên khóa học</label>
                    <input type="text" class="form-control form-control-lg" id="courseName" v-model="course.title"
                      placeholder="Nhập tên khóa học" required />
                  </div>

                  <div class="row mb-4">
                    <div class="col-md-6">
                      <label for="courseCategory" class="form-label fw-medium">Danh mục</label>
                      <select class="form-select" id="courseCategory" v-model="course.leafCategoryId" required>
                        <option value="" disabled>Chọn danh mục</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                          {{ category.name }}
                        </option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label for="coursePrice" class="form-label fw-medium">Giá ($)</label>
                      <input type="number" class="form-control" id="coursePrice" v-model="course.price" min="0" step="0.01"
                        placeholder="0.00" required />
                    </div>
                  </div>

                  <div class="row mb-4">
                    <div class="col-md-6">
                      <label for="courseDiscount" class="form-label fw-medium">Giảm giá (%)</label>
                      <input type="number" class="form-control" id="courseDiscount" v-model="course.discount" min="0" max="100"
                        placeholder="0-100%" />
                    </div>
                    <div class="col-md-6">
                      <label for="discountExpiry" class="form-label fw-medium">Ngày hết hạn giảm giá</label>
                      <input type="date" class="form-control" id="discountExpiry" v-model="course.discountExpiry" />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="courseDescription" class="form-label fw-medium">Mô tả</label>
                    <textarea class="form-control" id="courseDescription" v-model="course.description" rows="4"
                      placeholder="Mô tả khóa học" required></textarea>
                  </div>

                  <div class="mb-4">
                    <label for="courseImage" class="form-label fw-medium">Hình ảnh khóa học</label>
                    <div class="d-flex align-items-center mb-2" v-if="course.thumb.url">
                      <img :src="course.thumb.url" alt="Hình thu nhỏ khóa học" class="img-thumbnail me-3"
                        style="max-height: 100px" />
                      <div>Hình hiện tại</div>
                    </div>
                    <div class="input-group mb-2">
                      <input type="file" class="form-control" id="courseImage" @change="handleImageUpload"
                        accept="image/*" />
                      <label class="input-group-text d-flex align-items-center" for="courseImage">
                        <UploadIcon class="icon me-1" /> Tải lên mới
                      </label>
                    </div>
                    <small class="text-muted">Kích thước khuyến nghị: 1280x720px (16:9)</small>

                    <div v-if="previewImage" class="mt-3 border p-2 rounded">
                      <img :src="previewImage" alt="Xem trước hình ảnh" class="img-thumbnail"
                        style="max-height: 200px" />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-medium d-block">Trạng thái</label>
                    <div class="d-flex flex-wrap gap-3">
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="courseStatus" id="statusDraft" :value="0"
                          v-model="course.status" />
                        <label class="form-check-label" for="statusDraft">Nháp</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="courseStatus" id="statusActive" :value="1"
                          v-model="course.status" />
                        <label class="form-check-label" for="statusActive">Đang hoạt động</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="courseStatus" id="statusInactive" :value="2"
                          v-model="course.status" />
                        <label class="form-check-label" for="statusInactive">Ngừng hoạt động</label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="card shadow-sm h-100">
              <div class="card-header bg-white py-3 border-bottom">
                <h5 class="mb-0 fw-bold">Cài đặt khóa học</h5>
              </div>
              <div class="card-body">
                <div class="mb-4">
                  <label for="courseDifficulty" class="form-label fw-medium">Trình độ</label>
                  <select class="form-select" id="courseDifficulty" v-model="course.level">
                    <option value="Beginner">Người mới</option>
                    <option value="Intermediate">Trung cấp</option>
                    <option value="Advanced">Nâng cao</option>
                    <option value="All Levels">Mọi trình độ</option>
                  </select>
                </div>

                <hr class="my-4" />

                <div class="mb-4">
                  <label for="coursePrerequisites" class="form-label fw-medium">Yêu cầu đầu vào</label>
                  <textarea class="form-control" id="coursePrerequisites" v-model="course.requirements" rows="6"
                    placeholder="Học viên cần biết gì trước khi tham gia khóa học?"></textarea>
                </div>

                <div class="mb-4">
                  <label for="courseTargetAudience" class="form-label fw-medium">Đối tượng học viên</label>
                  <textarea class="form-control" id="courseTargetAudience" v-model="course.outcomes" rows="6"
                    placeholder="Khóa học này dành cho ai?"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-12">
            <div class="card shadow-sm">
              <div class="card-header bg-white py-3 border-bottom">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="mb-0 fw-bold">Bài giảng</h5>
                  <div class="d-flex">
                    <button type="button" class="btn btn-primary d-flex align-items-center" @click="addLecture">
                      <PlusIcon class="icon me-1" /> Thêm bài giảng
                    </button>
                  </div>
                </div>
              </div>
              <div class="card-body p-0">
                <div class="lecture-tabs">
                  <ul class="nav nav-tabs px-3 pt-3" role="tablist">
                    <li class="nav-item" v-for="(lecture, index) in course.lectures" :key="index">
                      <button class="nav-link" :class="{ active: activeTab === index }" @click="activeTab = index"
                        role="tab">
                        <span class="lecture-number">Bài {{ index + 1 }}</span>
                        <button type="button" class="btn-close ms-2" style="font-size: 0.5rem;"
                          @click.stop="removeLecture(index)" v-if="course.lectures.length > 1"></button>
                      </button>
                    </li>
                  </ul>

                  <div class="tab-content p-4 border border-top-0 rounded-bottom">
                    <div v-for="(lecture, index) in course.lectures" :key="index" class="tab-pane"
                      :class="{ active: activeTab === index }" role="tabpanel">
                      <div class="lecture-form">
                        <div class="row g-4">
                          <div class="col-md-8">
                            <div class="mb-4">
                              <label :for="`lectureTitle${index}`" class="form-label fw-medium">Tiêu đề bài giảng</label>
                              <input type="text" class="form-control form-control-lg" :id="`lectureTitle${index}`"
                                v-model="lecture.title" placeholder="Nhập tiêu đề bài giảng" required />
                            </div>

                            <div class="mb-4">
                              <label :for="`lectureContentSummary${index}`" class="form-label fw-medium">Tóm tắt nội dung</label>
                              <textarea class="form-control" :id="`lectureContentSummary${index}`"
                                v-model="lecture.contentSummary" rows="3"
                                placeholder="Tóm tắt ngắn gọn nội dung bài giảng" required></textarea>
                            </div>

                            <div class="lecture-type-content mt-4">
                              <div v-if="lecture.type === 'Video'" class="resource-upload">
                                <h6 class="mb-3 fw-medium">Tài nguyên</h6>
                                <div class="upload-area p-4 border rounded border-dashed mb-3 text-center"
                                  @dragover.prevent @dragenter.prevent @dragleave.prevent @drop.prevent="onDrop($event, index)">
                                  <div class="mb-3">
                                    <UploadIcon class="icon-large mb-2" style="width: 48px; height: 48px;" />
                                  </div>
                                  <p class="mb-3">
                                    Kéo & thả video vào đây, hoặc
                                    <span class="text-primary" @click="$refs.fileInputs && $refs.fileInputs[index] && $refs.fileInputs[index].click()"
                                      style="cursor: pointer">duyệt</span>
                                  </p>
                                  <input ref="fileInputs" type="file" accept="video/*" class="d-none"
                                    @change="(e) => onVideoSelected(e, index)" />
                                  <small class="text-muted">MP4 hoặc MOV, tối đa 500MB</small>
                                </div>
                                
                                <div v-if="lecture.medias && lecture.medias.length > 0" class="mt-3">
                                  <h6 class="mb-3 fw-medium">Tài nguyên hiện tại</h6>
                                  <div v-for="(media, mediaIndex) in lecture.medias" :key="mediaIndex" class="mb-3 p-2 border rounded">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                      <span class="fw-medium">{{ media.title }}</span>
                                      <button type="button" class="btn btn-sm btn-outline-danger" 
                                        @click="removeLectureMedia(index, mediaIndex)">
                                        <TrashIcon class="icon" />
                                      </button>
                                    </div>
                                    <video v-if="media.type === 2" :src="media.url" controls class="w-100 rounded" style="max-height: 200px"></video>
                                    <img v-else-if="media.type === 1" :src="media.url" class="img-thumbnail" style="max-height: 200px" />
                                    <div v-else class="p-2 bg-light rounded">
                                      <a :href="media.url" target="_blank" class="text-decoration-none">
                                        Xem tài liệu
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                
                                <div v-if="lecture.videoFile" class="mt-3">
                                  <h6 class="mb-3 fw-medium">Video mới</h6>
                                  <video :src="lecture.preview" controls class="w-100 rounded" style="max-height: 240px"></video>
                                </div>
                              </div>

                              <div v-else class="text-content">
                                <h6 class="mb-3 fw-medium">Nội dung chi tiết</h6>
                                <textarea class="form-control" :id="`lectureContent${index}`" v-model="lecture.content" rows="12"
                                  placeholder="Nhập nội dung chi tiết của bài giảng"></textarea>
                              </div>
                            </div>
                          </div>

                          <div class="col-md-4">
                            <div class="lecture-settings p-3 border rounded h-100">
                              <h6 class="mb-4 fw-medium border-bottom pb-2">Cài đặt bài giảng</h6>

                              <div class="mb-3">
                                <label :for="`lectureType${index}`" class="form-label fw-medium">Loại bài giảng</label>
                                <select class="form-select" :id="`lectureType${index}`" v-model="lecture.type">
                                  <option value="Video">Video</option>
                                  <option value="Text">Văn bản</option>
                                  <option value="Assignment">Bài tập</option>
                                </select>
                              </div>

                              <div class="mb-3">
                                <label :for="`lectureDuration${index}`" class="form-label fw-medium">Thời lượng (phút)</label>
                                <input type="number" class="form-control" :id="`lectureDuration${index}`"
                                  v-model="lecture.duration" min="1" placeholder="Nhập thời lượng" />
                              </div>

                              <div class="form-check form-switch mt-4">
                                <input class="form-check-input" type="checkbox" :id="`lecturePreview${index}`"
                                  v-model="lecture.isPreviewable">
                                <label class="form-check-label" :for="`lecturePreview${index}`">
                                  Xem trước miễn phí
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="d-flex justify-content-end gap-3 py-4">
              <button type="button" class="btn btn-outline-danger d-flex align-items-center px-4" @click="goBack">
                <TrashIcon class="icon me-1" /> Hủy
              </button>
              <button type="button" class="btn btn-primary d-flex align-items-center px-4" @click="openSavePopup">
                <SaveIcon class="icon me-1" /> Cập nhật khóa học
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <LoadingSpinner ref="loadingSpinner" />
    <SaveConfirmPopUp 
      v-if="showSavePopup" 
      @close="showSavePopup = false" 
      @confirm="handleSave" 
      title="Xác nhận cập nhật"
      message="Bạn có chắc chắn muốn cập nhật khóa học này không?"
    />
    <DeleteConfirmPopUp 
      v-if="showDeletePopup" 
      @close="showDeletePopup = false" 
      @confirm="handleDelete" 
      title="Xác nhận xóa"
      message="Bạn có chắc chắn muốn xóa bài giảng này không?"
    />
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
    ArrowLeftIcon,
    PlusIcon,
    TrashIcon,
    SaveIcon,
    UploadIcon,
    ListOrderedIcon,
    GripVerticalIcon
  },
  data() {
    return {
      course: {
        id: "",
        title: "",
        intro: "",
        description: "",
        thumb: { 
          url: "", 
          file: null, 
          title: "" 
        },
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
      categories: [
        { id: "4b35a4fc-ab0c-4f7b-874f-d8e60ad33bac", name: "Student" },
        { id: "5c46b5fd-bc1d-5e8c-985f-e9f71be45cbd", name: "College" },
        { id: "6d57c6ge-cd2e-6f9d-096g-f0g82cf56dce", name: "Working" }
      ],
      previewImage: null,
      showSavePopup: false,
      showDeletePopup: false,
      lectureToDeleteIndex: null,
      activeTab: 0,
      deletedLectureIds: [],
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
      lectureErrors: []
    };
  },
  methods: {
    async fetchCourse() {
      const courseId = this.$route.params.id;
      try {
        this.$refs.loadingSpinner.showSpinner();
        
        const courseData = await getCourseById(courseId);
        if (courseData.discount) {
          courseData.discount *= 100;
        }
        if (courseData.discountExpiry) {
          const expiryDate = new Date(courseData.discountExpiry);
          courseData.discountExpiry = expiryDate.toISOString().split("T")[0];
        }
        this.course = {
          id: courseData.id,
          title: courseData.title || "",
          intro: courseData.intro || "",
          description: courseData.description || "",
          thumb: {
            url: courseData.thumbUrl || "",
            file: null,
            title: courseData.title || ""
          },
          leafCategoryId: courseData.leafCategoryId || "",
          status: courseData.status !== undefined ? courseData.status : 0,
          price: courseData.price || 0,
          level: courseData.level || "Beginner",
          outcomes: courseData.outcomes || "",
          requirements: courseData.requirements || "",
          discount: courseData.discount || 0,
          discountExpiry: courseData.discountExpiry || "",
          lectures: []
        };
        
        this.previewImage = courseData.thumbUrl || "";
        
        const lectureResponse = await getLectures(courseId);
        const lectureList = lectureResponse?.items || [];
        this.course.lectures = lectureList.map((lecture) => ({
          id: lecture.id,
          title: lecture.title || "",
          content: lecture.content || "",
          contentSummary: lecture.contentSummary || "",
          isPreviewable: lecture.isPreviewable || false,
          type: this.determineLectureType(lecture),
          duration: lecture.duration || 0,
          videoFile: null,
          preview: "",
          medias: (lecture.materials || lecture.medias || []).map((media) => ({
            id: media.id,
            type: media.type,
            preview: media.type === 1 || media.type === 2 ? media.url : "",
            url: media.url || "",
            title: media.title || "",
            file: null,
            isDeleted: false
          })),
          addedMedias: [],
          removedMedias: []
        }));
        
        this.initializeLectureErrors();
        if (this.course.lectures.length === 0) {
          this.addLecture();
        }
        
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Không thể tải dữ liệu khóa học.");
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },
    
    determineLectureType(lecture) {
      // Determine lecture type based on media content
      if (lecture.medias && lecture.medias.some(m => m.type === 2)) {
        return "Video";
      } else if (lecture.content && lecture.content.trim().length > 0) {
        return "Text";
      } else {
        return "Assignment";
      }
    },
    
    initializeLectureErrors() {
      this.lectureErrors = Array(this.course.lectures.length)
        .fill()
        .map(() => ({
          title: "",
          content: "",
          contentSummary: ""
        }));
    },
    
    addLecture() {
      this.course.lectures.push({
        id: null,
        title: "",
        content: "",
        contentSummary: "",
        isPreviewable: false,
        type: "Video",
        duration: 0,
        videoFile: null,
        preview: "",
        medias: [],
        addedMedias: [],
        removedMedias: []
      });
      
      this.lectureErrors.push({
        title: "",
        content: "",
        contentSummary: ""
      });
      
      this.$nextTick(() => {
        this.activeTab = this.course.lectures.length - 1;
      });
    },
    
    removeLecture(index) {
      this.lectureToDeleteIndex = index;
      this.showDeletePopup = true;
    },
    
    handleDelete(confirm) {
      if (!confirm || this.lectureToDeleteIndex === null) return;
      
      const index = this.lectureToDeleteIndex;
      const lecture = this.course.lectures[index];
      
      if (lecture.id) {
        this.deletedLectureIds.push(lecture.id);
      }
      
      this.course.lectures.splice(index, 1);
      this.lectureErrors.splice(index, 1);
      
      if (this.course.lectures.length === 0) {
        this.addLecture();
        this.activeTab = 0;
      } else if (index === this.activeTab) {
        this.activeTab = Math.max(0, index - 1);
      } else if (index < this.activeTab) {
        this.activeTab--;
      }
      
      this.lectureToDeleteIndex = null;
    },
    
    removeLectureMedia(lectureIndex, mediaIndex) {
      const media = this.course.lectures[lectureIndex].medias[mediaIndex];
      if (media.id) {
        this.course.lectures[lectureIndex].removedMedias.push(media.id);
      }
      this.course.lectures[lectureIndex].medias.splice(mediaIndex, 1);
    },
    
    handleImageUpload(event) {
      const file = event.target.files[0];
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
    
    onDrop(event, index) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.onVideoSelected({ target: { files } }, index);
      }
    },
    
    onVideoSelected(event, index) {
      const file = event.target.files[0];
      if (!file) return;
      
      if (!file.type.startsWith("video/")) {
        toast.error("Vui lòng chọn file video.");
        return;
      }
      
      const lecture = this.course.lectures[index];
      lecture.videoFile = file;
      const newMedia = {
        type: 2,
        file: file,
        title: file.name,
        url: ""
      };
      
      lecture.addedMedias.push(newMedia);
      const reader = new FileReader();
      reader.onload = (e) => {
        lecture.preview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    openSavePopup() {
      if (this.validateForm()) {
        this.showSavePopup = true;
      }
    },
    
    validateForm() {
      this.validateTitle();
      this.validateIntro();
      this.validateDescription();
      this.validatePrice();
      this.validateLevel();
      this.validateOutcomes();
      this.validateRequirements();
      
      if (Object.values(this.errors).some(err => err !== "")) {
        const firstError = Object.keys(this.errors).find(key => this.errors[key] !== "");
        toast.error(`Vui lòng sửa lỗi: ${this.errors[firstError]}`);
        return false;
      }
      
      const lecturesValid = this.validateAllLectures();
      if (!lecturesValid) {
        for (let i = 0; i < this.lectureErrors.length; i++) {
          const err = this.lectureErrors[i];
          if (err.title || err.content || err.contentSummary) {
            toast.error(`Lỗi bài giảng ${i + 1}: ${err.title || err.content || err.contentSummary}`);
            return false;
          }
        }
      }
      
      return true;
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
      if (this.course.price < 0) {
        this.errors.price = "Giá khóa học không thể âm";
      } else {
        this.errors.price = "";
      }
    },
    
    validateLevel() {
      if (!this.course.level) {
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
    
    validateLecture(index) {
      const lecture = this.course.lectures[index];
      const errors = {
        title: "",
        content: "",
        contentSummary: ""
      };
      if (!lecture.title.trim()) {
        errors.title = `Bài giảng ${index + 1}: vui lòng nhập tiêu đề`;
      } else if (lecture.title.trim().length < 5) {
        errors.title = `Bài giảng ${index + 1}: tiêu đề phải có ít nhất 5 ký tự`;
      }
      if (!lecture.contentSummary.trim()) {
        errors.contentSummary = `Bài giảng ${index + 1}: vui lòng nhập tóm tắt nội dung`;
      }
      if (lecture.type === "Text" && !lecture.content.trim()) {
        errors.content = `Bài giảng ${index + 1}: vui lòng nhập nội dung chi tiết`;
      }
      this.lectureErrors[index] = errors;
      return !errors.title && !errors.content && !errors.contentSummary;
    },
    
    validateAllLectures() {
      let allValid = true;
      for (let i = 0; i < this.course.lectures.length; i++) {
        if (!this.validateLecture(i)) {
          allValid = false;
        }
      }
      return allValid;
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
        const existingLectures = this.course.lectures.filter(lecture => lecture.id);
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
          
          lecture.addedMedias.forEach((media, index) => {
            if (media.file) {
              formData.append(`AddedMedias[${index}].File`, media.file);
              formData.append(`AddedMedias[${index}].Title`, media.title);
              formData.append(`AddedMedias[${index}].Type`, media.type);
            }
          });
          
          await updateLecture(formData);
        }
        
        const newLectures = this.course.lectures.filter(lecture => !lecture.id);
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
        
        toast.success("Khóa học đã được cập nhật thành công!", { autoClose: 3000 });
        
        this.$router.push({
          path: "/advisor/content",
          query: {
            updateSuccess: true,
            message: "Khóa học đã được cập nhật thành công!",
          },
        });
      } catch (error) {
        console.error("Error updating course:", error);
        toast.error("Đã xảy ra lỗi khi cập nhật khóa học.");
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },
    
    goBack() {
      this.$router.back();
    }
  },
  mounted() {
    this.fetchCourse();
  }
};
</script>

<style scoped>
.create-course-container {
  display: flex;
  flex-direction: column;
  width: 72vw;
  margin: 0 auto;
}

.header-section {
  position: sticky;
  top: 0;
  z-index: 100;
}

.main-content {
  flex: 1;
}

.card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 1.5rem;
}

.card-header {
  border-bottom: 1px solid #e8e8e8;
  background: #fff;
  padding: 1rem;
}

.card-header h5 {
  font-weight: 600;
  margin: 0;
  color: #333;
}

.card-body {
  padding: 1.5rem;
}

.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  transition: border-color 0.2s;
}

.form-control:focus,
.form-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-outline-secondary {
  border: 1px solid #3b82f6;
  color: #3b82f6;
}

.btn-outline-secondary:hover {
  background: #3b82f6;
  color: #fff;
}

.btn-primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.btn-primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-outline-danger {
  border: 1px solid #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background: #dc3545;
  color: #fff;
}

.input-group-text {
  background: #3b82f6;
  color: #fff;
  border: none;
  cursor: pointer;
}

.form-check-input {
  width: 1em;
  height: 1em;
  margin-top: 0.15em;
  border: 1px solid #ddd;
}

.form-check-input:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.img-thumbnail {
  border-radius: 4px;
  border: 1px solid #ddd;
}

hr {
  border: none;
  height: 1px;
  background: #e8e8e8;
  margin: 1.5rem 0;
}

.nav-tabs {
  border-bottom: 1px solid #e8e8e8;
  padding: 0.5rem 0.5rem 0;
}

.nav-tabs .nav-link {
  border: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px 4px 0 0;
  margin-right: 0.25rem;
}

.nav-tabs .nav-link:hover {
  background-color: #f5f5f5;
}

.nav-tabs .nav-link.active {
  background-color: #3b82f6;
  color: white;
}

.tab-content {
  background: #fff;
  padding: 1rem;
  border: 1px solid #e8e8e8;
  border-top: none;
}

.tab-pane {
  display: none;
}

.tab-pane.active {
  display: block;
}

.lecture-settings {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 1rem;
}

.upload-area {
  border: 1px dashed #3b82f6;
  border-radius: 4px;
  padding: 1rem;
  cursor: pointer;
}

.icon {
  width: 16px;
  height: 16px;
}

.icon-large {
  width: 32px;
  height: 32px;
}

.border-dashed {
  border-style: dashed !important;
}
</style>