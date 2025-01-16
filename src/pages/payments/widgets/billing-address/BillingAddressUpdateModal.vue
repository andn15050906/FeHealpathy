<template>
  <VaModal hide-default-actions :model-value="isModalOpen" size="small" close-button @cancel="emits('close')">
    <h3 class="va-h4 mb-4">Update Billing Address</h3>
    <BillingAddressEdit :billing-address="billingAddress" submit-text="Save Address" @cancel="emits('close')" @save="updateAddress" />
  </VaModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BillingAddressEdit from './BillingAddressEdit.vue'
import { BillingAddress } from '../../types'

const isModalOpen = ref(false)

const props = defineProps<{
  billingAddress: BillingAddress
}>()

const emits = defineEmits(['close'])
const billingAddress = ref({ ...props.billingAddress })

const updateAddress = (address: BillingAddress) => {
  isModalOpen.value = false
  emits('close')
}
</script>
