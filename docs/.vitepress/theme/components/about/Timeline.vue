<template>
  <div class="timeline">
    <h3 class="timeline-title">Timeline</h3>
    <div class="timeline-list">
      <div
        v-for="(item, index) in timeline"
        :key="index"
        class="timeline-item"
      >
        <div class="timeline-year">{{ item.year }}</div>
        <div class="timeline-content">
          <div class="timeline-dot"></div>
          <div class="timeline-line" v-if="index < timeline.length - 1"></div>
          <div class="timeline-text">
            <h4 class="timeline-event-title">{{ item.title }}</h4>
            <p class="timeline-event-desc" v-if="item.description">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface TimelineItem {
  year: string;
  title: string;
  description?: string;
}

interface Props {
  timeline?: TimelineItem[];
}

withDefaults(defineProps<Props>(), {
  timeline: () => [
    { year: "2024", title: "开始写博客", description: "记录学习和思考" },
    { year: "2023", title: "项目开发", description: "持续学习和实践" },
  ],
});
</script>

<style scoped>
.timeline {
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--color-surface);
  border: 4px solid var(--color-border);
  box-shadow: 6px 6px var(--color-primary);
  border-radius: var(--radius-card);
}

.timeline-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 2rem 0;
  text-align: center;
  font-family: var(--font-sans);
}

.timeline-list {
  max-width: 700px;
  margin: 0 auto;
  position: relative;
}

.timeline-item {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-year {
  min-width: 80px;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
  text-align: right;
  padding-top: 0.25rem;
}

.timeline-content {
  flex: 1;
  position: relative;
  padding-left: 1.5rem;
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 3px solid var(--color-bg);
  box-shadow: 0 0 0 2px var(--color-primary);
}

.timeline-line {
  position: absolute;
  left: 5px;
  top: 1.5rem;
  width: 2px;
  height: calc(100% + 1rem);
  background: var(--color-border);
}

.timeline-item:last-child .timeline-line {
  display: none;
}

.timeline-text {
  padding-top: 0.25rem;
}

.timeline-event-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 0.5rem 0;
  font-family: var(--font-sans);
}

.timeline-event-desc {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  margin: 0;
  line-height: 1.6;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .timeline {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .timeline-title {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
  
  .timeline-item {
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  
  .timeline-year {
    min-width: auto;
    text-align: left;
    font-size: 0.9rem;
  }
  
  .timeline-content {
    padding-left: 1.25rem;
  }
  
  .timeline-dot {
    top: 0.25rem;
    width: 10px;
    height: 10px;
  }
  
  .timeline-line {
    left: 4px;
    top: 1.25rem;
  }
  
  .timeline-event-title {
    font-size: 1rem;
  }
  
  .timeline-event-desc {
    font-size: 0.85rem;
  }
}
</style>

