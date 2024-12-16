<template>
    <!--Layout: ProfileLayout-->
    <!--Title: ChangePassword-->
    <div class="Setting_pageWrapper__PM+M5">
        <section class="index-module_row__-AHgh">
            <section
                class="index-module_col__2EQm9 index-module_c-12__u7UXF index-module_m-12__2CxUL index-module_l-12__340Ve">
                <div class="Setting_wrapper__TX8z0">
                    <div class="GroupField_wrapper__1-jfw">
                        <!--Alert-->
                        <form method="post">
                            <h2 class="GroupField_heading__PIaoN">{{ "Change Password" }}</h2>

                            <div class="FieldWrapper_wrapper__QcEfS">
                                <div class="InputField_fieldContent__iWttQ">
                                    <h3 class="InputField_fieldContentLabel__wJO4a">{{ "Current Password" }}</h3>
                                    <div>
                                        <div class="InputField_fieldContentEdit__KYEiF">
                                            <input id="currentPassInp" asp-for="CurrentPassword" type="password"
                                                class="InputField_fieldContentInput__lO21W" maxlength="50">
                                            <span class="text-danger" asp-validation-for="CurrentPassword"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="FieldWrapper_wrapper__QcEfS">
                                <div class="InputField_fieldContent__iWttQ">
                                    <h3 class="InputField_fieldContentLabel__wJO4a">{{ "NewPassword" }}</h3>
                                    <div>
                                        <div class="InputField_fieldContentEdit__KYEiF">
                                            <input id="newPassInp" asp-for="NewPassword" type="password"
                                                class="InputField_fieldContentInput__lO21W" maxlength="50">
                                            <span class="text-danger" asp-validation-for="NewPassword"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="FieldWrapper_wrapper__QcEfS">
                                <div class="InputField_fieldContent__iWttQ">
                                    <h3 class="InputField_fieldContentLabel__wJO4a">{{ "RePassword" }}</h3>
                                    <div>
                                        <div class="InputField_fieldContentEdit__KYEiF">
                                            <input id="rePassInp" asp-for="RePassword" type="password"
                                                class="InputField_fieldContentInput__lO21W" maxlength="50">
                                            <span class="text-danger" asp-validation-for="RePassword"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div id="app-open-confirm-btn" class="InputField_fieldBtn__OG6ZB">
                                    <button type="submit"
                                        class="Button_fieldButton__B93oZ Button_fieldButtonDefault__7a6UD">
                                        {{ 'Change Password' }}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </section>
    </div>
</template>
<script>
import { inject } from 'vue'

const sweetAlert = inject('sweetAlert')

sweetAlert.showSuccess("Changed Password Successfully!");
</script>