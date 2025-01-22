// src/stores/cards.ts

import { defineStore } from 'pinia'
//import { sleep } from '../store/utilis'
import { PaymentSystemType, PaymentCard } from '../types' // adjust the import path accordingly

// Simulated fetch function
const fetchPaymentCards = async () => {
  return [
    {
      id: '1',
      name: 'VNPay',
      isPrimary: true,
      paymentSystem: PaymentSystemType.VNPay,
      cardNumberMasked: '****1679',
      expirationDate: '0924',
    },
    /*{
      id: '2',
      name: 'Online shopping',
      isPrimary: false,
      paymentSystem: PaymentSystemType.MasterCard,
      cardNumberMasked: '****8921',
      expirationDate: '1123',
    },
    {
      id: '3',
      name: 'Backup Visa',
      isPrimary: false,
      paymentSystem: PaymentSystemType.MasterCard,
      cardNumberMasked: '****4523',
      expirationDate: '1222',
    }*/
  ]
}

export const usePaymentCardsStore = defineStore({
  id: 'paymentCards',
  state: () => ({
    paymentCards: [] as PaymentCard[],
    loading: false,
  }),
  getters: {
    currentPaymentCard: (state): PaymentCard | undefined => state.paymentCards.find((card) => card.isPrimary),
    allPaymentCards: (state) => state.paymentCards,
  },
  actions: {
    async load() {
      this.loading = true
      this.paymentCards = await fetchPaymentCards()
      this.loading = false
    },
    create(card: PaymentCard) {
      this.paymentCards.unshift(card)
    },
    update(card: PaymentCard) {
      const index = this.paymentCards.findIndex((existingCard) => existingCard.id === card.id)
      if (index !== -1) {
        this.paymentCards.splice(index, 1, card)
      }
    },
    remove(cardId: string) {
      this.paymentCards = this.paymentCards.filter((card) => card.id !== cardId)
    },
  },
})