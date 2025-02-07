<template>
  <div class="post-bg">
    <v-row class="align-center px-4 py-2">
      <v-avatar size="40" class="mr-3">
        <v-img :src="userProfile.avatarUrl" alt="User Avatar" />
      </v-avatar>
      <v-btn rounded color="grey lighten-3" class="flex-grow-1 text-left" text no-caps
        @click="showCreationPopup = true">
        Bạn đang nghĩ gì?
      </v-btn>
    </v-row>

    <v-divider></v-divider>
  </div>
  <CreatePostPopup v-if="showCreationPopup" @closePopup="showCreationPopup = false" :is-group-post="isGroupPost"
    :is-public-group="isPublicGroup" @createPostSuccess="showCreationPopup = false; emit('createPostSuccess')" />

</template>

<script setup>
import { ref } from 'vue';
import CreatePostPopup from './CreatePostPopup.vue';
import GlobalState from '@/scripts/logic/globalState';

const showCreationPopup = ref(false);
const userProfile = ref({});

const props = defineProps({
  isGroupPost: {
    type: Boolean,
    default: false
  },
  isPublicGroup: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['createPostSuccess']);

userProfile.value = GlobalState.getUserProfile();
</script>

<style scoped>
.post-bg {
  background-color: white;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>