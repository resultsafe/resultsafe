// @resultsafe/core-fp-task/src/methods/__examples__/andThen-social.example.ts
import { andThen, type Task } from '@resultsafe/core-fp-task';

type DraftPost = { authorId: string; content: string };
type PublishedPost = { postId: string; authorId: string; content: string };
type Notification = { userId: string; message: string };

// -----------------------------
// 1️⃣ Исходные задачи
// -----------------------------
const createDraft: Task<DraftPost> = () =>
  new Promise((res) =>
    setTimeout(
      () => res({ authorId: 'user_123', content: 'Hello world!' }),
      10,
    ),
  );

const publishPost =
  (draft: DraftPost): Task<PublishedPost> =>
  () =>
    new Promise((res) =>
      setTimeout(
        () =>
          res({
            postId: 'post_456',
            authorId: draft.authorId,
            content: draft.content,
          }),
        15,
      ),
    );

const sendNotification =
  (post: PublishedPost): Task<Notification> =>
  () =>
    new Promise((res) =>
      setTimeout(
        () =>
          res({
            userId: post.authorId,
            message: `Your post "${post.content}" has been published!`,
          }),
        5,
      ),
    );

// -----------------------------
// 2️⃣ Цепочка задач через andThen
// -----------------------------
const publishFlow: Task<Notification> = andThen(createDraft, (draft) =>
  andThen(publishPost(draft), sendNotification),
);

// -----------------------------
// 3️⃣ Выполнение
// -----------------------------
async function runExample() {
  const notification = await publishFlow();
  console.log('Notification sent:', notification);
  // { userId: 'user_123', message: 'Your post "Hello world!" has been published!' }
}

runExample();


