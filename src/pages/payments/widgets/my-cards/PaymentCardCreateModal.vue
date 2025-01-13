<template>
  <VaModal hide-default-actions :model-value="isModalOpen" size="small" close-button @cancel="emits('close')">
    <h3 class="va-h4 mb-4">Add payment card</h3>
    <PaymentCardEdit :payment-card="paymentCard" submit-text="Add Card" @cancel="emits('close')" @save="createCard" />
  </VaModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import PaymentCardEdit from './PaymentCardEdit.vue'
import { PaymentCard } from '../../types'

const isModalOpen = ref(false)

const props = defineProps<{
  paymentCard: PaymentCard
}>()

const emits = defineEmits(['close'])
const paymentCard = ref({ ...props.paymentCard })

const createCard = (card: PaymentCard) => {
  isModalOpen.value = false
  emits('close')
}
</script>
