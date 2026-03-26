import { inspectErr, type Task } from '@resultsafe/core-fp-task';

// 4️⃣ Финтех — обработка платежей

type PaymentResult = { id: string; success: boolean };

const processPayment: Task<PaymentResult> = () =>
  new Promise((res, rej) =>
    setTimeout(
      () =>
        Math.random() > 0.5
          ? res({ id: 'p123', success: true })
          : rej(new Error('Payment failed')),
      20,
    ),
  );

const loggedPayment = inspectErr(processPayment, (err) => {
  console.error('💳 Payment error:', err);
});

async function runPaymentExample() {
  try {
    const result = await loggedPayment();
    console.log('✅ Payment result:', result);
  } catch {
    console.log('⚠️ Payment rollback or notification can occur here');
  }
}

runPaymentExample();


