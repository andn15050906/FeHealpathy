<template>
  <h1 class="page-title">Phương thức thanh toán</h1>

  <VaCard class="mb-6">
    <VaCardContent>
      <div class="text-2xl font-bold leading-5 mb-6">Thẻ của tôi</div>

      <PaymentCardList />
    </VaCardContent>
  </VaCard>

  <VaCard class="mb-6">
    <VaCardContent>
      <div class="text-2xl font-bold leading-5 mb-6">Địa chỉ thanh toán</div>

      <BillingAddressList />
    </VaCardContent>
  </VaCard>
</template>

<script setup>
import PaymentCardList from '@/components/PaymentComponents/widgets/my-cards/PaymentCardList.vue'
import BillingAddressList from '@/components/PaymentComponents/widgets/billing-address/BillingAddressList.vue'
</script>

<style scoped>
.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.va-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.va-card-content {
  padding: 20px;
}

.text-2xl {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.space-y-2 {
  margin-top: 20px;
}

.text-lg {
  font-size: 18px;
  font-weight: bold;
}

.text-secondary {
  color: #6b7280;
  /* Màu xám */
}

.text-primary {
  color: #3b82f6;
  /* Màu xanh */
}

.important-note {
  background-color: #e0f7fa;
  /* Màu nền nhạt */
  border: 1px solid #b2ebf2;
  /* Viền màu xanh nhạt */
  padding: 10px;
  border-radius: 4px;
}
</style>
