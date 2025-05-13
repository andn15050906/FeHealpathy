<template>
  <v-app-bar flat color="background" height="72">
    <v-container class="d-flex align-center justify-space-between py-0">
      <div class="d-flex align-center">
        <v-icon color="primary" size="28" class="mr-2">mdi-heart-pulse</v-icon>
        <span class="text-h6 text-primary font-weight-medium"
          >Lộ trình sức khỏe tinh thần</span
        >
      </div>
      <div class="d-flex align-center">
        <v-chip
          class="mr-4"
          color="primary"
          variant="outlined"
          prepend-icon="mdi-palette-outline"
        >
          GIAO DIỆN: FOCUSED
        </v-chip>
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-clipboard-text-outline"
          class="mr-4"
        >
          LÀM BÀI ĐÁNH GIÁ
        </v-btn>
        <v-btn color="primary" variant="text" prepend-icon="mdi-refresh">
          CẬP NHẬT TRẠNG THÁI
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: "RoadmapHeader",
};
</script>
