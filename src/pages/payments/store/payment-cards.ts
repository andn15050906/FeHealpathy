import { reactive } from 'vue'
import { PaymentCard, PaymentSystemType } from '../types'

export const usePaymentCardsStore = () => {
  const store = reactive({
    allPaymentCards: [] as PaymentCard[],
    loading: false,

    async load() {
      this.loading = true
      // Implement load logic here
      this.loading = false
    },

    async remove(id: string) {
      this.allPaymentCards = this.allPaymentCards.filter(card => card.id !== id)
    }
  })

  return store
} 