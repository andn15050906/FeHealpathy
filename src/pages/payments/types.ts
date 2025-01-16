export enum PaymentSystemType {
  Visa = 'visa',
  MasterCard = 'mastercard',
  Momo = 'momo',
  VNPay = 'vnpay',
  ZaloPay = 'zalopay'
}

export interface PaymentCard {
  id: string
  name: string
  isPrimary: boolean
  paymentSystem: PaymentSystemType
  cardNumberMasked: string
  expirationDate: string
}

export interface BillingAddress {
  id: string
  name: string
  isPrimary: boolean
  street: string
  ward: string
  district: string
  city: string
  country: string
  phone: string
}
