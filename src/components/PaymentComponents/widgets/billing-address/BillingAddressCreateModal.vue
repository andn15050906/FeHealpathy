<template>
  <VaModal hide-default-actions :model-value="isModalOpen" size="small" close-button @cancel="emits('close')">
    <h3 class="va-h4 mb-4">Add Billing Address</h3>
    <BillingAddressEdit
      :billing-address="billingAddress"
      submit-text="Add Address"
      @cancel="emits('close')"
      @save="update"
    />
  </VaModal>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import BillingAddressEdit from './BillingAddressEdit.vue'
import { BillingAddress } from '../../types'
import { useToast } from 'vuestic-ui'

const isModalOpen = ref(false)

const emits = defineEmits(['close'])
const { init } = useToast()

const billingAddress = reactive({
  id: Math.ceil(Math.random() * 100) + '',
  name: '',
  isPrimary: false,
  street: '',
  ward: '',
  district: '',
  city: '',
  country: '',
  phone: ''
} satisfies BillingAddress)

const update = (address: BillingAddress) => {
  isModalOpen.value = false
  emits('close')
}
</script>
