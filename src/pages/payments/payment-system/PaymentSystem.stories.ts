import PaymentSystem from './PaymentSystem.vue'

export default {
  title: 'PaymentSystem',
  component: PaymentSystem,
  tags: ['autodocs'],
}

export const Default = () => ({
  components: { PaymentSystem },
  template: `
    <PaymentSystem type="visa"/>
    <br>
    <PaymentSystem type="mastercard"/>
    <br>
    <PaymentSystem type="momo"/>
    <br>
    <PaymentSystem type="vnpay"/>
    <br>
    <PaymentSystem type="zalopay"/>
  `,
})
