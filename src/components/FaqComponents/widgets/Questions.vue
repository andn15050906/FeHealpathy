<template>
  <VaCard class="faq-card">
    <VaCardContent>
      <h2 class="faq-title">Câu hỏi thường gặp</h2>
      <VaAccordion v-model="accordionState" class="faq-accordion">
        <VaCollapse v-for="(item, index) in faqItems" :key="index">
          <template #header>
            <div class="faq-header">
              <span>{{ item.question }}</span>
              <font-awesome-icon icon="chevron-down" class="faq-icon"
                :class="{ expanded: accordionState.includes(index) }" />
            </div>
          </template>
          <article class="faq-content">
            <p>{{ item.answer }}</p>
            <ul v-if="item.list" class="faq-list">
              <li style="color: green;" v-for="(listItem, i) in item.list" :key="i">{{ listItem }}</li>
            </ul>
          </article>
        </VaCollapse>
      </VaAccordion>
    </VaCardContent>
  </VaCard>
</template>

<script setup>
import { reactive } from 'vue';

const accordionState = reactive([]);

const faqItems = [
  {
    question: 'Làm thế nào để theo dõi hoạt động hàng ngày của tôi?',
    answer: 'Theo dõi hoạt động hàng ngày trong HEALPATHY rất đơn giản:',
    list: [
      'Đi đến phần Theo dõi hoạt động',
      'Nhấp vào "Thêm hoạt động" để ghi nhận hoạt động mới',
      'Chọn loại hoạt động và nhập chi tiết',
      'Lưu bản ghi để cập nhật bảng khỏe mạnh của bạn',
    ],
  },
  {
    question: 'Làm thế nào để tham gia nhóm khỏe mạnh?',
    answer: 'Để tham gia nhóm khỏe mạnh:',
    list: [
      'Duyệt các nhóm khả dụng trong phần Cộng đồng',
      'Nhấp vào "Tham gia nhóm" trên các nhóm mà bạn quan tâm',
      'Tham gia thảo luận và chia sẻ kinh nghiệm',
      'Kết nối với những người có cùng mục tiêu khỏe mạnh',
    ],
  },
  {
    question: 'Làm thế nào để đặt mục tiêu khỏe mạnh?',
    answer: 'Đặt mục tiêu khỏe mạnh giúp theo dõi tiến bộ của bạn:',
    list: [
      'Đi đến Cài đặt hồ sơ của bạn',
      'Chọn "Mục tiêu khỏe mạnh"',
      'Chọn loại mục tiêu',
      'Đặt các mục tiêu cụ thể và thời hạn',
      'Theo dõi tiến bộ qua bảng khỏe mạnh của bạn',
    ],
  },
];
</script>

<style scoped>
.faq-card {
  padding: 0 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.faq-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #154EC1;
  margin-bottom: 1rem;
}

.faq-accordion {
  border-top: 1px solid #ddd;
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  padding: 0.7rem 0;
  cursor: pointer;
}

.faq-icon {
  color: #154EC1;
  transition: transform 0.3s ease-in-out;
}

.faq-icon.expanded {
  transform: rotate(180deg);
}

.faq-content {
  padding: 0;
  line-height: 1.6;
  color: #555;
}

.faq-list {
  padding: 0 5px;
  list-style-type: disc;
}
</style>