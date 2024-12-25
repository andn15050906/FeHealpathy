<template>
  <v-container fluid style="background-color: rgb(249, 249, 249); height: 100vh; width: 1200px;">
    <div>
      <section v-if="isEditingCoverImage" class="d-flex justify-end">
        <v-btn class="ma-2" color="error" @click="onCanelImage" depressed>{{ text["Cancel"] }}</v-btn>
        <v-btn class="ma-2" color="primary" @click="onSubmit" depressed>{{ text["Save Changes"] }}</v-btn>
      </section>
      <v-card class="mb-4" style="margin: 0px">
        <v-img :src="groupInfo.coverPhotoUrl" width="100%" height="300px" class="rounded-t custom-cover-img">
          <template v-slot:append>
            <v-btn v-if="groupInfo.isManager" color="grey" icon small @click="LoadUpdateCoverImageSection"
              class="mt-4 mr-4">
              <font-awesome-icon icon="fa-solid fa-upload" />
              <span>{{ text["Upload Image"] }}</span>
            </v-btn>
          </template>
        </v-img>

        <v-card-text>
          <v-text-field v-if="isEditingCoverImage" v-model="newCoverPhotoUrl" outlined />
          <h4 class="font-weight-bold">{{ groupInfo.name }}</h4>
          <div class="d-flex justify-space-between align-center">
            <div>
              <v-icon v-if="groupInfo.isPublic" small>mdi-earth</v-icon>
              <v-icon v-else small>mdi-lock</v-icon>
              <span>{{ groupInfo.isPublic ? text["Public group"] : text["Private group"] }}.</span>
              <span class="font-weight-bold">{{ groupInfo.totalMembers }} {{ text["members"] }}</span>
            </div>
            <div class="d-flex">
              <v-btn :loading="isLoadingJoinBtn" v-if="!groupInfo.hasJoin && !hasSendJoinRequest" color="primary"
                @click="joinGroupAsync">
                {{ text["Join"] }}
              </v-btn>
              <v-btn v-if="!groupInfo.isManager && hasSendJoinRequest" :loading="isLoadingCancelBtn" color="grey"
                @click="CancelJoinRequestAsync">
                {{ text["Cancel"] }}
              </v-btn>
              <v-btn v-if="groupInfo.isManager" :to="editUrl" color="primary" icon="mdi-settings" text>
                {{ text["Manage group"] }}
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-row class="pa-4">
        <v-col cols="7">
          <PostCreateSection v-if="groupInfo.isPublic || groupInfo.hasJoin" :isGroupPost="true"
            :isPublicGroup="groupInfo.isPublic" @createPostSuccess="fetchPosts" />
          <GroupPost v-if="groupInfo.isPublic || groupInfo.hasJoin" :group-posts="posts" />
        </v-col>

        <v-col cols="4" class="pa-4">
          <v-card>
            <v-card-title>{{ text["Introduction"] }}</v-card-title>
            <v-card-text>
              <div v-if="groupInfo.description">{{ groupInfo.description }}</div>
              <div>
                <v-icon>{{ groupInfo.isPublic ? 'mdi-earth' : 'mdi-lock' }}</v-icon>
                <span>{{ groupInfo.isPublic ? text["Public"] : text["Private"] }}</span>
              </div>
              <div>
                <v-icon>mdi-account-group</v-icon>
                <span>{{ groupInfo.totalMembers }} {{ text["members"] }}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-if="route.path.indexOf('manage') != -1 && userProfile">
      <!--<EditGroupComponent :groupInfo="groupInfo" />-->
      <JoinRequest :groupInfo="groupInfo" @approve-request="getGroupDescription" />
      <GroupMemberSection :is-group-manager="groupInfo.isManager" :group-member-count="groupInfo.totalMembers"
        @remove-member="getGroupDescription" />
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from "vue-router";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import PostCreateSection from '@/components/GroupComponents/CreatePostSection.vue';
//import EditGroupComponent from '@/components/GroupComponents/EditGroupComponent.vue';
import JoinRequest from '@/components/GroupComponents/JoinRequest.vue';
import GroupMemberSection from '@/components/GroupComponents/GroupMemberSection.vue';
import GroupPost from '@/components/GroupComponents/GroupPost.vue';
import GlobalState from '@/helpers/globalState';
import dict from '@/api/dictionary';
import data from '@/api/data';

const route = useRoute();
const groupInfo = ref({});
const newGroupInfo = ref({
  id: route.params.id,
  name: "",
  description: "",
  postMode: {
    label: "Tự do",
    value: false
  },
})
const isEditingCoverImage = ref(false);
const newCoverPhotoUrl = ref("");
const text = ref({});
const userProfile = ref({});
const hasSendJoinRequest = ref(false);
const isLoadingJoinBtn = ref(false);
const posts = ref([]);

onMounted(() => {
  text.value = dict[GlobalState.getLang()];
  userProfile.value = GlobalState.getUserProfile();
  getGroupDescription();
  posts.value = data.GroupOverview.Posts;
})

const props = defineProps({
  groupInfo: {
    type: Object,
    default: () => ({
      id: "",
      name: "",
      description: "",
      isPublic: false,
      hasJoin: false,
      totalMembers: 0,
      coverPhotoUrl: "",
      hasRequestJoin: false,

    }),
  },
});

function updateGroupCoverImage() {
  groupInfo.value = newGroupInfo;
}

function joinGroupAsync() {

}

function fetchPosts() {
  posts.value = data.GroupOverview.Posts;
}

async function onSubmit() {
  verifyInput();
  if (isValidInput.value == 1) {
    isLoadingImageBtn.value = true;
    // Get the result after creating group.
    const result = await updateImageApi(
      props.groupInfo.id,
      newCoverPhotoUrl.value
    );

    if (result.isSuccess) {
      NotificationHelper.notifySuccess("Thay đổi thành công");

      // Change cover image after updating successfully.
      // emit('updateCoverImage', { ...props.groupInfo, coverPhotoUrl: result.responseBody });
      window.location.reload();
      // newCoverPhotoUrl.value = '';
    } else {
      NotificationHelper.notifyError(result.message ?? "Có lỗi xảy ra");
    }
    isLoadingImageBtn.value = false;
  }
}

async function getGroupDescription() {
  /*const result = await getGroupApi(
      route.params.id
  );*/

  //if (result.isSuccess) {
  //Updated
  //groupInfo.value = result.responseBody;
  groupInfo.value = {
    id: 1,
    name: 'name',
    description: 'description',
    postMode: 'Yêu cầu phê duyệt',
    isPublic: true,
    coverPhotoUrl: "https://fastly.picsum.photos/id/115/200/200.jpg?hmac=rb32z_z70PD8yz0Z-aLmi9hL72NZny0rmG2LzKmNKV4",
    hasJoin: true,
    totalMembers: 1,
    hasRequestJoin: false
  }
  groupInfo.value.id = route.params.id
  /*} else {
      //sw
      console.log("Có lỗi xảy ra khi tạo");
  }*/
  resetValue();

  console.log(1);
}

function resetValue() {
  newGroupInfo.value = {
    id: route.params.id,
    name: groupInfo.value.name,
    description: groupInfo.value.description,
    postMode: {
      label: groupInfo.value.requireApprovedWhenPost ? "Yêu cầu phê duyệt" : "Tự do",
      value: groupInfo.value.requireApprovedWhenPost
    }
  }
}

function onCanelImage() {
  newCoverPhotoUrl.value = "";
  editBtnClickedCount.value = 0;
  isEditingCoverImage.value = false;
}

function LoadUpdateCoverImageSection() {
  isEditCoverImage.value = true;
}
</script>

<style>
.custom-cover-img img {
  object-fit: cover;
  object-position: 50% 50%;
}
</style>

<style scoped>
.text-small {
  font-size: 0.75rem;
}

.edit-section {
  margin: 1rem 18rem 0 18rem;
  background-color: white;
  border: 1px solid rgba(180, 180, 180, 0.599);
  border-radius: 8px;
}

.group-link {
  --primary: #53bf94;
  --primary-700: #e5f3ef;
  --light: #f9fafc;
  --light-500: #dddddd;
  --dark: #120e36;

  color: var(--dark);
  border-radius: 4px;
  background-color: white;
  margin-top: 2rem;
}

.group-name {
  font-size: 1rem;
}
</style>