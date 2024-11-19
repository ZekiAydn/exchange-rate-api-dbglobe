<template>
  <div class="app-container">
    <nav class="navbar">
      <router-link to="/" class="nav-link" :class="{ active: isActive('/') }">Currency Conversion</router-link>
      <router-link to="/time-series" class="nav-link" :class="{ active: isActive('/time-series') }">Currency Time Series</router-link>
      <router-link to="/history" class="nav-link" :class="{ active: isActive('/history') }">Conversion History</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

// Aktif rotayı kontrol eden fonksiyon
const isActive = (path) => {
  return route.path === path;
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c3e50;
  padding: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: #ecf0f1;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease, background-color 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.nav-link:hover {
  color: #ffffff;
  background-color: #34495e;
}

.nav-link.active {
  background-color: #1abc9c;
  color: #ffffff;
}

.nav-link:not(.active):hover {
  background-color: #34495e;
}

</style>
