<template>
  <div class="Setting_pageWrapper__PM+M5">
    <section class="index-module_row__-AHgh">
      <section
        class="index-module_col__2EQm9 index-module_c-12__u7UXF index-module_m-12__2CxUL index-module_l-12__340Ve">
        <div class="Setting_wrapper__TX8z0">
          <div class="GroupField_wrapper__1-jfw">
            <!-- Alert Component -->
            <!-- <Alert v-if="alertMessage" :message="alertMessage" /> -->

            <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
              <h2 class="GroupField_heading__PIaoN">{{ text.PersonalInfo }}</h2>

              <!-- Full Name Field -->
              <div class="FieldWrapper_wrapper__QcEfS">
                <div class="InputField_fieldContent__iWttQ">
                  <h3 class="InputField_fieldContentLabel__wJO4a">{{ text.FullName }}</h3>
                  <div>
                    <div class="InputField_fieldContentEdit__KYEiF">
                      <input v-model="form.fullName" type="text" class="InputField_fieldContentInput__lO21W"
                        maxlength="50" placeholder="Add your name" />
                      <div class="InputField_description__unJBo">
                        <p>{{ text.NameDescription }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bio Field -->
              <div class="FieldWrapper_wrapper__QcEfS">
                <div class="InputField_fieldContent__iWttQ">
                  <h3 class="InputField_fieldContentLabel__wJO4a">{{ text.Bio }}</h3>
                  <div>
                    <div class="InputField_fieldContentEdit__KYEiF">
                      <input v-model="form.bio" type="text" class="InputField_fieldContentInput__lO21W" maxlength="900"
                        placeholder="Add Bio" />
                      <div class="InputField_description__unJBo">
                        <p>{{ text.BioDescription }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Avatar Field -->
              <div class="FieldWrapper_wrapper__QcEfS">
                <div class="PhotoField_fieldContent__QiVzm">
                  <h3 class="PhotoField_fieldContentLabel__rBtfX">{{ text.Avatar }}</h3>
                  <div class="PhotoField_fieldContentEdit__8iE7p">
                    <div class="PhotoField_contentImage__zbcdo">
                      <div class="PhotoField_avatar__Qdo+k">
                        <div class="FallbackAvatar_avatar__gmj3S" style="--font-size: 8.9px;">
                          <img :src="form.avatarUrl" alt="User Avatar" id="app-avatar-img" />
                        </div>
                      </div>
                      <input @change="handleAvatarChange" ref="avatarInput" type="file" class="invisible"
                        accept=".jpg, .jpeg, .png" />
                    </div>
                  </div>
                </div>
                <div class="PhotoField_fieldBtn__TSg2A">
                  <div @click="triggerAvatarUpload" class="Button_fieldButton__B93oZ Button_fieldButtonDefault__7a6UD">
                    {{ text.Edit }}</div>
                </div>
              </div>

              <!-- Email Field -->
              <div class="FieldWrapper_wrapper__QcEfS">
                <div class="InputField_fieldContent__iWttQ">
                  <h3 class="InputField_fieldContentLabel__wJO4a">Email</h3>
                  <div>
                    <div class="InputField_fieldContentEdit__KYEiF">
                      <input type="text" class="InputField_fieldContentInput__lO21W" maxlength="50" disabled
                        :value="form.email" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- UserName Field -->
              <div class="FieldWrapper_wrapper__QcEfS">
                <div class="InputField_fieldContent__iWttQ">
                  <h3 class="InputField_fieldContentLabel__wJO4a">{{ text.UserName }}</h3>
                  <div>
                    <div class="InputField_fieldContentEdit__KYEiF">
                      <input type="text" class="InputField_fieldContentInput__lO21W" maxlength="50"
                        placeholder="Add username" disabled :value="form.userName" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Date of Birth Field -->
              <div class="FieldWrapper_wrapper__QcEfS">
                <div class="InputField_fieldContent__iWttQ">
                  <h3 class="InputField_fieldContentLabel__wJO4a">{{ text.DateOfBirth }}</h3>
                  <div>
                    <div class="InputField_fieldContentEdit__KYEiF">
                      <input v-model="form.dateOfBirth" type="date" class="InputField_fieldContentInput__lO21W" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Enrollment Count Field -->
              <div class="FieldWrapper_wrapper__QcEfS">
                <div class="InputField_fieldContent__iWttQ">
                  <h3 class="InputField_fieldContentLabel__wJO4a">{{ text.EnrollmentCount }}</h3>
                  <div>
                    <div class="InputField_fieldContentEdit__KYEiF">
                      <input type="text" class="InputField_fieldContentInput__lO21W" disabled
                        :value="form.enrollmentCount" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Role Field -->
              <div class="FieldWrapper_wrapper__QcEfS">
                <div class="InputField_fieldContent__iWttQ">
                  <h3 class="InputField_fieldContentLabel__wJO4a">{{ text.Role }}</h3>
                  <div>
                    <div class="InputField_fieldContentEdit__KYEiF">
                      <input type="text" class="InputField_fieldContentInput__lO21W" disabled :value="form.role" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Join Date Field -->
              <div class="FieldWrapper_wrapper__QcEfS">
                <div class="InputField_fieldContent__iWttQ">
                  <h3 class="InputField_fieldContentLabel__wJO4a">{{ text.JoinDate }}</h3>
                  <div>
                    <div class="InputField_fieldContentEdit__KYEiF">
                      <input type="date" class="InputField_fieldContentInput__lO21W" disabled :value="form.creationTime" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div @click="openConfirmModal" class="InputField_fieldBtn__OG6ZB">
                  <div class="Button_fieldButton__B93oZ Button_fieldButtonDefault__7a6UD">{{ text.Save }}</div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </section>

    <!-- Confirmation Modal -->
    <div class="modal fade" id="app-confirm-modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-uppercase text-danger">{{ text.Confirm }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="text-primary">{{ text.ConfirmQuestion }}</p>
          </div>
          <div class="modal-footer">
            <button @click="confirmChanges" type="button" class="btn btn-outline-danger">Yes</button>
            <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">No</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
// import Alert from '@/components/Alert.vue'; 
import { getClientInfo } from '../../services/userService.js';

export default {
  setup() {
    const form = ref({
      fullName: '',
      bio: '',
      avatarUrl: '',
      email: '',
      userName: '',
      dateOfBirth: '',
      enrollmentCount: '',
      role: '',
      creationTime: ''
    });
    const loading = ref(true);
    const alertMessage = ref(null);

    const text = {
      PersonalInfo: 'Personal Info',
      FullName: 'Full Name',
      AddYourName: 'Add your name',
      NameDescription: 'Your name appears on your profile and next to your comments',
      Edit: 'Edit',
      Bio: 'Bio',
      AddBio: 'Add Bio',
      BioDescription: 'Your bio appears on your profile',
      Avatar: 'Avatar',
      UserName: 'UserName',
      AddUserName: 'Add username',
      Role: 'Role',
      RequestInstructor: 'Request to become an instructor',
      IsVerified: 'Verification status',
      DateOfBirth: 'Date of Birth',
      JoinDate: 'Join Date',
      EnrollmentCount: 'Enrollment Count',
      Save: 'Save Changes',
      Confirm: 'Confirm',
      ConfirmQuestion: 'Update your profile?'
    };

    const roleMapping = {
      1: 'Instructor',
      2: 'Learner',
      3: 'Admin'
    };

    const fetchProfile = async () => {
      try {
        const clientData = await getClientInfo(); 
        clientData.role = roleMapping[clientData.role] || 'Unknown';
        clientData.dateOfBirth = formatDate(clientData.dateOfBirth);
        clientData.creationTime = formatDate(clientData.creationTime);
        if (clientData.avatarUrl) {
          clientData.avatarUrl = getAvatarApiUrl(clientData.avatarUrl, clientData.id); 
        }
        Object.assign(form.value, clientData);
        loading.value = false; 
      } catch (error) {
        console.error('Error fetching client info:', error);
        alertMessage.value = 'Error fetching profile information.';
        loading.value = false;
      }
    };

    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0]; // YYYY-MM-DD format
    };

    const getAvatarApiUrl = (avatarUrl, userId) => {
      if (!avatarUrl || avatarUrl === '') return '/img/User_Empty.png'; // Default image path if not available
      return avatarUrl.startsWith('http')
        ? avatarUrl
        : `https://localhost:7277/api/Users/avatar/${userId}`; // Replace with actual base URL
    };


    const handleAvatarChange = event => {
      const file = event.target.files[0];
      if (file) {
        form.value.avatar = URL.createObjectURL(file);
      }
    };

    const triggerAvatarUpload = () => {
      const avatarInput = document.querySelector('input[type="file"]');
      avatarInput.click();
    };

    const openConfirmModal = () => {
      new bootstrap.Modal(document.getElementById('app-confirm-modal')).show();
    };

    const confirmChanges = async () => {
      try {
        const formData = new FormData();
        Object.keys(form.value).forEach(key => formData.append(key, form.value[key]));
        await updateUserProfile(formData);
        alertMessage.value = 'Profile updated successfully!';
      } catch (error) {
        console.error('Error updating profile:', error);
        alertMessage.value = 'Error updating profile.';
      }
    };

    const handleSubmit = event => {
      event.preventDefault();
      openConfirmModal();
    };

    onMounted(() => {
      fetchProfile();
    });

    return {
      form,
      text,
      loading,
      alertMessage,
      handleAvatarChange,
      triggerAvatarUpload,
      openConfirmModal,
      confirmChanges,
      handleSubmit
    };
  }
};
</script>

<style scoped>
@import '../../../public/assets/css/Profile/1643.ad151cd3.chunk.css';
@import '../../../public/assets/css/Profile/793.a40e2718.chunk.css';
@import '../../../public/assets/css/Profile/821.2ca926ad.chunk.css';
@import '../../../public/assets/css/Profile/8282.7278d4b3.chunk.css';
@import '../../../public/assets/css/Profile/main.16480feb.css';
@import '../../../public/assets/css/Profile/style.css';
@import '../../../public/assets/css/Profile/styleProfile.css';
</style>