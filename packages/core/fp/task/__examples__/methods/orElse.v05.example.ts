import { orElse, type Task } from '@resultsafe/core-fp-task';

// интернет-магазин / заказ товара с fallback на запасной склад:

type Order = { orderId: string; quantity: number };

// Основная задача: попытка оформить заказ через главный склад
const primaryOrder: Task<Order> = () =>
  Math.random() > 0.5
    ? Promise.resolve({ orderId: 'o100', quantity: 5 })
    : Promise.reject(new Error('Primary warehouse unavailable'));

// Фолбэк: резервный склад
const backupOrder: Task<Order> = () =>
  Promise.resolve({ orderId: 'o100', quantity: 5 });

// Создаём надежный Task с fallback
const orderTask: Task<Order> = orElse(primaryOrder, () => backupOrder);

// Выполняем и логируем результат
orderTask().then((result) => console.log('Final order:', result));


