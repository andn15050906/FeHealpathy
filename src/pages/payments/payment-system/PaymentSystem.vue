<template>
  <div class="payment-system-container">
    <img v-if="props.type === 'mastercard'" alt="Mastercard Logo" src="./mastercard.png" />
    <img v-if="props.type === 'visa'" alt="Visa Logo" src="./visa.png" />
    <img v-if="props.type === 'momo'" alt="Momo Logo" src="./momo.png" />
    <img v-if="props.type === 'vnpay'" alt="VNPay Logo" src="./vnpay.png" />
    <img v-if="props.type === 'zalopay'" alt="ZaloPay Logo" src="./zalopay.png" />
  </div>
</template>

<script setup lang="ts">
import { PaymentSystemType } from '../types'

const props = defineProps<{
  type: PaymentSystemType
}>()
</script>

<style scoped>
.payment-system-container {
  width: 100px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.payment-system-container img {
  max-width: 100%;
  max-height: 100%;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
