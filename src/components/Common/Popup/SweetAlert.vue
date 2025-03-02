<template>
  <div></div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  methods: {
    async showAlert(options) {
      this.disableScroll();
      return Swal.fire({
        ...options,
        scrollbarPadding: false,
      }).then((result) => {
        this.enableScroll();
        return result;
      });
    },
    disableScroll() {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    },
    enableScroll() {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    },
  }
};
</script>
Swal.fire({
  icon: 'success',
  title: 'Test Alert',
  text: 'Nếu bạn thấy popup này, SweetAlert hoạt động!',
});