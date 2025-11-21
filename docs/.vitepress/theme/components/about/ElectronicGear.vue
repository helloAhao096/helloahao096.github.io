<template>
  <CyberSection title="Gear_List / EDC">
    <div class="gear-grid">
      <GearItem
        v-for="item in gear"
        :key="item.name"
        :name="item.name"
        :model="item.model"
        :icon="item.icon"
      />
    </div>
  </CyberSection>
</template>

<script lang="ts" setup>
import CyberSection from "./CyberSection.vue";
import GearItem from "./GearItem.vue";

interface Gear {
  name: string;
  model: string;
  icon?: string;
}

const gear: Gear[] = [
  { name: "MacBook Pro 14", model: "M3 Max / Silver", icon: "💻" },
  { name: "HHKB Hybrid", model: "Type-S / White", icon: "⌨️" },
  { name: "Sony A7C", model: "35mm f1.8", icon: "📷" },
  { name: "AirPods Max", model: "Space Gray", icon: "🎧" },
  { name: "iPhone 15 Pro", model: "Natural Titanium", icon: "📱" },
  { name: "Kindle Paperwhite", model: "Signature Ed.", icon: "📖" },
];
</script>

<style scoped>
.gear-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .gear-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

