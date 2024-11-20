<template>
  <div class="app-container">
    <nav class="navbar">
      <router-link to="/" class="nav-link" :class="{ active: isActive('/') }">{{ $t('nav.currency_conversion') }}</router-link>
      <router-link to="/time-series" class="nav-link" :class="{ active: isActive('/time-series') }">{{ $t('nav.currency_time_series') }}</router-link>
      <router-link to="/history" class="nav-link" :class="{ active: isActive('/history') }">{{ $t('nav.conversion_history') }}</router-link>

      
      <select class="language-select" v-model="selectedLanguage" @change="changeLanguage">
        <option value="en">English</option>
        <option value="tr">Türkçe</option>
      </select>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {ref} from "vue";

const route = useRoute();
const {locale} = useI18n();

const isActive = (path) => {
  return route.path === path;
};

const selectedLanguage = ref(locale.value);

const changeLanguage = () => {
  locale.value = selectedLanguage.value;
};
</script>

