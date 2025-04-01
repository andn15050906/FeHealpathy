<template>
  <div class="container yoga-detail">
    <button class="btn btn-outline-secondary back-button" @click="goBack">
      <i class="fas fa-arrow-left"></i> Quay lại
    </button>
    <h1 class="title">Yoga For Beginners | Day 01 | Hye Yoga</h1>
    <p class="category">Cơ Bản</p>

    <div class="video-container">
      <iframe class="video" src="https://www.youtube.com/embed/iSS4asEmIfE"
        title="Yoga For Beginners | Day 01 | Hye Yoga" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    </div>

    <div class="actions text-center">
      <button @click="likeExercise" class="btn btn-danger me-2">
        <i class="fas fa-heart"></i> Like
      </button>
      <button @click="shareExercise" class="btn btn-primary">
        <i class="fas fa-share-alt"></i> Share
      </button>
    </div>

    <div class="divider my-4"></div>

    <div class="card shadow-sm p-3 mb-4">
      <h2 class="h4">Mô tả bài tập</h2>
      <p>
        Yoga mang lại nhiều lợi ích cho sức khỏe thể chất, tinh thần và sức khỏe toàn diện.
        Các bài tập yoga giúp tăng cường sự linh hoạt, giảm căng thẳng và cải thiện chất lượng cuộc sống.
      </p>
    </div>

    <div class="card shadow-sm p-3 mb-4">
      <h2 class="h4">Thiết bị cần chuẩn bị</h2>
      <ul class="list-unstyled mb-0">
        <li><i class="fas fa-check-circle text-success"></i> Không yêu cầu thiết bị</li>
      </ul>
    </div>

    <div class="related-exercises">
      <h2 class="h4 text-center mb-3">Bài tập liên quan</h2>
      <div class="row">
        <div class="col-md-3" v-for="exercise in relatedExercises" :key="exercise.id">
          <YogaExerciseCard :excercise="exercise" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from '@/scripts/data/data';
import YogaExerciseCard from '@/components/YogaComponents/YogaExerciseCard.vue';

export default {
  name: "YogaDetailPage",
  data() {
    return {
      relatedExercises: data.YogaCatalog.Lessons.slice(0, 4)
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    likeExercise() {
      console.log("Liked!");
    },
    shareExercise() {
      console.log("Shared!");
    }
  },
  components: {
    YogaExerciseCard
  }
};
</script>

<style scoped>
.yoga-detail {
  font-family: "Poppins", Arial, sans-serif;
  color: #333;
  max-width: 100%;
  margin: 10px auto;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: #28a745;
  margin-bottom: 10px;
}

.category {
  color: #6c757d;
  text-align: center;
  font-style: italic;
  margin-bottom: 20px;
}

.video-container {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.video {
  width: 100%;
  height: 450px;
}

.actions .btn {
  font-size: 1rem;
  font-weight: bold;
  padding: 10px 20px;
}

.divider {
  border-top: 1px solid #ddd;
}

.card {
  border: none;
  background-color: #f9f9f9;
  border-radius: 10px;
}
</style>