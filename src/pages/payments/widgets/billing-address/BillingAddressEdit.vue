<template>
  <VaForm ref="form" @submit.prevent="submit">
    <VaInput
      v-model="localBillingAddress.name"
      :rules="[(v) => !!v || 'Name is required']"
      class="mb-4"
      label="Full Name"
    />
    <VaInput
      v-model="localBillingAddress.phone"
      :rules="[(v) => !!v || 'Phone number is required']"
      class="mb-4"
      label="Phone Number"
    />
    <VaInput
      v-model="localBillingAddress.street"
      :rules="[(v) => !!v || 'Street is required']"
      class="mb-4"
      label="Street Address"
    />
    <VaInput
      v-model="localBillingAddress.ward"
      :rules="[(v) => !!v || 'Ward is required']"
      class="mb-4"
      label="Ward"
    />
    <VaInput
      v-model="localBillingAddress.district"
      :rules="[(v) => !!v || 'District is required']"
      class="mb-4"
      label="District"
    />
    <VaInput
      v-model="localBillingAddress.city"
      :rules="[(v) => !!v || 'City is required']"
      class="mb-4"
      label="City"
    />
    <VaInput
      v-model="localBillingAddress.country"
      :rules="[(v) => !!v || 'Country is required']"
      class="mb-4"
      label="Country"
    />
    <div class="flex justify-end gap-3">
      <VaButton color="secondary" preset="secondary" @click="emits('cancel')">Cancel</VaButton>
      <VaButton @click="submit">{{ submitText }}</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { useForm } from 'vuestic-ui'
import { BillingAddress } from '../../types'
import { watch, ref } from 'vue'

const { validate } = useForm('form')
const emits = defineEmits(['save', 'cancel'])

const props = defineProps<{
  billingAddress: BillingAddress
  submitText: string
}>()

const localBillingAddress = ref<BillingAddress>({ ...props.billingAddress })

watch(
  () => props.billingAddress,
  (value) => {
    localBillingAddress.value = { ...value }
  },
  { deep: true },
)

const submit = () => {
  if (validate()) {
    emits('save', localBillingAddress.value)
  }
}
</script>
