<template>
  <div class="yoga-detail">
    <button class="back-button" @click="goBack">← Quay lại</button>
    <h1 class="title">Yoga For Beginners | Day 01 | Hye Yoga</h1>
    <p class="category">Cơ Bản</p>
    <div class="video-container">
      <iframe class="video" src="https://www.youtube.com/embed/iSS4asEmIfE"
        title="Yoga For Beginners | Day 01 | Hye Yoga" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    </div>

    <div class="actions">
      <button @click="likeExercise" class="btn like">Like</button>
      <button @click="shareExercise" class="btn share">Share</button>
    </div>
    <div class="divider"></div>
    <div class="description">
      <h2>Mô tả bài tập</h2>
      <p>
        Yoga mang lại nhiều lợi ích cho sức khỏe thể chất, tinh thần và sức khỏe toàn diện.
        Các bài tập yoga giúp tăng cường sự linh hoạt, giảm căng thẳng và cải thiện chất lượng cuộc sống.
      </p>
    </div>
    <div class="divider"></div>
    <div class="equipment">
      <h2>Thiết bị cần chuẩn bị</h2>
      <ul>
        <li>Không yêu cầu thiết bị</li>
      </ul>
    </div>
    <div class="divider"></div>
    <div class="related-exercises">
      <h2>Bài tập liên quan</h2>
      <div class="exercise-list">

        <YogaExerciseCard v-for="excercise in relatedExercises" :key="excercise.id" :excercise="excercise" />

        <!--<div class="exercise-item" v-for="exercise in relatedExercises" :key="exercise.id">
          <img :src="exercise.thumbnail" :alt="exercise.title" />
          <p>{{ exercise.title }}</p>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import data from '@/scripts/data/data';
import YogaExerciseCard from '@/components/PracticeComponents/YogaExerciseCard.vue';

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
  },
  components: {
    YogaExerciseCard
  }
};
</script>

<style scoped>
.yoga-detail {
  font-family: "Poppins", Arial, sans-serif;
  line-height: 1.8;
  margin: 60px auto;
  max-width: 900px;
  color: #333;
}

.title {
  font-size: 2.5em;
  margin-bottom: 10px;
  text-align: center;
  color: #4caf50;
}

.category {
  color: #777;
  margin-bottom: 20px;
  text-align: center;
  font-style: italic;
}

.video-container {
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.video {
  width: 100%;
  height: 400px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 25px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}

.like {
  background-color: #ff6868;
  color: white;
}

.like:hover {
  background-color: #ff4d4d;
}

.share {
  background-color: #68a0ff;
  color: white;
}

.share:hover {
  background-color: #4d8cff;
}

.divider {
  border-top: 1px solid #ddd;
  margin: 30px 0;
}

.description,
.equipment {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.equipment ul {
  list-style-type: none;
  padding: 0;
}

.equipment li {
  margin: 5px 0;
}


.related-exercises {
  margin-top: 20px;
}

.exercise-list {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.exercise-item {
  text-align: center;
  flex: 1;
  transition: transform 0.3s;
  cursor: pointer;
}

.exercise-item img {
  width: 100%;
  max-width: 150px;
  height: auto;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.exercise-item:hover {
  transform: scale(1.05);
}

.exercise-item p {
  font-size: 1em;
  color: #333;
}
</style>
