import { map, type Task } from '@resultsafe/core-fp-task';

// 4️⃣ Финтех — подсчёт комиссии

type Payment = { id: string; amount: number };

const fetchPayment: Task<Payment> = () =>
  Promise.resolve({ id: 'p123', amount: 100 });

// Преобразуем в комиссию 2%
const commission: Task<number> = map(
  fetchPayment,
  (payment) => payment.amount * 0.02,
);

async function runPaymentExample() {
  const fee = await commission();
  console.log('💳 Commission:', fee);
}

runPaymentExample();


