<template>
    <div>
        <h1>Survey Management</h1>

        <form @submit.prevent="createSurvey">
            <div>
                <label for="name">Name:</label>
                <v-text-field v-model="survey.name" id="name" type="text" required />
            </div>

            <div>
                <label for="description">Description:</label>
                <v-textarea v-model="survey.description" id="description"></v-textarea>
            </div>

            <div>
                <h3>Questions</h3>
                <div v-for="(question, index) in survey.questions" :key="index">
                    <label :for="`question-${index}`">Question {{ index + 1 }}:</label>
                    <v-text-field v-model="question.content" :id="`question-${index}`" type="text" required />
                    <label :for="`explanation-${index}`">Explanation:</label>
                    <v-textarea v-model="question.explanation" :id="`explanation-${index}`"></v-textarea>
                    <h4>Answers</h4>
                    <div v-for="(answer, aIndex) in question.answers" :key="`answer-${index}-${aIndex}`">
                        <label :for="`answer-${index}-${aIndex}`">Answer {{ aIndex + 1 }}:</label>
                        <v-text-field v-model="answer.content" :id="`answer-${index}-${aIndex}`" type="text" required />
                    </div>
                    <v-btn type="v-btn" @click="addAnswer(index)">Add Answer</v-btn>
                </div>
                <v-btn type="v-btn" @click="addQuestion">Add Question</v-btn>
            </div>

            <div>
                <v-btn type="submit">Create Survey</v-btn>
            </div>
        </form>

        <h2>Surveys</h2>
        <ul>
            <li v-for="survey in surveys" :key="survey.id">
                <strong>{{ survey.name }}</strong> - {{ survey.description }}
                <div v-for="(question, qIndex) in survey.questions" :key="qIndex">
                    <p>Question {{ qIndex + 1 }}: {{ question.content }}</p>
                    <p>Explanation: {{ question.explanation }}</p>
                    <ul>
                        <li v-for="(answer, aIndex) in question.answers" :key="aIndex">
                            Answer {{ aIndex + 1 }}: {{ answer.content }}
                        </li>
                    </ul>
                </div>
                <v-btn @click="editSurvey(survey)">Edit</v-btn>
                <v-btn @click="deleteSurvey(survey.id)">Delete</v-btn>
            </li>
        </ul>

        <div v-if="editingSurvey">
            <h2>Edit Survey</h2>
            <form @submit.prevent="updateSurvey">
                <div>
                    <label for="editName">Name:</label>
                    <v-text-field v-model="editingSurvey.name" id="editName" type="text" required />
                </div>

                <div>
                    <label for="editDescription">Description:</label>
                    <v-textarea v-model="editingSurvey.description" id="editDescription"></v-textarea>
                </div>
                <h3>Questions</h3>

                <div v-for="(question, index) in editingSurvey.questions" :key="index">
                    <label :for="`edit-question-${index}`">Question {{ index + 1 }}:</label>

                    <v-text-field v-model="question.content" :id="`edit-question-${index}`" type="text" required />

                    <label :for="`edit-explanation-${index}`">Explanation:</label>

                    <v-textarea v-model="question.explanation" :id="`edit-explanation-${index}`"></v-textarea>

                    <h4>Answers</h4>

                    <div v-for="(answer, aIndex) in question.answers" :key="`edit-answer-${index}-${aIndex}`">
                        <label :for="`edit-answer-${index}-${aIndex}`">Answer {{ aIndex + 1 }}:</label>
                        <v-text-field v-model="answer.content" :id="`edit-answer-${index}-${aIndex}`" type="text"
                            required />
                    </div>
                </div>
                <div>
                    <v-btn type="submit">Save Changes</v-btn>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { get, post, patch, del } from "@/scripts/api/apiClients";

export default {
    data() {
        return {
            survey: {
                name: "",
                description: "",
                questions: [
                    {
                        content: "",
                        explanation: "",
                        answers: [
                            { content: "" },
                            { content: "" },
                        ],
                    },
                ],
            },
            surveys: [],
            editingSurvey: null,
            preEditSurvey: null
        };
    },
    methods: {
        async fetchSurveys() {
            try {
                // modified
                this.surveys = (await get("/surveys")).items;
                if (this.surveys.length > 0) {
                    this.editSurvey(this.surveys[0]);
                }
            } catch (error) {
                console.error("Error fetching surveys", error);
            }
        },
        async createSurvey() {
            try {
                await post("/surveys", this.survey);
                this.survey = {
                    name: "",
                    description: "",
                    questions: [
                        {
                            content: "",
                            explanation: "",
                            answers: [
                                { content: "" },
                                { content: "" },
                            ],
                        },
                    ],
                };
                this.fetchSurveys();
            } catch (error) {
                console.error("Error creating survey", error);
            }
        },
        addQuestion() {
            this.survey.questions.push({
                content: "",
                explanation: "",
                answers: [
                    { content: "" },
                    { content: "" },
                ],
            });
        },
        addAnswer(questionIndex) {
            this.survey.questions[questionIndex].answers.push({ content: "" });
        },
        editSurvey(survey) {
            this.editingSurvey = { ...survey };
            // modified
            this.preEditSurvey = JSON.parse(JSON.stringify(this.editingSurvey))
        },
        async updateSurvey() {
            try {
                //modified
                let removedPredicate = item => !this.editingSurvey.questions.map(q => q.id).includes(item.id);
                let addedPredicate = item => !this.preEditSurvey.questions.map(q => q.id).includes(item.id);
                let removedQuestions = this.preEditSurvey.questions.filter(removedPredicate);
                let addedQuestions = this.editingSurvey.questions.filter(addedPredicate);

                this.editingSurvey.removedQuestions = removedQuestions.map(item => item.id);
                this.editingSurvey.addedQuestions = addedQuestions.map(item => {
                    return {
                        SurveyId: this.editingSurvey.id,
                        Content: item.content,
                        Explanation: '',
                        Answers: item.answers.map(answer => { return new { Content: answer.content } })
                    }
                });

                await patch(`/surveys`, this.editingSurvey);
                this.editingSurvey = null;
                this.fetchSurveys();
            } catch (error) {
                console.error("Error updating survey", error);
            }
        },
        async deleteSurvey(id) {
            try {
                await del(`/surveys/${id}`);
                this.fetchSurveys();
            } catch (error) {
                console.error("Error deleting survey", error);
            }
        },
    },
    mounted() {
        this.fetchSurveys();
    },
};
</script>

<style scoped>
form {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
}

input,
textarea {
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.5rem;
}

v-btn {
    margin-right: 0.5rem;
}
</style>