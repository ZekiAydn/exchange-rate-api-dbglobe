<template>
  <div class="app-container">
    <nav class="navbar">
      <Menubar class="navbar-container" :model="menuItems" />
      <div class="navbar-right flex items-center space-x-4">
        <button class="theme-toggle-button" @click="toggleTheme">
          <span v-if="isDarkMode">🌙</span>
          <span v-else>🌞</span>
        </button>
        <select
            class="language-select border-none"
            v-model="selectedLanguage"
            @change="changeLanguage"
        >
          <option value="en">English</option>
          <option value="tr">Türkçe</option>
        </select>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import {ref, watch, onMounted, computed} from "vue";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import Menubar from "primevue/menubar";
import router from "@/router.js";

const {t,locale} = useI18n();
const route = useRoute();
const activePath = ref(route.path);
const selectedLanguage = ref(locale.value);

const changeLanguage = () => {
  locale.value = selectedLanguage.value;
};

const isDarkMode = ref(false);

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.setAttribute(
      "data-theme",
      isDarkMode.value ? "dark" : "light"
  );
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme") || "light";
  isDarkMode.value = savedTheme === "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
});

watch(isDarkMode, (newVal) => {
  localStorage.setItem("theme", newVal ? "dark" : "light");
});

watch(
    () => route.path,
    (newPath) => {
      activePath.value = newPath;
    }
);


const menuItems = computed(() => [
  {
    label: t('nav.currency_conversion'),
    icon: "pi pi-home",
    command: () => router.push("/"),
  },
  {
    label: t('nav.currency_time_series'),
    icon: "pi pi-clock",
    command: () => router.push("/time-series"),
  },
  {
    label: t('nav.conversion_history'),
    icon: "pi pi-history",
    command: () => router.push("/history"),
  }
]);

</script>

