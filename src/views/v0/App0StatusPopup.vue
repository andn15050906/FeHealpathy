<template>
    
    <v-dialog v-model="showStatusPopup" max-width="500px" transition="dialog-bottom-transition">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>How are you feeling today?</span>
          <v-btn icon @click="showStatusPopup = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <p class="text-body-2 mb-6">
            Your responses help us personalize your roadmap and provide relevant resources.
          </p>

          <v-container>
            <v-row>
              <v-col cols="12">
                <p class="text-subtitle-2 mb-2">Overall mood today:</p>
                <v-btn-toggle v-model="selectedMood" mandatory divided color="primary" class="d-flex">
                  <v-btn v-for="(mood, index) in moods" :key="index" :value="mood.value" class="flex-grow-1">
                    {{ mood.label }}
                  </v-btn>
                </v-btn-toggle>
              </v-col>

              <v-col cols="12" class="mt-4">
                <p class="text-subtitle-2 mb-2">What challenges are you facing? (Select all that apply)</p>
                <v-checkbox v-for="(challenge, index) in challenges" :key="index" v-model="selectedChallenges"
                  :label="challenge" :value="challenge" color="primary" hide-details class="mb-1"></v-checkbox>
              </v-col>

              <v-col cols="12" class="mt-4">
                <p class="text-subtitle-2 mb-2">Any additional notes about how you're feeling:</p>
                <v-textarea v-model="statusNotes" placeholder="Share any thoughts or feelings..." rows="3"
                  variant="outlined"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showStatusPopup = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="submitStatus">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>