<template>
  <div class="expense-list">
    <div v-if="!list.length" class="sponsor-empty">暂无支出记录</div>
    <div v-else class="sponsor-table-wrap">
      <table class="sponsor-table">
        <thead>
          <tr>
            <th style="width: 8%">序号</th>
            <th style="width: 52%">用途说明</th>
            <th style="width: 15%">金额</th>
            <th style="width: 25%">时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in list" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ (item.description ?? "—") }}</td>
            <td class="amount">¥{{ (item.amount ?? 0) }}</td>
            <td>{{ (item.date ?? "—") }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import expensesData from "../data/expenses.json";

interface Expense {
  description?: string;
  amount?: number;
  date?: string;
}

const raw = Array.isArray(expensesData) ? (expensesData as Expense[]) : [];

const list = computed(() =>
  [...raw].sort((a, b) => {
    const da = String(a.date ?? "").localeCompare(String(b.date ?? ""));
    return da > 0 ? -1 : da < 0 ? 1 : 0;
  })
);
</script>

<style scoped>
.expense-list {
  margin: 1rem 0 2rem;
}

.sponsor-empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

.sponsor-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background-color: var(--color-surface);
  box-shadow: 0 8px 20px rgba(8, 203, 0, 0.08);
}

.sponsor-table {
  width: 100%;
  min-width: 500px; /* 确保移动端可横向滚动，不挤压内容 */
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.sponsor-table th,
.sponsor-table td {
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
}

.sponsor-table th {
  font-weight: 600;
  color: var(--color-text-muted);
  background-color: var(--color-overlay);
}

.sponsor-table tr:last-child td {
  border-bottom: none;
}

.sponsor-table td {
  color: var(--color-text);
  word-break: break-word;
}

.sponsor-table .amount {
  font-weight: 600;
  color: var(--color-primary);
}

:global(.dark) .sponsor-table-wrap {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
}
</style>
