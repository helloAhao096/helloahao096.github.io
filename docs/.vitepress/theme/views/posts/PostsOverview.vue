<template>
  <PageContainer>
    <section class="overview-hero">
      <p class="eyebrow">Posts Overview</p>
      <h1 class="overview-title">所有博文，一次看全</h1>
      <p class="overview-description">
        按年份整理的文章档案，支持标签快速筛选，方便你以不同主题回顾内容。
      </p>

      <div class="tag-filter" v-if="allTags.length">
        <button
          class="tag-chip"
          :class="{ active: !activeTag }"
          :aria-pressed="!activeTag"
          @click="resetFilter"
        >
          全部
        </button>
        <button
          v-for="tag in allTags"
          :key="tag"
          class="tag-chip"
          :class="{ active: activeTag === tag }"
          :aria-pressed="activeTag === tag"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>
      </div>

      <div class="filter-summary">
        <span>当前标签：{{ activeTagLabel }}</span>
        <span>匹配文章：{{ filteredCount }} 篇</span>
      </div>
    </section>

    <section v-if="yearGroups.length" class="year-groups">
      <article
        v-for="group in yearGroups"
        :key="group.year"
        class="year-section"
      >
        <header class="year-divider">
          <span class="year-watermark">{{ group.year }}</span>
          <div class="year-heading">
            <span class="year-label">{{ group.year }}</span>
            <span class="year-count">{{ group.posts.length }} 篇</span>
          </div>
          <div class="year-line" />
        </header>

        <div class="year-posts">
          <PostCard
            v-for="post in group.posts"
            :key="post.regularPath"
            :post="post"
          />
        </div>
      </article>
    </section>

    <section v-else class="empty-state">
      <p>当前标签下没有找到文章。</p>
      <button class="tag-chip reset" type="button" @click="resetFilter">
        重置筛选
      </button>
    </section>
  </PageContainer>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useData } from "vitepress";
import PageContainer from "../../components/layout/PageContainer.vue";
import PostCard from "../../components/post/PostCard.vue";
import type { Post } from "../../types";
import { dateToTimestamp } from "../../utils/date";

const { theme } = useData();

const posts = computed<Post[]>(() => {
  const rawPosts = (theme.value.posts || []) as Post[];
  return rawPosts.filter((post) => !post.regularPath.endsWith("/index.html"));
});

const activeTag = ref<string | null>(null);

// 从 URL 查询参数读取标签
const initTagFromQuery = () => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const tagParam = params.get("tag");
    if (tagParam) {
      activeTag.value = decodeURIComponent(tagParam);
    } else {
      activeTag.value = null;
    }
  }
};

onMounted(() => {
  initTagFromQuery();
  // 监听浏览器前进后退
  window.addEventListener("popstate", initTagFromQuery);
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("popstate", initTagFromQuery);
  }
});

const allTags = computed(() => {
  const tagSet = new Set<string>();
  posts.value.forEach((post) => {
    const tags = Array.isArray(post.frontMatter.tags)
      ? post.frontMatter.tags
      : [];
    tags.forEach((tag) => {
      if (tag) {
        tagSet.add(tag);
      }
    });
  });
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b, "zh-CN"));
});

const filteredPosts = computed(() => {
  if (!activeTag.value) {
    return posts.value;
  }
  return posts.value.filter((post) => {
    const tags = Array.isArray(post.frontMatter.tags)
      ? post.frontMatter.tags
      : [];
    return tags.includes(activeTag.value!);
  });
});

const filteredCount = computed(() => filteredPosts.value.length);

const yearGroups = computed(() => {
  const buckets: Record<string, Post[]> = {};
  filteredPosts.value.forEach((post) => {
    const year = extractYear(post.frontMatter.date);
    if (!buckets[year]) {
      buckets[year] = [];
    }
    buckets[year].push(post);
  });

  return Object.keys(buckets)
    .sort(compareYear)
    .map((year) => ({
      year,
      posts: buckets[year]
        .slice()
        .sort(
          (a, b) =>
            dateToTimestamp(b.frontMatter.date) -
            dateToTimestamp(a.frontMatter.date)
        ),
    }));
});

const activeTagLabel = computed(() => activeTag.value || "全部");

const resetFilter = () => {
  activeTag.value = null;
  updateURL(null);
};

const toggleTag = (tag: string) => {
  const newTag = activeTag.value === tag ? null : tag;
  activeTag.value = newTag;
  updateURL(newTag);
};

// 更新 URL 查询参数
const updateURL = (tag: string | null) => {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    if (tag) {
      url.searchParams.set("tag", tag);
    } else {
      url.searchParams.delete("tag");
    }
    window.history.replaceState({}, "", url.toString());
  }
};

const extractYear = (date?: string) => {
  if (!date) {
    return "未分类";
  }
  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? "未分类" : `${year}`;
};

const compareYear = (a: string, b: string) => {
  const aNum = Number(a);
  const bNum = Number(b);
  const aValid = Number.isFinite(aNum);
  const bValid = Number.isFinite(bNum);

  if (aValid && bValid) {
    return bNum - aNum;
  }
  if (aValid) {
    return -1;
  }
  if (bValid) {
    return 1;
  }
  return b.localeCompare(a, "zh-CN");
};
</script>

<style scoped>
.overview-hero {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.overview-title {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0;
  color: var(--color-text);
}

.overview-description {
  max-width: 720px;
  color: var(--color-text-soft);
  line-height: 1.7;
  margin: 0;
}

.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-chip {
  padding: 0.4rem 0.9rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.tag-chip.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-bg);
}

.tag-chip.reset {
  margin-top: 1rem;
}

.filter-summary {
  display: flex;
  gap: 1.5rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.year-groups {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.year-section {
  position: relative;
}

.year-divider {
  position: relative;
  padding: 2.5rem 0 1rem;
}

.year-watermark {
  position: absolute;
  left: -3rem;
  top: -1.5rem;
  font-size: clamp(3rem, 14vw, 8rem);
  font-weight: 700;
  color: transparent;
  -webkit-text-stroke-width: 2.5px !important;
  -webkit-text-stroke-color: var(--color-watermark-stroke) !important;
  pointer-events: none;
  user-select: none;
  transition: -webkit-text-stroke-color 0.3s ease;
}

.year-heading {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  position: relative;
}

.year-label {
  font-size: clamp(2.5rem, 6vw, 3.25rem);
  font-weight: 600;
  color: var(--color-text);
}

.year-count {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.year-line {
  width: 100%;
  height: 1px;
  background: var(--color-border);
  margin-top: 1rem;
}

.year-posts {
  display: flex;
  flex-direction: column;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--color-text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 768px) {
  .overview-hero {
    margin-bottom: 2rem;
  }

  .tag-filter {
    gap: 0.35rem;
  }

  .filter-summary {
    flex-direction: column;
    gap: 0.35rem;
  }

  .year-divider {
    padding-top: 2rem;
  }

  .year-watermark {
    left: -1rem;
    font-size: clamp(2.5rem, 24vw, 5rem);
  }
}
</style>

