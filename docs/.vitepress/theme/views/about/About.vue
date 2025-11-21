<template>
  <div class="about-page">
    <!-- Header Section -->
    <AboutHeader />

    <div class="about-layout">
      <!-- Left Column: Main Content -->
      <div class="about-main">
        <UserManual />
        <ElectronicGear />
        <DataAnalysis />
      </div>

      <!-- Right Column: Sidebar -->
      <div class="about-sidebar">
        <SocialNetwork />
        <FriendsSection />
        <DonationSection />
      </div>
    </div>

    <!-- Comments Section -->
    <div class="about-comments">
      <Comments />
    </div>
  </div>
</template>

<script lang="ts" setup>
import AboutHeader from "../../components/about/AboutHeader.vue";
import UserManual from "../../components/about/UserManual.vue";
import ElectronicGear from "../../components/about/ElectronicGear.vue";
import DataAnalysis from "../../components/about/DataAnalysis.vue";
import SocialNetwork from "../../components/about/SocialNetwork.vue";
import FriendsSection from "../../components/about/FriendsSection.vue";
import DonationSection from "../../components/about/DonationSection.vue";
import Comments from "../../components/plugin/Comments.vue";
</script>

<style scoped>
.about-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
}

.about-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

/* 桌面端：两栏布局 */
@media (min-width: 768px) {
  .about-layout {
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
  }
}

.about-comments {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--color-border);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .about-page {
    padding: 1.5rem 1rem;
  }

  .about-layout {
    gap: 2rem;
  }

  .about-comments {
    margin-top: 3rem;
    padding-top: 2rem;
  }
}
</style>
