<template>
  <div class="grid md:grid-cols-2 grid-cols-1 gap-4">
    <template v-if="loading">
      <div v-for="i in 4" :key="i" class="skeleton-card">
        <VaSkeleton class="h-32 w-full rounded-lg" />
      </div>
    </template>
    <template v-else>
      <div v-for="paymentCard in list" :key="paymentCard.id" 
           class="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
        <CardListItem
          :card="paymentCard"
          @edit="cardToEdit = paymentCard"
          @remove="remove(paymentCard)"
        />
      </div>

      <div class="p-6 bg-primary bg-opacity-5 rounded-lg border-2 border-dashed border-primary">
        <div class="flex flex-col gap-4">
          <div>
            <h3 class="text-lg font-bold text-gray-800">Add Payment Method</h3>
            <p class="text-sm text-gray-600">
              Please carefully read Product Terms before adding your new payment card
            </p>
          </div>
          <VaButton 
            class="w-full sm:w-auto" 
            color="primary"
            @click="showCreate = true"
          >
            <VaIcon name="add" class="mr-2" />
            Add New Card
          </VaButton>
        </div>
      </div>
    </template>
  </div>

  <PaymentCardCreateModal 
    v-if="showCreate" 
    :payment-card="defaultCard"
    @close="showCreate = false" 
  />
  <PaymentCardUpdateModal 
    v-if="cardToEdit" 
    :payment-card="cardToEdit" 
    @close="cardToEdit = undefined" 
  />
</template>

<script lang="ts" setup>
import CardListItem from './PaymentCardListItem.vue'
import { usePaymentCardsStore } from '../../store/payment-cards'
import { computed, ref } from 'vue'
import { useColors } from 'vuestic-ui'
import { PaymentCard, PaymentSystemType } from '../../types'
import { useModal, useToast } from 'vuestic-ui'
import PaymentCardCreateModal from './PaymentCardCreateModal.vue'
import PaymentCardUpdateModal from './PaymentCardUpdateModal.vue'

const store = usePaymentCardsStore()

const list = computed(() => store.allPaymentCards)
const loading = computed(() => store.loading)
const { confirm } = useModal()

const showCreate = ref<boolean>(false)
const cardToEdit = ref<PaymentCard>()
const { init } = useToast()

store.load()
const remove = async (card: PaymentCard) => {
  confirm({
    message: 'Are you really sure you want to delete this card?',
    size: 'small',
    maxWidth: '380px',
  }).then((ok) => {
    if (!ok) return
    store.remove(card.id)
    init({ message: 'Payment card has been deleted', color: 'success' })
  })
}

const { getColor, colorToRgba } = useColors()

const defaultCard: PaymentCard = {
  id: '',
  name: '',
  isPrimary: false,
  paymentSystem: PaymentSystemType.Visa,
  cardNumberMasked: '',
  expirationDate: ''
}
</script>

<style scoped>
.skeleton-card {
  @apply p-4 rounded-lg border border-gray-200;
}
</style>