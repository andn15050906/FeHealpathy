<template>
  <div class="course-creation">
    <h1 class="title">✨ Create New Course ✨</h1>
    <form @submit.prevent="submitCourse" class="course-form">
      <div class="form-group">
        <label for="title">🖋️ Course Title</label>
        <input
          type="text"
          id="title"
          v-model="course.title"
          placeholder="Insert course title"
          required
        />
      </div>

      <div class="form-group">
        <label for="intro">📘 Course Intro</label>
        <textarea
          id="intro"
          v-model="course.intro"
          placeholder="Write a short intro for the course"
          rows="3"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="description">📝 Course Description</label>
        <textarea
          id="description"
          v-model="course.description"
          placeholder="Detailed course description"
          rows="5"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="thumb">🖼️ Course Thumbnail</label>
        <input
          type="file"
          id="thumb"
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
          required
          class="category-select"
        >
          <option value="" disabled>Choose a category</option>
          <option
            v-for="(category, index) in availableCategories"
            :key="index"
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
          placeholder="Enter price (VND)"
          min="0"
          required
        />
      </div>

      <div class="form-group">
        <label for="level">📈 Course Level</label>
        <select id="level" v-model="course.level" required>
          <option value="" disabled>Select level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div class="form-group">
        <label for="outcomes">🏆 Course Outcomes</label>
        <textarea
          id="outcomes"
          v-model="course.outcomes"
          placeholder="Expected learning outcomes"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="requirements">📌 Course Requirements</label>
        <textarea
          id="requirements"
          v-model="course.requirements"
          placeholder="Course prerequisites"
          rows="3"
        ></textarea>
      </div>

      <!-- Course Lectures -->
      <div class="lectures">
        <h2>📚 Course Lectures</h2>
        <div
          class="lecture"
          v-for="(lecture, index) in course.lectures"
          :key="index"
        >
          <div class="form-group">
            <label>📌 Lecture Title {{ index + 1 }}</label>
            <input
              type="text"
              v-model="lecture.title"
              placeholder="Lecture title"
              required
            />
          </div>

          <div class="form-group">
            <label>📄 Lecture Content</label>
            <textarea
              v-model="lecture.content"
              placeholder="Lecture content"
              rows="4"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" v-model="lecture.isPreviewable" />
              <span class="custom-checkbox"></span> Is Previewable
            </label>
          </div>

          <div class="form-group">
            <label>📂 Upload Lecture Materials</label>
            <input
              type="file"
              @change="handleLectureMediaUpload($event, index)"
              accept="image/*,video/*,application/pdf"
              multiple
            />
            <div v-if="lecture.medias.length > 0" class="resource-preview">
              <div
                v-for="(media, mediaIndex) in lecture.medias"
                :key="mediaIndex"
                class="single-resource"
              >
                <img
                  v-if="media.type === 'image'"
                  :src="media.preview"
                  alt="Lecture Image"
                />
                <video
                  v-else-if="media.type === 'video'"
                  controls
                  :src="media.preview"
                ></video>
                <a v-else :href="media.url" target="_blank">{{
                  media.title
                }}</a>
                <button
                  type="button"
                  class="btn remove"
                  @click="removeLectureMedia(index, mediaIndex)"
                  >❌ Remove</button
                >
              </div>
            </div>
          </div>

          <button type="button" class="btn remove" @click="removeLecture(index)"
            >❌ Remove Lecture</button
          >
          <div class="divider"></div>
        </div>
        <button type="button" class="btn add" @click="addLecture"
          >➕ Add Lecture</button
        >
      </div>

      <div class="form-actions">
        <button type="submit" class="btn submit">✅ Create Course</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "CreateCourse",
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
        leafCategoryId: "",
        lectures: [],
      },
      previewImage: null,
      availableCategories: [
        { id: "1", name: "Yoga" },
        { id: "2", name: "Meditation" },
        { id: "3", name: "Health & Wellness" },
      ],
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
            title: file.name,
          });
        };
        reader.readAsDataURL(file);
      });
    },
    addLecture() {
      this.course.lectures.push({
        title: "",
        content: "",
        isPreviewable: false,
        medias: [],
      });
    },
    removeLecture(index) {
      this.course.lectures.splice(index, 1);
    },
    removeLectureMedia(lectureIndex, mediaIndex) {
      this.course.lectures[lectureIndex].medias.splice(mediaIndex, 1);
    },
    submitCourse() {
      console.log("Submitting course:", this.course);
      alert("Course created successfully!");
      this.resetForm();
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
        lectures: [],
      };
      this.previewImage = null;
    },

    //     handleQuizUpload(event, index) {
    //   const file = event.target.files[0];
    //   if (file && file.type === "application/json") {
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //       try {
    //         const quizData = JSON.parse(e.target.result);
    //         this.$set(this.course.sections[index], "quiz", {
    //           name: file.name,
    //           data: quizData,
    //         });
    //       } catch (error) {
    //         alert("Tệp JSON không hợp lệ!");
    //       }
    //     };
    //     reader.readAsText(file);
    //   } else {
    //     alert("Vui lòng tải lên một tệp JSON!");
    //   }
    // },
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
