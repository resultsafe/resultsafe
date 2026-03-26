// @resultsafe/core-fp-task/src/methods/__examples__/andThen-payments.example.ts
import { andThen, type Task } from '@resultsafe/core-fp-task';

type PaymentRequest = { userId: number; amount: number };
type PaymentConfirmation = { id: string; status: 'success' | 'failed' };
type Receipt = { receiptId: string; amount: number };

// -----------------------------
// 1️⃣ Исходные задачи
// -----------------------------
const createPayment: Task<PaymentRequest> = () =>
  new Promise((res) => setTimeout(() => res({ userId: 1, amount: 100 }), 10));

const processPayment =
  (payment: PaymentRequest): Task<PaymentConfirmation> =>
  () =>
    new Promise((res) =>
      setTimeout(() => res({ id: 'pay_123', status: 'success' }), 15),
    );

const generateReceipt =
  (confirmation: PaymentConfirmation): Task<Receipt> =>
  () =>
    new Promise((res) =>
      setTimeout(() => res({ receiptId: confirmation.id, amount: 100 }), 5),
    );

// -----------------------------
// 2️⃣ Цепочка задач через andThen
// -----------------------------
const fullPaymentFlow: Task<Receipt> = andThen(createPayment, (payment) =>
  andThen(processPayment(payment), generateReceipt),
);

// -----------------------------
// 3️⃣ Выполнение
// -----------------------------
async function runExample() {
  const receipt = await fullPaymentFlow();
  console.log('Payment receipt:', receipt);
  // { receiptId: 'pay_123', amount: 100 }
}

runExample();


