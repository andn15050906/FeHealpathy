<template>
  <div class="course-creation">
    <h1 class="title">✨ Update Course ✨</h1>
    <form @submit.prevent="updateCourse" class="course-form">
      <input type="hidden" v-model="course.id" />

      <div class="form-group">
        <label for="title">🖋️ Course Title</label>
        <input
          type="text"
          id="title"
          v-model="course.title"
          placeholder="Insert course title"
        />
      </div>

      <div class="form-group">
        <label for="intro">📘 Course Intro</label>
        <textarea
          id="intro"
          v-model="course.intro"
          placeholder="Write a short intro for the course"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="description">📝 Course Description</label>
        <textarea
          id="description"
          v-model="course.description"
          placeholder="Detailed description of the course"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="image">🖼️ Course Thumbnail</label>
        <input
          type="file"
          id="image"
          @change="handleImageUpload"
          accept="image/*"
        />
        <div v-if="previewImage" class="image-preview">
          <img :src="previewImage" alt="Course Thumbnail" />
        </div>
      </div>

      <div class="form-group">
        <label for="category">📂 Course Category</label>
        <select
          id="category"
          v-model="course.leafCategoryId"
          class="category-select"
        >
          <option value="" disabled>Choose a category</option>
          <option
            v-for="category in availableCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="price">💰 Course Price</label>
        <input
          type="number"
          id="price"
          v-model="course.price"
          placeholder="Enter course price (in VND)"
          min="0"
        />
      </div>

      <div class="form-group">
        <label for="discount">💵 Discount (%)</label>
        <input
          type="number"
          id="discount"
          v-model="course.discount"
          placeholder="Enter discount percentage"
          min="0"
          max="100"
        />
      </div>

      <div class="form-group">
        <label for="discountExpiry">📅 Discount Expiry</label>
        <input
          type="date"
          id="discountExpiry"
          v-model="course.discountExpiry"
        />
      </div>

      <div class="form-group">
        <label for="level">📊 Course Level</label>
        <select id="level" v-model="course.level">
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div class="form-group">
        <label for="status">📢 Course Status</label>
        <select id="status" v-model="course.status">
          <option value="Draft">Draft</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div class="form-group">
        <label for="outcomes">🎯 Course Outcomes</label>
        <textarea
          id="outcomes"
          v-model="course.outcomes"
          placeholder="Expected outcomes for students"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="requirements">📌 Course Requirements</label>
        <textarea
          id="requirements"
          v-model="course.requirements"
          placeholder="Requirements for students"
          rows="3"
        ></textarea>
      </div>

      <div class="sections">
        <h2>📚 Course Media</h2>
        <div class="form-group">
          <input
            type="file"
            @change="handleMediaUpload"
            accept="image/*,video/*"
            multiple
          />
        </div>
        <div v-if="course.addedMedias.length > 0" class="media-preview">
          <div
            v-for="(media, index) in course.addedMedias"
            :key="index"
            class="single-media"
          >
            <template v-if="media.type === 'image'">
              <img :src="media.preview" alt="Media Image" />
            </template>
            <template v-else-if="media.type === 'video'">
              <video controls :src="media.preview" width="100%"></video>
            </template>
            <button type="button" class="btn remove" @click="removeMedia(index)"
              >❌ Remove</button
            >
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn submit">✅ Update Course</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "UpdateCourse",
  data() {
    return {
      course: {
        id: "1234-abcd", // Hardcoded ID, should be replaced when integrated with API
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
        alert("Vui lòng nhập tiêu đề course!");
        return;
      }
      if (!this.course.category) {
        alert("Vui lòng chọn danh mục cho course!");
        return;
      }
      if (this.course.price <= 0) {
        alert("Please insert price correctly!");
        return;
      }
      alert("Course Updated Successfully!");
    },

    // handleResourceUpload(event, sectionIndex) {
    //     const files = Array.from(event.target.files);
    //     files.forEach((file) => {
    //       const fileType = file.type.startsWith("image") ? "image" : "video";
    //       const reader = new FileReader();
    //       reader.onload = (e) => {
    //         this.course.sections[sectionIndex].resources.push({
    //           type: fileType,
    //           file: file,
    //           preview: e.target.result,
    //         });
    //       };
    //       reader.readAsDataURL(file);
    //     });
    //   },
    //   removeResource(sectionIndex, resourceIndex) {
    //     this.course.sections[sectionIndex].resources.splice(resourceIndex, 1);
    //   },
    //   handleImageUpload(event) {
    //     const file = event.target.files[0];
    //     if (file) {
    //       this.course.image = file;
    //       const reader = new FileReader();
    //       reader.onload = (e) => {
    //         this.previewImage = e.target.result;
    //       };
    //       reader.readAsDataURL(file);
    //     }
    //   },
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
.resource-preview img {
  width: 100%;
  max-width: 200px;
  border-radius: 10px;
  margin-top: 10px;
}

.resource-preview video {
  border-radius: 10px;
  margin-top: 10px;
  max-width: 200px;
}
.single-resource img,
.single-resource video {
  width: 100%;
  border-radius: 10px;
}
.single-resource .btn.remove {
  top: 5px;
  right: 5px;
  background: #ff6868;
  color: white;
  transform: scale(0.7);
  margin-left: 30px;
}
.quiz-preview {
  margin-top: 10px;
  padding: 10px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.quiz-preview p {
  font-size: 0.9rem;
  color: #555;
}

.btn.remove-quiz {
  margin-top: 5px;
  background: #ff6868;
  color: white;
  font-size: 0.8rem;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}
.category-select {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
}
/* Hide default checkbox */
input[type="checkbox"] {
  display: none;
}

/* Style the label for custom checkbox */
.custom-checkbox {
  display: inline-block;
  width: 40px;
  height: 20px;
  border-radius: 20px;
  background: #ccc;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
}

.custom-checkbox::after {
  content: "";
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: transform 0.3s;
}

/* Checked state */
input[type="checkbox"]:checked + .custom-checkbox {
  background: #007bff;
}

input[type="checkbox"]:checked + .custom-checkbox::after {
  transform: translateX(20px);
}
</style>
