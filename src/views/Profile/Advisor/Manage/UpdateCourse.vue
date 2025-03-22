<template>
  <div class="container my-5">
    <div class="card shadow">
      <div class="card-header bg-primary text-white text-center py-3">
        <h1 class="h4 mb-0">
          <i class="fas fa-chalkboard-teacher me-2"></i>Update Course
        </h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="updateCourse">
          <input type="hidden" v-model="course.id" />
          <div class="mb-3">
            <label for="title" class="form-label">
              <i class="fas fa-pen-nib me-1"></i> Course Title
            </label>
            <input type="text" id="title" v-model="course.title" class="form-control" placeholder="Insert course title"
              required />
          </div>
          <div class="mb-3">
            <label for="intro" class="form-label">
              <i class="fas fa-book me-1"></i> Course Intro
            </label>
            <textarea id="intro" v-model="course.intro" class="form-control"
              placeholder="Write a short intro for the course" rows="3" required></textarea>
          </div>
          <div class="mb-3">
            <label for="description" class="form-label">
              <i class="fas fa-align-left me-1"></i> Course Description
            </label>
            <textarea id="description" v-model="course.description" class="form-control"
              placeholder="Detailed description of the course" rows="4" required></textarea>
          </div>
          <div class="mb-3">
            <label for="image" class="form-label">
              <i class="fas fa-image me-1"></i> Course Thumbnail
            </label>
            <input type="file" id="image" @change="handleImageUpload" class="form-control" accept="image/*" />
            <div v-if="previewImage" class="mt-2 text-center">
              <img :src="previewImage" alt="Course Thumbnail" class="img-thumbnail" style="max-width: 200px;" />
            </div>
          </div>
          <div class="mb-3">
            <label for="category" class="form-label">
              <i class="fas fa-folder-open me-1"></i> Course Category
            </label>
            <select id="category" v-model="course.leafCategoryId" class="form-select" required>
              <option value="" disabled>Choose a category</option>
              <option v-for="category in availableCategories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="price" class="form-label">
              <i class="fas fa-dollar-sign me-1"></i> Course Price
            </label>
            <input type="number" id="price" v-model="course.price" class="form-control"
              placeholder="Enter course price (in VND)" min="0" required />
          </div>
          <div class="mb-3">
            <label for="discount" class="form-label">
              <i class="fas fa-percent me-1"></i> Discount (%)
            </label>
            <input type="number" id="discount" v-model="course.discount" class="form-control"
              placeholder="Enter discount percentage" min="0" max="100" />
          </div>
          <div class="mb-3">
            <label for="discountExpiry" class="form-label">
              <i class="fas fa-calendar-alt me-1"></i> Discount Expiry
            </label>
            <input type="date" id="discountExpiry" v-model="course.discountExpiry" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="level" class="form-label">
              <i class="fas fa-signal me-1"></i> Course Level
            </label>
            <select id="level" v-model="course.level" class="form-select" required>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="status" class="form-label">
              <i class="fas fa-info-circle me-1"></i> Course Status
            </label>
            <select id="status" v-model="course.status" class="form-select" required>
              <option value="Draft">Draft</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="outcomes" class="form-label">
              <i class="fas fa-bullseye me-1"></i> Course Outcomes
            </label>
            <textarea id="outcomes" v-model="course.outcomes" class="form-control"
              placeholder="Expected outcomes for students" rows="3"></textarea>
          </div>
          <div class="mb-3">
            <label for="requirements" class="form-label">
              <i class="fas fa-list-ul me-1"></i> Course Requirements
            </label>
            <textarea id="requirements" v-model="course.requirements" class="form-control"
              placeholder="Requirements for students" rows="3"></textarea>
          </div>
          <div class="mb-4">
            <h2 class="h5 mb-3">
              <i class="fas fa-photo-video me-1"></i> Course Media
            </h2>
            <div class="mb-3">
              <input type="file" @change="handleMediaUpload" class="form-control" accept="image/*,video/*" multiple />
            </div>
            <div v-if="course.addedMedias.length > 0" class="row g-3">
              <div v-for="(media, index) in course.addedMedias" :key="index"
                class="col-md-4 text-center position-relative">
                <template v-if="media.type === 'image'">
                  <img :src="media.preview" alt="Media Image" class="img-fluid rounded" />
                </template>
                <template v-else-if="media.type === 'video'">
                  <video controls :src="media.preview" class="img-fluid rounded"></video>
                </template>
                <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                  @click="removeMedia(index)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-success btn-lg">
              <i class="fas fa-check me-1"></i>Update Course
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UpdateCourse",
  data() {
    return {
      course: {
        id: "1234-abcd",
        title: "Advanced Meditation",
        intro: "Deepen your meditation practice with advanced techniques.",
        description: "",
        thumb: { url: "", file: null, title: "Course Thumbnail" },
        price: 500000,
        discount: 10,
        discountExpiry: "",
        level: "Intermediate",
        status: "Ongoing",
        outcomes: "",
        requirements: "",
        leafCategoryId: "",
        addedMedias: [],
        removedMedias: [],
      },
      previewImage: null,
      availableCategories: [
        { id: "1", name: "Yoga" },
        { id: "2", name: "Mental Health" },
        { id: "3", name: "Meditation" },
      ],
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.course.thumb.file = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    handleMediaUpload(event) {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        const fileType = file.type.startsWith("image") ? "image" : "video";
        const reader = new FileReader();
        reader.onload = (e) => {
          this.course.addedMedias.push({
            type: fileType,
            file: file,
            preview: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      });
    },
    removeMedia(index) {
      this.course.addedMedias.splice(index, 1);
    },
    updateCourse() {
      if (!this.course.title) {
        return;
      }
      if (!this.course.leafCategoryId) {
        return;
      }
      if (this.course.price <= 0) {
        return;
      }
    },
  },
};
</script>

<style scoped>
body {
  font-family: "Arial", sans-serif;
  background-color: #f4f4f9;
  margin: 0;
  padding: 0;
}

.course-creation {
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

.mb-3,
.mb-4 {
  margin-bottom: 1rem !important;
}

.d-grid {
  display: grid;
}
</style>