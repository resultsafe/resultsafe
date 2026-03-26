// @resultsafe/core-fp-task/src/methods/__examples__/allSettledSame-images.example.ts
import type { Result } from '@resultsafe/core-fp-result'; // используем уже существующий тип
import { allSettledSame, type Task } from '@resultsafe/core-fp-task';

// -----------------------------
// Симуляция загрузки изображений
// -----------------------------
const fetchImage1: Task<string> = () =>
  new Promise((res) => setTimeout(() => res('image1.png loaded'), 10));

const fetchImage2: Task<string> = () =>
  new Promise((res, rej) =>
    setTimeout(
      () =>
        Math.random() > 0.5
          ? res('image2.png loaded')
          : rej(new Error('Image2 failed')),
      15,
    ),
  );

const fetchImage3: Task<string> = () =>
  new Promise((res) => setTimeout(() => res('image3.png loaded'), 5));

const tasks: Task<string>[] = [fetchImage1, fetchImage2, fetchImage3];

// -----------------------------
// Выполнение через allSettledSame с типом из fp-result
// -----------------------------
const resultsTask: Task<Result<string, unknown>[]> = allSettledSame(tasks);

async function runExample() {
  const results: Result<string, unknown>[] = await resultsTask();

  // Логируем каждый результат
  results.forEach((r, idx) => {
    if (r.ok) console.log(`Task ${idx + 1} succeeded:`, r.value);
    else console.warn(`Task ${idx + 1} failed:`, r.error);
  });

  // Успешно загруженные изображения
  const loadedImages: string[] = results
    .filter((r): r is { ok: true; value: string } => r.ok)
    .map((r) => r.value);

  console.log('Loaded images:', loadedImages);

  // Fallback для упавших задач
  const imagesWithFallback: string[] = results.map((r) =>
    r.ok ? r.value : 'placeholder.png',
  );
  console.log('Images with fallback:', imagesWithFallback);
}

runExample();


