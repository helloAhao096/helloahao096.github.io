<template>
  <div class="greeting">
    <div class="greeting-content">
      <p class="greeting-text" aria-live="polite">
        <span class="greeting-prefix">$</span>
        <span class="greeting-main">{{ displayText }}</span>
        <span class="greeting-cursor" :class="{ 'greeting-cursor--blink': isPlaying }">_</span>
      </p>
      <!-- <p class="greeting-subtitle">
        {{ subtitleText }}
      </p> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

// 配置
const greetingText = "Hello, I'm QianFan";
// const subtitleText = 'Welcome to my digital space';
const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}<>?/\\|~';
const CYCLE_DURATION = 10000; // 5秒一个循环

// 状态
const displayText = ref('');
const isPlaying = ref(false);
let animationId: number | null = null;
let cycleTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * 生成随机字符
 */
const getRandomChar = () => {
  return randomChars[Math.floor(Math.random() * randomChars.length)];
};

/**
 * 生成随机文字（无意义的随机字符串）
 */
const generateRandomText = () => {
  const length = Math.floor(Math.random() * 15) + 10; // 10-24个字符
  return Array.from({ length }, () => getRandomChar()).join('');
};

/**
 * 核心动画函数：将目标文本从随机字符逐步揭示
 * @param target 目标文本
 * @param speed 揭示速度（每次迭代增加的字符数）
 * @param onComplete 完成回调
 */
const animateText = (
  target: string,
  speed = 0.2,
  onComplete?: () => void
) => {
  let revealedCount = 0;

  const update = () => {
    // 生成当前帧的文本：已揭示的部分显示目标字符，未揭示的部分显示随机字符
    const text = target
      .split('')
      .map((char, index) => {
        if (index < Math.floor(revealedCount)) {
          return char;
        }
        return getRandomChar();
      })
      .join('');

    displayText.value = text;

    // 继续动画直到所有字符都揭示
    if (revealedCount < target.length) {
      revealedCount += speed;
      animationId = requestAnimationFrame(update);
    } else {
      // 动画完成，显示最终文本
      displayText.value = target;
      animationId = null;
      onComplete?.();
    }
  };

  update();
};

/**
 * 播放一个循环：仅围绕 greetingText 进行随机揭示
 * @param cycleStartTime 循环开始时间戳
 */
const playCycle = async (cycleStartTime: number) => {
  isPlaying.value = true;

  await new Promise<void>((resolve) => {
    animateText(greetingText, 0.2, () => {
      // 计算已用时间，确保总时长不超过设定周期
      const elapsed = Date.now() - cycleStartTime;
      const remaining = Math.max(0, CYCLE_DURATION - elapsed);
      setTimeout(resolve, remaining);
    });
  });

  isPlaying.value = false;
};

/**
 * 开始循环播放
 */
const startLoop = () => {
  const runCycle = () => {
    const cycleStartTime = Date.now();
    playCycle(cycleStartTime).then(() => {
      // 确保每个循环精确为5秒
      const elapsed = Date.now() - cycleStartTime;
      const delay = Math.max(0, CYCLE_DURATION - elapsed);
      cycleTimer = setTimeout(runCycle, delay);
    });
  };

  // 立即开始第一个循环
  runCycle();
};

onMounted(() => {
  startLoop();
});

onBeforeUnmount(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
  }
  if (cycleTimer !== null) {
    clearTimeout(cycleTimer);
  }
});
</script>

<style scoped>
.greeting {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.greeting-content {
  max-width: 600px;
  margin: 0 auto;
}

.greeting-text {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  line-height: 1.6;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
}

.greeting-prefix {
  color: var(--color-primary-muted);
  opacity: 0.8;
}

.greeting-main {
  color: inherit;
  min-height: 1.6rem;
}

.greeting-cursor {
  color: var(--color-primary);
  opacity: 0.8;
}

.greeting-cursor--blink {
  animation: blink 1s steps(2, start) infinite;
}

.greeting-subtitle {
  font-size: 1rem;
  color: var(--color-text-soft);
  font-family: var(--font-sans);
  margin-top: 0.5rem;
}

@keyframes blink {
  0%,
  50% {
    opacity: 0;
  }
  51%,
  100% {
    opacity: 1;
  }
}

/* 移动端适配 */
@media (max-width: 640px) {
  .greeting {
    margin-bottom: 2rem;
    padding: 1.5rem 0;
  }

  .greeting-text {
    font-size: 1.2rem;
  }

  .greeting-subtitle {
    font-size: 0.9rem;
  }
}
</style>
