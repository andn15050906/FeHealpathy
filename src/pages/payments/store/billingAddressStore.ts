import { reactive } from 'vue'
import { BillingAddress } from '../types'

export const billingAddressStore = reactive({
  allBillingAddresses: [] as BillingAddress[],
  loading: false,
  
  async load() {
    this.loading = true
    // Implement load logic here
    this.loading = false
  },

  async remove(id: string) {
    this.allBillingAddresses = this.allBillingAddresses.filter(addr => addr.id !== id)
  }
}) 