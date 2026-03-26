import { match, type Task } from '@resultsafe/core-fp-task';

// 4️⃣ Финтех — расчёт комиссии с обработкой ошибок

type Payment = { id: string; amount: number };

const fetchPayment: Task<Payment> = () =>
  Math.random() > 0.5
    ? Promise.resolve({ id: 'p123', amount: 100 })
    : Promise.reject(new Error('Payment API failed'));

const commissionTask: Task<number> = match(fetchPayment, {
  Ok: (payment) => payment.amount * 0.02,
  Err: (err) => {
    console.warn('Error calculating commission:', err);
    return 0; // fallback
  },
});

commissionTask().then(console.log);


