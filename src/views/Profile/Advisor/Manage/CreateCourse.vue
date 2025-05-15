<template>
  <div class="container-fluid">
    <div class="row mb-4 p-2">
      <div class="col-12">
        <div class="d-flex align-items-center">
          <button class="btn btn-outline-secondary me-3 d-flex align-items-center" @click="goBack">
            <ArrowLeftIcon class="icon me-1" /> Quay lại
          </button>
          <h1 class="h3 mb-0">Thêm khóa học mới</h1>
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
            <form @submit.prevent="saveCourse">
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
                <label for="courseImage" class="form-label">Ảnh khóa học</label>
                <div class="input-group">
                  <input type="file" class="form-control" id="courseImage" @change="handleImageUpload"
                    accept="image/*" />
                  <label class="input-group-text d-flex align-items-center" for="courseImage">
                    <UploadIcon class="icon me-1" /> Tải lên
                  </label>
                </div>
                <small class="text-muted">Kích thước khuyến nghị: 1280x720px (16:9)</small>

                <div v-if="course.imagePreview" class="mt-3">
                  <img :src="course.imagePreview" alt="Xem trước ảnh" class="img-thumbnail" style="max-height: 200px" />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label d-block">Trạng thái</label>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="courseStatus" id="statusDraft" value="Draft"
                    v-model="course.status" />
                  <label class="form-check-label" for="statusDraft">Bản nháp</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="courseStatus" id="statusActive" value="Active"
                    v-model="course.status" />
                  <label class="form-check-label" for="statusActive">Hoạt động</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="courseStatus" id="statusInactive" value="Inactive"
                    v-model="course.status" />
                  <label class="form-check-label" for="statusInactive">Không hoạt động</label>
                </div>
              </div>

              <hr class="my-4" />

              <h5 class="mb-3">Bài giảng</h5>

              <div v-for="(lecture, index) in course.lectures" :key="index" class="card mb-3">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="mb-0">Bài giảng {{ index + 1 }}</h6>
                    <button type="button" class="btn btn-sm btn-outline-danger d-flex align-items-center"
                      @click="removeLecture(index)">
                      <TrashIcon class="icon me-1" /> Xóa
                    </button>
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
                        <option value="Quiz">Trắc nghiệm</option>
                        <option value="Assignment">Bài tập</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" class="btn btn-outline-primary mb-4 d-flex align-items-center" @click="addLecture">
                <PlusIcon class="icon me-1" /> Thêm bài giảng
              </button>

              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-outline-danger me-2 d-flex align-items-center"
                  @click="goBack">Hủy</button>
                <button type="submit" class="btn btn-outline-primary d-flex align-items-center">
                  <SaveIcon class="icon me-1" /> Lưu khóa học
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
                <option value="Beginner">Người mới bắt đầu</option>
                <option value="Intermediate">Trung cấp</option>
                <option value="Advanced">Nâng cao</option>
                <option value="All Levels">Mọi trình độ</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Tính năng khóa học</label>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="hasCertificate" v-model="course.hasCertificate" />
                <label class="form-check-label" for="hasCertificate">
                  Chứng chỉ hoàn thành
                </label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="hasDownloadable" v-model="course.hasDownloadable" />
                <label class="form-check-label" for="hasDownloadable">
                  Tài nguyên có thể tải về
                </label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="hasAssignments" v-model="course.hasAssignments" />
                <label class="form-check-label" for="hasAssignments">
                  Bài tập
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="hasForumSupport" v-model="course.hasForumSupport" />
                <label class="form-check-label" for="hasForumSupport">
                  Hỗ trợ diễn đàn
                </label>
              </div>
            </div>

            <hr class="my-4" />

            <div class="mb-3">
              <label for="coursePrerequisites" class="form-label">Yêu cầu trước khi học</label>
              <textarea class="form-control" id="coursePrerequisites" v-model="course.prerequisites" rows="3"
                placeholder="Học viên cần biết gì trước khi tham gia khóa học?"></textarea>
            </div>

            <div class="mb-3">
              <label for="courseTargetAudience" class="form-label">Đối tượng học</label>
              <textarea class="form-control" id="courseTargetAudience" v-model="course.targetAudience" rows="3"
                placeholder="Khóa học này dành cho ai?"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SaveConfirmPopUp from '../../../../components/Common/Popup/SaveConfirmPopUp.vue';
import { createCourse } from '@/scripts/api/services/courseService';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import LoadingSpinner from '@/components/Common/Popup/LoadingSpinner.vue';
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  SaveIcon,
  UploadIcon,
} from "lucide-vue-next";

export default {
  name: "CreateCourse",
  components: {
    SaveConfirmPopUp,
    LoadingSpinner
  },
  data() {
    return {
      course: {
        title: "",
        intro: "",
        description: "",
        price: 0,
        level: "",
        outcomes: "",
        requirements: "",
        thumb: { url: "", file: null, title: "" },
        leafCategoryId: "4b35a4fc-ab0c-4f7b-874f-d8e60ad33bac",
        lectures: []
      },
      previewImage: null,
      showSavePopup: false
    };
  },
  methods: {
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
    addLecture() {
      this.course.lectures.push({
        title: "",
        content: "",
        contentSummary: "",
        isPreviewable: false,
        medias: []
      });

      toast.info("Vui lòng điền đầy đủ thông tin và tải lên tài liệu cho bài giảng mới", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT
      });
    },
    removeLecture(index) {
      this.course.lectures.splice(index, 1);
    },
    removeLectureMedia(lectureIndex, mediaIndex) {
      this.course.lectures[lectureIndex].medias.splice(mediaIndex, 1);

      if (this.course.lectures[lectureIndex].medias.length === 0) {
        toast.warning(`Bài giảng ${lectureIndex + 1}: Vui lòng tải lên ít nhất một tài liệu`, {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        });
      }
    },
    openSavePopup() {
      this.showSavePopup = true;
    },

    validateForm() {
      // Validate title
      if (!this.course.title.trim()) {
        toast.error("Vui lòng nhập tiêu đề khóa học");
        return false;
      }

      // Validate intro
      if (!this.course.intro.trim()) {
        toast.error("Vui lòng nhập giới thiệu khóa học");
        return false;
      }

      // Validate description
      if (!this.course.description.trim()) {
        toast.error("Vui lòng nhập mô tả chi tiết khóa học");
        return false;
      }

      // Validate thumbnail
      if (!this.course.thumb.file && !this.course.thumb.url) {
        toast.error("Vui lòng chọn hình ảnh cho khóa học");
        return false;
      }

      // Validate price
      if (!this.course.price || this.course.price < 10000) {
        toast.error("Giá khóa học phải từ 10,000 VND trở lên");
        return false;
      }

      // Validate level
      if (!this.course.level) {
        toast.error("Vui lòng chọn cấp độ khóa học");
        return false;
      }

      // Validate outcomes
      if (!this.course.outcomes.trim()) {
        toast.error("Vui lòng nhập kết quả học tập mong đợi");
        return false;
      }

      // Validate requirements
      if (!this.course.requirements.trim()) {
        toast.error("Vui lòng nhập yêu cầu tiên quyết của khóa học");
        return false;
      }

      // Validate lectures
      if (this.course.lectures.length > 0) {
        for (let i = 0; i < this.course.lectures.length; i++) {
          const lecture = this.course.lectures[i];

          // Validate lecture title
          if (!lecture.title || !lecture.title.trim()) {
            toast.error(`Bài giảng ${i + 1}: Vui lòng nhập tiêu đề bài giảng`);
            return false;
          }

          // Validate lecture content
          if (!lecture.content || !lecture.content.trim()) {
            toast.error(`Bài giảng ${i + 1}: Vui lòng nhập nội dung bài giảng`);
            return false;
          }

          // Validate lecture content summary
          if (!lecture.contentSummary || !lecture.contentSummary.trim()) {
            toast.error(`Bài giảng ${i + 1}: Vui lòng nhập tóm tắt nội dung bài giảng`);
            return false;
          }

          // Validate lecture materials
          if (!lecture.medias || lecture.medias.length === 0) {
            toast.error(`Bài giảng ${i + 1}: Vui lòng tải lên ít nhất một tài liệu cho bài giảng`);
            return false;
          }

          // Kiểm tra độ dài tối thiểu cho các trường
          if (lecture.title.trim().length < 5) {
            toast.error(`Bài giảng ${i + 1}: Tiêu đề phải có ít nhất 5 ký tự`);
            return false;
          }

          if (lecture.content.trim().length < 20) {
            toast.error(`Bài giảng ${i + 1}: Nội dung phải có ít nhất 20 ký tự`);
            return false;
          }

          if (lecture.contentSummary.trim().length < 10) {
            toast.error(`Bài giảng ${i + 1}: Tóm tắt nội dung phải có ít nhất 10 ký tự`);
            return false;
          }
        }
      }

      return true;
    },

    async handleSave(confirm) {
      if (!confirm) return;

      if (!this.validateForm()) {
        return;
      }

      this.$refs.loadingSpinner.showSpinner();

      try {
        const formData = new FormData();

        formData.append('Title', this.course.title);
        formData.append('Intro', this.course.intro);
        formData.append('Description', this.course.description);
        formData.append('Price', this.course.price);
        formData.append('Level', this.course.level);
        formData.append('Outcomes', this.course.outcomes);
        formData.append('Requirements', this.course.requirements);
        formData.append('LeafCategoryId', this.course.leafCategoryId);

        // Thumb
        if (this.course.thumb.file) {
          formData.append('Thumb.File', this.course.thumb.file, this.course.thumb.title);
          formData.append('Thumb.Title', this.course.thumb.title || 'thumbnail');
        }

        if (this.course.thumb.url) {
          formData.append('Thumb.Url', this.course.thumb.url);
        }

        // Lectures
        this.course.lectures.forEach((lecture, index) => {
          formData.append(`Lectures[${index}].Title`, lecture.title);
          formData.append(`Lectures[${index}].Content`, lecture.content);
          formData.append(`Lectures[${index}].ContentSummary`, lecture.contentSummary);
          formData.append(`Lectures[${index}].IsPreviewable`, lecture.isPreviewable.toString());

          lecture.medias.forEach((media, mediaIndex) => {
            formData.append(`Lectures[${index}].Medias[${mediaIndex}].File`, media.file);
            formData.append(`Lectures[${index}].Medias[${mediaIndex}].Title`, media.title);
          });
        });

        const response = await createCourse(formData);
        console.log('Course created successfully:', response);

        toast.success("Tạo khóa học thành công!", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        });

        // Chuyển hướng về trang advisor/content
        this.$router.push({
          path: '/advisor/content',
          query: {
            createSuccess: true,
            message: 'Tạo khóa học thành công!'
          }
        });

      } catch (error) {
        console.error('Failed to create course:', error);
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo khóa học. Vui lòng thử lại!", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        });
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },

    resetForm() {
      this.course = {
        title: "",
        intro: "",
        description: "",
        price: 0,
        level: "",
        outcomes: "",
        requirements: "",
        thumb: { url: "", file: null, title: "" },
        leafCategoryId: "",
        lectures: []
      };
      this.previewImage = null;
    }
  }
};
</script>

<style scoped>
.icon {
  width: 16px;
  height: 16px;
}
</style>