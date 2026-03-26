import type { DiscriminatedUnion } from '../../src/types/variant/DiscriminatedUnion.js';

// Использование:
type UserAction =
  | (DiscriminatedUnion<'CREATE_USER'> & { payload: { name: string } })
  | (DiscriminatedUnion<'DELETE_USER'> & { payload: { id: number } })
  | (DiscriminatedUnion<'UPDATE_USER'> & {
      payload: { id: number; name: string };
    });

// Теперь TypeScript:
// ✅ Предоставляет автокомплит для type
// ✅ Проверяет допустимые значения
// ✅ Помогает в switch/case конструкциях

function handleUserAction(action: UserAction) {
  switch (action.type) {
    case 'CREATE_USER': // Автокомплит работает
      // action.payload автоматически типизирован как { name: string }
      console.log(`Creating user: ${action.payload.name}`);
      break;
    case 'DELETE_USER':
      // action.payload автоматически типизирован как { id: number }
      console.log(`Deleting user: ${action.payload.id}`);
      break;
    // TS предупредит, если забудете case
  }
}
