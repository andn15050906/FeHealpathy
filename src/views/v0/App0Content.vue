<template>
    <!-- App0 Header -->
    <v-app-bar flat :color="appBarColor" class="px-2" elevation="1">
      <v-app-bar-title class="text-primary font-weight-bold">
        <v-icon color="primary" class="mr-2">mdi-heart-pulse</v-icon>
        Mental Health Roadmap
      </v-app-bar-title>
      <v-spacer></v-spacer>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text" :color="currentTheme === 'refreshing' ? 'primary' : currentTheme" class="mr-2">
            <v-icon left>mdi-palette</v-icon>
            <span class="d-none d-sm-flex">Theme: {{ formatThemeName(currentTheme) }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(theme, index) in availableThemes" :key="index" @click="setTheme(theme.value)">
            <template v-slot:prepend>
              <v-avatar :color="theme.value" size="small"></v-avatar>
            </template>
            <v-list-item-title>{{ theme.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      
      <v-btn color="primary" variant="outlined" class="mr-2" prepend-icon="mdi-clipboard-check" @click="startSurvey">
        Take Assessment
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-account" @click="showStatusPopup = true">
        Update Status
      </v-btn>
    </v-app-bar>
</template>