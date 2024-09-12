<template>
    <div class="Setting_pageWrapper__PM+M5">
      <section class="index-module_row__-AHgh">
        <section class="index-module_col__2EQm9 index-module_c-12__u7UXF index-module_m-12__2CxUL index-module_l-12__340Ve">
          <div class="Setting_wrapper__TX8z0">
            <div class="GroupField_wrapper__1-jfw">
              <!-- Alert Component -->
              <Alert v-if="alertMessage" :message="alertMessage" />
  
              <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
                <h2 class="GroupField_heading__PIaoN">{{ text.PersonalInfo }}</h2>
                
                <!-- Full Name Field -->
                <div class="FieldWrapper_wrapper__QcEfS">
                  <div class="InputField_fieldContent__iWttQ">
                    <h3 class="InputField_fieldContentLabel__wJO4a">{{ text.FullName }}</h3>
                    <div>
                      <div class="InputField_fieldContentEdit__KYEiF">
                        <input v-model="form.fullName" type="text" class="InputField_fieldContentInput__lO21W" maxlength="50" placeholder="Add your name" />
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
                        <input v-model="form.bio" type="text" class="InputField_fieldContentInput__lO21W" maxlength="900" placeholder="Add Bio" />
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
                      <input @change="handleAvatarChange" ref="avatarInput" type="file" class="invisible" accept=".jpg, .jpeg, .png" />
                    </div>
                  </div>
                </div>
                <div class="PhotoField_fieldBtn__TSg2A">
                  <div @click="triggerAvatarUpload" class="Button_fieldButton__B93oZ Button_fieldButtonDefault__7a6UD">{{ text.Edit }}</div>
                </div>
              </div>
                
                <!-- Email Field -->
                <div class="FieldWrapper_wrapper__QcEfS">
                  <div class="InputField_fieldContent__iWttQ">
                    <h3 class="InputField_fieldContentLabel__wJO4a">Email</h3>
                    <div>
                      <div class="InputField_fieldContentEdit__KYEiF">
                        <input type="text" class="InputField_fieldContentInput__lO21W" maxlength="50" disabled :value="form.email" />
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
                        <input type="text" class="InputField_fieldContentInput__lO21W" maxlength="50" placeholder="Add username" disabled :value="form.userName" />
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
                        <input type="text" class="InputField_fieldContentInput__lO21W" disabled :value="form.enrollmentCount" />
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
                        <input type="date" class="InputField_fieldContentInput__lO21W" disabled :value="form.joinDate" />
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
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import Alert from '@/components/Alert.vue'; 
  import { getUserProfile, updateUserProfile, getUserAvatar } from '@/services/userService'; 
  
  export default {
    components: {
        Alert
    },

    setup() {
        const store = useStore();
    
        const form = ref({
            fullName: '',
            bio: '',
            avatarUrl: '',
            email: '',
            userName: '',
            dateOfBirth: '',
            enrollmentCount: '',
            role: '',
            joinDate: ''
        });
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
  
        const fetchProfile = async () => {
            try {
                const userProfile = await getUserProfile(store.state.user.id);
                Object.assign(form.value, userProfile);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                alertMessage.value = 'Error fetching user profile.';
            }
        };

        const handleAvatarChange = event => {
            const file = event.target.files[0];
            if (file) {
                form.value.avatarUrl = URL.createObjectURL(file);
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
</style>
  