<template>
  <nav v-if="hasNav" class="post-pager" aria-label="文章翻页导航">
    <a
      v-if="prevLink"
      class="pager-link prev"
      :href="withBase(prevLink.link)"
      rel="prev"
    >
      <span class="label">上一篇</span>
      <span class="title">{{ prevLink.text }}</span>
    </a>

    <a
      v-if="nextLink"
      class="pager-link next"
      :href="withBase(nextLink.link)"
      rel="next"
    >
      <span class="label">下一篇</span>
      <span class="title">{{ nextLink.text }}</span>
    </a>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import type { Post } from "../../types";

interface PagerLink {
  text: string;
  link: string;
}

type FrontmatterNav = string | false | { text?: string; link?: string };

const { page, theme } = useData();

const frontmatter = computed(() => page.value.frontmatter as {
  prev?: FrontmatterNav;
  next?: FrontmatterNav;
});

const allPosts = computed<Post[]>(() => {
  const posts = (theme.value.posts || []) as Post[];
  return posts.filter((item) => item.regularPath.includes("/posts/"));
});

const currentPath = computed(() =>
  normalizePath(`/${page.value.relativePath || ""}`)
);

const currentIndex = computed(() =>
  allPosts.value.findIndex(
    (post) => normalizePath(post.regularPath) === currentPath.value
  )
);

const fallbackPrev = computed<PagerLink | null>(() => {
  if (currentIndex.value <= 0) return null;
  return mapPostToLink(allPosts.value[currentIndex.value - 1]);
});

const fallbackNext = computed<PagerLink | null>(() => {
  if (currentIndex.value === -1) return null;
  if (currentIndex.value >= allPosts.value.length - 1) return null;
  return mapPostToLink(allPosts.value[currentIndex.value + 1]);
});

const prevLink = computed(() =>
  resolveLink(frontmatter.value.prev, fallbackPrev.value)
);
const nextLink = computed(() =>
  resolveLink(frontmatter.value.next, fallbackNext.value)
);

const hasNav = computed(() => Boolean(prevLink.value || nextLink.value));

function normalizePath(path: string): string {
  if (!path) return "/";
  let normalized = path;
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;
  normalized = normalized.replace(/(\.md|\.html)$/i, "");
  normalized = normalized.replace(/\/index$/i, "/");
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized || "/";
}

function mapPostToLink(post?: Post | null): PagerLink | null {
  if (!post) return null;
  const text = post.frontMatter.title || "未命名文章";
  return {
    text,
    link: post.regularPath,
  };
}

function resolveLink(
  value: FrontmatterNav | undefined,
  fallback: PagerLink | null
): PagerLink | null {
  if (value === false) {
    return null;
  }

  if (!value) {
    return fallback;
  }

  if (typeof value === "string") {
    if (!fallback) return null;
    return {
      text: value,
      link: fallback.link,
    };
  }

  const text = value.text ?? fallback?.text ?? "未命名文章";
  const link = value.link ?? fallback?.link;

  if (!link) {
    return null;
  }

  return { text, link };
}
</script>

<style scoped>
.post-pager {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem 0 1rem;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 2rem;
  flex-wrap: wrap;
}

.pager-link {
  flex: 1 1 260px;
  display: flex;
  flex-direction: column;
  padding: 1rem 1.25rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  transition: border-color 0.2s ease;
}

.pager-link:hover {
  border-color: var(--vp-c-brand);
}

.pager-link .label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.35rem;
}

.pager-link .title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  line-height: 1.4;
}

.pager-link.prev {
  text-align: left;
}

.pager-link.next {
  text-align: right;
}

@media (max-width: 640px) {
  .post-pager {
    flex-direction: column;
  }

  .pager-link {
    flex: 1 1 auto;
  }

  .pager-link.next {
    text-align: left;
  }
}
</style>

