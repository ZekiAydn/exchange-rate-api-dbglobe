<template>
  <div class="app-container">
    <nav class="navbar">
      <router-link to="/" class="nav-link" :class="{ active: isActive('/') }">{{ $t('nav.currency_conversion') }}</router-link>
      <router-link to="/time-series" class="nav-link" :class="{ active: isActive('/time-series') }">{{ $t('nav.currency_time_series') }}</router-link>
      <router-link to="/history" class="nav-link" :class="{ active: isActive('/history') }">{{ $t('nav.conversion_history') }}</router-link>


    </nav>
    <div class="navbar-right">
      <button class="theme-toggle-button" @click="toggleTheme">
        <span v-if="isDarkMode">🌙</span>
        <span v-else>🌞</span>
      </button>

    <select class="language-select" v-model="selectedLanguage" @change="changeLanguage">
      <option value="en">English</option>
      <option value="tr">Türkçe</option>
    </select>
    </div>
    <router-view />
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {onMounted, ref, watch} from "vue";

const route = useRoute();
const {locale} = useI18n();

const isActive = (path) => {
  return route.path === path;
};

const selectedLanguage = ref(locale.value);

const changeLanguage = () => {
  locale.value = selectedLanguage.value;
};


const isDarkMode = ref(false);

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light');
};
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  isDarkMode.value = savedTheme === 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
});

watch(isDarkMode, (newVal) => {
  localStorage.setItem('theme', newVal ? 'dark' : 'light');
});
</script>

