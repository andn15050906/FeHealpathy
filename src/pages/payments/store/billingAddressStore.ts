import { defineStore } from 'pinia'
import { sleep } from '../store/utilis'
import { BillingAddress } from '../types' // adjust the import path accordingly

// Simulated fetch function
const fetchBillingAddresses = async () => {
  await sleep(1000)
  return [
    {
      id: '1',
      name: 'Home address',
      isPrimary: true,
      street: 'Ap #285-7193 Ullamcorper Avenue',
      city: 'Amesbury',
      ward: '',
      district: '',
      postalCode: '93373',
      country: 'US',
      phone: '0348556981'
    },
    {
      id: '2',
      name: 'Office address',
      isPrimary: false,
      street: 'P.O. Box 847, 8011 Nisl St.',
      city: 'Morgantown',
      ward: 'Ward 1',
      district: 'District 1',
      country: 'US',
      phone: '0348556981'
    },
    {
      id: '3',
      name: 'Vacation home',
      isPrimary: false,
      street: '883-2699 Egestas Rd.',
      city: 'Frederick',
      ward: 'Ward 1',
      district: 'District 1',
      postalCode: '20620',
      country: 'US',
      phone: '0348556981'
    },
  ] as BillingAddress[]
}

export const useBillingAddressesStore = defineStore({
  id: 'billingAddresses',
  state: () => ({
    billingAddresses: [] as BillingAddress[],
    loading: false,
  }),
  getters: {
    allBillingAddresses: (state) => state.billingAddresses,
  },
  actions: {
    async load() {
      this.loading = true
      this.billingAddresses = await fetchBillingAddresses()
      this.loading = false
    },
    create(address: BillingAddress) {
      this.billingAddresses.unshift(address)
    },
    update(address: BillingAddress) {
      const index = this.billingAddresses.findIndex((existingCard) => existingCard.id === address.id)
      if (index !== -1) {
        this.billingAddresses.splice(index, 1, address)
      }
    },
    remove(addressId: string) {
      this.billingAddresses = this.billingAddresses.filter((address) => address.id !== addressId)
    },
  },
})
