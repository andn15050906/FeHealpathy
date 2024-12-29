<template>
    <div class="container profile-setting-up">
        <h2>Profile Settings</h2>
        <form @submit.prevent="submitForm">
            <div class="row mb-3">
                <div class="col">
                    <label for="age" class="form-label">Age:</label>
                    <input
                        type="number"
                        id="age"
                        v-model="profile.age"
                        class="form-control"
                        :class="{ 'is-invalid': errors.age }"
                    />
                    <div v-if="errors.age" class="invalid-feedback">{{ errors.age }}</div>
                </div>
                <div class="col">
                    <label for="gender" class="form-label">Gender:</label>
                    <select
                        id="gender"
                        v-model="profile.gender"
                        class="form-select"
                        :class="{ 'is-invalid': errors.gender }"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <div v-if="errors.gender" class="invalid-feedback">{{ errors.gender }}</div>
                </div>
            </div>
            <div class="mb-3">
                <label for="occupation" class="form-label">Occupation:</label>
                <select
                    id="occupation"
                    v-model="profile.occupation"
                    class="form-select"
                    :class="{ 'is-invalid': errors.occupation }"
                >
                    <option value="student">Student</option>
                    <option value="employed">Employed</option>
                    <option value="senior">Senior</option>
                </select>
                <div v-if="errors.occupation" class="invalid-feedback">{{ errors.occupation }}</div>
            </div>
            <div class="mb-3">
                <label for="important" class="form-label">What is important to you:</label>
                <select
                    id="important"
                    v-model="profile.important"
                    class="form-select"
                    :class="{ 'is-invalid': errors.important }"
                    @change="checkOther('important')"
                >
                    <option value="family">Family</option>
                    <option value="career">Career</option>
                    <option value="health">Health</option>
                    <option value="other">Other</option>
                </select>
                <input
                    v-if="profile.important === 'other'"
                    type="text"
                    id="importantOther"
                    v-model="profile.importantOther"
                    placeholder="Please specify"
                    class="form-control mt-2"
                    :class="{ 'is-invalid': errors.importantOther }"
                />
                <div v-if="errors.importantOther" class="invalid-feedback">{{ errors.importantOther }}</div>
            </div>
            <div class="mb-3">
                <label for="interest" class="form-label">Interests:</label>
                <select
                    id="interest"
                    v-model="profile.interest"
                    class="form-select"
                    :class="{ 'is-invalid': errors.interest }"
                    @change="checkOther('interest')"
                >
                    <option value="sports">Sports</option>
                    <option value="music">Music</option>
                    <option value="travel">Travel</option>
                    <option value="other">Other</option>
                </select>
                <input
                    v-if="profile.interest === 'other'"
                    type="text"
                    id="interestOther"
                    v-model="profile.interestOther"
                    placeholder="Please specify"
                    class="form-control mt-2"
                    :class="{ 'is-invalid': errors.interestOther }"
                />
                <div v-if="errors.interestOther" class="invalid-feedback">{{ errors.interestOther }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label">Select a Partner:</label>
                <div class="row text-center justify-content-center">
                    <div class="col-auto" v-for="option in ['a', 'b', 'c', 'd']" :key="option">
                        <button
                            type="button"
                            class="btn rounded-circle partner-button"
                            :class="{ 'selected': profile.partner === option }"
                            @click="selectPartner(option)"
                        >
                            <i>{{ option.toUpperCase() }}</i><br />
                        </button>
                    </div>
                </div>
                <div v-if="errors.partner" class="text-danger">{{ errors.partner }}</div>
            </div>
            <button type="submit" class="btn btn-primary" style="color: white;">Submit</button>
        </form>
    </div>
</template>

<script setup>
import { reactive } from 'vue';

const profile = reactive({
    age: '',
    gender: '',
    occupation: '',
    important: '',
    importantOther: '',
    interest: '',
    interestOther: '',
    partner: '',
    groupName: '',
});

const errors = reactive({
    age: '',
    gender: '',
    occupation: '',
    important: '',
    importantOther: '',
    interest: '',
    interestOther: '',
    partner: '',
    groupName: '',
});

const required = (field) => [(val) => !!val || `Please specify your ${field}.`];

const rules = {
    age: [(val) => val > 0 || 'Age must be greater than 0.'],
    gender: required('gender'),
    occupation: required('occupation'),
    important: required('important thing'),
    importantOther: required('important thing'),
    interest: required('interest'),
    interestOther: required('interest'),
    partner: required('partner'),
};


function validateField(value, fieldRules) {
    for (const rule of fieldRules) {
        const result = rule(value);
        if (result !== true) {
            return result;
        }
    }
    return '';
}

function validateAllFields() {
    for (const field in rules) {
        errors[field] = validateField(profile[field], rules[field]);
    }
}

function submitForm() {
    validateAllFields();
    if (Object.values(errors).some((error) => error)) {
        return;
    }
}

function checkOther(field) {
    if (profile[field] !== 'other') {
        profile[`${field}Other`] = '';
    }
}

function selectPartner(partner) {
    profile.partner = partner;
}
</script>

<style scoped>
.profile-setting-up {
    max-width: 90%;
    margin: 0 auto;
}

.partner-button {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    border: 2px solid blue;
    background-color: white;
    color: blue;
}

.partner-button.selected {
    background-color: blue;
    color: white;
    opacity: 1;
}

.partner-button:not(.selected) {
    opacity: 0.5;
}

.is-invalid {
    border-color: red;
}

.invalid-feedback {
    color: red;
    font-size: 0.875rem;
}
</style>
