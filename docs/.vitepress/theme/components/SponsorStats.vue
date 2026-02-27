<template>
  <div class="sponsor-stats">
    <div class="sponsor-stat-card">
      <p class="sponsor-stat-label">总收入</p>
      <p class="sponsor-stat-value">¥{{ totalIncome }}</p>
    </div>
    <div class="sponsor-stat-card">
      <p class="sponsor-stat-label">总支出</p>
      <p class="sponsor-stat-value">¥{{ totalExpense }}</p>
    </div>
    <div class="sponsor-stat-card">
      <p class="sponsor-stat-label">结余</p>
      <p class="sponsor-stat-value">¥{{ balance }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import sponsorsData from "../../sponsor/sponsors.json";
import expensesData from "../../sponsor/expenses.json";

const sponsors = Array.isArray(sponsorsData) ? sponsorsData : [];
const expenses = Array.isArray(expensesData) ? expensesData : [];

const totalIncome = computed(() =>
  sponsors.reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
);

const totalExpense = computed(() =>
  expenses.reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
);

const balance = computed(() => totalIncome.value - totalExpense.value);
</script>

<style scoped>
.sponsor-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0 2rem;
  justify-content: center;
}

.sponsor-stat-card {
  flex: 1 1 140px;
  min-width: 120px;
  max-width: 200px;
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  text-align: center;
  background-color: var(--color-surface);
  box-shadow: 0 8px 20px rgba(8, 203, 0, 0.08);
}

.sponsor-stat-label {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.sponsor-stat-value {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--color-primary);
}

:global(.dark) .sponsor-stat-card {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
}
</style>
