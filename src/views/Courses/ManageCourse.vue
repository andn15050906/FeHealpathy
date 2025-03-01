<template>
  <div class="course-management">
    <h1 class="title">📚 Course Manager</h1>
    <div class="header-actions">
      <router-link to="/courses/create">
        <button class="create-course-btn btn">✅ Create Course</button>
      </router-link>
    </div>

    <div class="course-list">
      <div class="course-item" v-for="course in courses" :key="course.id">
        <img :src="course.thumbUrl" alt="Course Thumbnail" class="thumbnail" />
        <div class="course-details">
          <h2 class="course-title">{{ course.title }}</h2>
          <p class="course-meta">
            📆 Created: {{ formatDate(course.creationTime) }} | 🎓 Students:
            {{ course.learnerCount }} | 📖 Lectures: {{ course.lectureCount }}
          </p>
          <div class="actions">
            <button class="btn view" @click="viewCourse(course.id)"
              >👁️ View</button
            >
            <button class="btn edit" @click="editCourse(course.id)"
              >✏️ Update</button
            >
            <button class="btn delete" @click="deleteCourse(course.id)"
              >🗑️ Delete</button
            >
          </div>
        </div>
      </div>
    </div>

    <p v-if="courses.length === 0" class="no-courses">No courses available!</p>
  </div>
</template>

<script>
export default {
  name: "ManageCourses",
  data() {
    return {
      courses: [
        {
          id: 1,
          title: "Mastering Vue.js",
          thumbUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtUdKdx81XRfmk5Gj1mA9sp_Z35yCLIRlmPI7UT6-TRySioqW7-druOqLKHIQMiDKbWdQ&usqp=CAU",
          creationTime: "2025-01-10",
          learnerCount: 120,
          lectureCount: 10,
        },
        {
          id: 2,
          title: "JavaScript for Beginners",
          thumbUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtUdKdx81XRfmk5Gj1mA9sp_Z35yCLIRlmPI7UT6-TRySioqW7-druOqLKHIQMiDKbWdQ&usqp=CAU",
          creationTime: "2025-01-15",
          learnerCount: 200,
          lectureCount: 15,
        },
        {
          id: 3,
          title: "Advanced React",
          thumbUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtUdKdx81XRfmk5Gj1mA9sp_Z35yCLIRlmPI7UT6-TRySioqW7-druOqLKHIQMiDKbWdQ&usqp=CAU",
          creationTime: "2025-01-20",
          learnerCount: 300,
          lectureCount: 12,
        },
        {
          id: 4,
          title: "Full Stack Web Development",
          thumbUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtUdKdx81XRfmk5Gj1mA9sp_Z35yCLIRlmPI7UT6-TRySioqW7-druOqLKHIQMiDKbWdQ&usqp=CAU",
          creationTime: "2025-01-25",
          learnerCount: 500,
          lectureCount: 20,
        },
      ],
    };
  },
  methods: {
    viewCourse(courseId) {
      this.$router.push({ name: "CourseDetail", params: { id: courseId } });
    },
    editCourse(courseId) {
      alert(`Editing course ID: ${courseId}`);
    },
    deleteCourse(courseId) {
      if (confirm("Are you sure to delete this course?")) {
        this.courses = this.courses.filter((course) => course.id !== courseId);
        alert("Course deleted!");
      }
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("en-EN", options);
    },
  },
};
</script>

<style scoped>
.course-management {
  max-width: 1100px;
  margin: 30px auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.title {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.header-actions {
  text-align: center;
  margin-bottom: 20px;
}

.create-course-btn {
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.create-course-btn:hover {
  background-color: #218838;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.course-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #fafafa;
  border-radius: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.thumbnail {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 20px;
}

.course-details {
  flex: 1;
}

.course-title {
  font-size: 1.4rem;
  margin: 0;
  color: #333;
}

.course-meta {
  font-size: 0.9rem;
  color: #888;
  margin: 5px 0;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
}

.btn.view {
  background: #007bff;
  color: white;
}

.btn.edit {
  background: #ffc107;
  color: white;
}

.btn.delete {
  background: #dc3545;
  color: white;
}

.no-courses {
  text-align: center;
  color: #888;
  font-size: 1rem;
}
</style>
