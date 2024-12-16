<template>
    <v-container id="user-profile" fluid tag="section">
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card class="v-card--material pa-3 v-card v-sheet theme--light v-card--material--has-heading">
                    <div class="v-application-custom">
                        <div
                            class="text-start v-card--material__heading mb-n6 v-sheet theme--dark elevation-6 success pa-7">
                            <!--If current user => Personal Profile-->
                            <h4 class="white-text">View Profile</h4>
                        </div>
                    </div>
                    <v-form>
                        <v-container class="py-0">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Full Name" v-model="UserProfile.UserInfo.FullName"
                                        maxlength="50" readonly class="purple-input" persistent-placeholder />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Email Address" v-model="UserProfile.UserInfo.Email"
                                        type="email" maxlength="50" readonly class="purple-input"
                                        persistent-placeholder />
                                </v-col>
                            </v-row>
                            <v-row>
                                <!--Hidden if not current user-->
                                <v-col cols="12" md="6">
                                    <v-text-field label="User Name" v-model="UserProfile.UserInfo.UserName"
                                        maxlength="50" readonly class="purple-input" persistent-placeholder />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Date of Birth" v-model="UserProfile_UserInfo_DateOfBirth"
                                        readonly type="date" class="purple-input" persistent-placeholder />
                                </v-col></v-row>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Join Date" v-model="UserProfile_UserInfo_JoinDate" type="date"
                                        readonly class="purple-input" persistent-placeholder />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Enrollment Count"
                                        v-model="UserProfile.UserInfo.EnrollmentCount" type="number" readonly
                                        class="purple-input" value="1231" persistent-placeholder />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-textarea label="About Me" v-model="UserProfile.UserInfo.Description" readonly
                                        maxlength="1000" class="purple-input" persistent-placeholder />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card class="v-card-profile"
                    avatar="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg">
                    <v-card-text class="text-center">
                        <div class="v-avatar">
                            <img :src="UserProfile.UserInfo.Avatar" alt="User Avatar" id="app-avatar-img" class="img">
                        </div>
                        <!--Hidden if not current user-->
                        <h6 class="mb-1 grey--text">{{ UserProfile.UserInfo.Role }}</h6>
                        <h4 class="mb-3 black--text">{{ UserProfile.UserInfo.UserName }}</h4>
                        <h6 class="font-weight-light grey--text">{{ UserProfile.UserInfo.Description }}</h6>
                        <h6 class="font-weight-light grey--text">{{ UserProfile.UserInfo.CreatedAt }}</h6>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import data from '../../api/data.json';
import { ConvertTo_yyyy_mm_dd } from '../../helpers/common';

export default {
    data() {
        return {
            UserProfile: data.UserProfile,
            UserProfile_UserInfo_DateOfBirth: ConvertTo_yyyy_mm_dd(new Date(data.UserProfile.DateOfBirth)),
            UserProfile_UserInfo_JoinDate: ConvertTo_yyyy_mm_dd(new Date(data.UserProfile.JoinDate))
        }
    }
}
</script>

<style>
@import '../../assets/css/vuetify-custom/v-application.css';
@import '../../assets/css/vuetify-custom/v-app.css';
@import '../../assets/css/vuetify-custom/v-app-vendor.css';
@import '../../assets/css/vuetify-custom/chunk-7e72fb0e.a9a7c615.css';

.white-text {
    color: #fff;
}

.v-card--material {
    overflow: visible;
}

.v-avatar {
    height: 128px;
    width: 128px;
}

.sub-footer {
    position: relative;
    top: -20px;
}
</style>