<template>
    <div class="row">
      <div
        v-for="course in courses"
        :key="course.id"
        class="col-md-3 col-sm-6 col-xs-12 form-group"
      >
        <a
          :href="getCourseDetailPage(course.id)"
          class="course-box-slider pop"
          :title="course.title"
          style="height: 236px; max-height: unset"
        >
          <span v-if="isOnDiscount(course)" class="sale-off">
            -{{ course.discount * 100 }}%
          </span>
          <div class="img-course">
            <img class="img-responsive" :src="course.thumbUrl" alt="thumb" loading="lazy" />
          </div>
          <div class="content-course">
            <h3 class="title-course">
              <span>{{ course.title }}</span>
            </h3>
            <div class="name-gv">
              <b>{{ course.creator.fullName }}</b>
              <div class="rate-combo">
                <p>
                  <span class="star-rate">
                    <i
                      v-for="n in Math.ceil(course.averageRating)"
                      :key="n"
                      class="fa fa-star co-or"
                      aria-hidden="true"
                    ></i>
                    <span v-if="course.ratingCount > 0">
                      ({{ course.ratingCount }})
                    </span>
                    <span v-else>No rating yet</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="price-course" style="clear: both; top: -40px;">
            <span class="price-b" v-if="isOnDiscount(course)">
              {{ formatPrice(course.price) }}<sup>đ</sup>
            </span>
            <span class="price-a">
              {{ formatPrice(course.discountedPrice || course.price) }}<sup>đ</sup>
            </span>
          </div>
        </a>
      </div>
    </div>
  </template>
  
  <script>
  import { getCourses } from "../../services/courseService.js";
  
  export default {
    data() {
      return {
        courses: [],
      };
    },
    methods: {
      async fetchCourses() {
        try {
          const response = await getCourses();
          this.courses = response.data;
        } catch (error) {
          console.error("Failed to fetch courses", error);
        }
      },
      getCourseDetailPage(courseId) {
        return `/course/detail/${courseId}`;
      },
      isOnDiscount(course) {
        return course.discount > 0 && new Date(course.discountExpiry) > new Date();
      },
      formatPrice(price) {
        return price.toLocaleString();
      },
    },
    mounted() {
      this.fetchCourses();
    },
  };
  </script>
  
  <style scoped>
  </style>
  