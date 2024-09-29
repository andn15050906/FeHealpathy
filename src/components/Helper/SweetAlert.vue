<template>
  <div></div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  methods: {
    showSuccess(message = 'Operation completed successfully!') {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
        confirmButtonColor: '#3085d6',
      });
    },

    showError(message = 'Something went wrong!') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#d33',
      });
    },

    showWarning(message = 'Are you sure?') {
      return Swal.fire({
        title: 'Warning',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, continue!',
        cancelButtonText: 'No, cancel!',
      });
    },

    showInfo(message = 'This is an information alert') {
      Swal.fire({
        icon: 'info',
        title: 'Info',
        text: message,
        confirmButtonColor: '#3085d6',
      });
    },
  }
};
</script>

<style scoped></style>
