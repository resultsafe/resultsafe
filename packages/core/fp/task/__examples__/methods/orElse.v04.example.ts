import { orElse, type Task } from '@resultsafe/core-fp-task';

// 4️⃣ Финтех — получение комиссии с резервным API

type Payment = { id: string; amount: number };

const fetchPayment: Task<Payment> = () =>
  Math.random() > 0.5
    ? Promise.resolve({ id: 'p123', amount: 100 })
    : Promise.reject(new Error('Primary Payment API failed'));

const fallbackPayment: Task<Payment> = () =>
  Promise.resolve({ id: 'p123', amount: 90 });

const paymentTask: Task<Payment> = orElse(fetchPayment, () => fallbackPayment);

paymentTask().then(console.log);


