Асинхронный API-запрос

🔹 Что делает код

fetchUser возвращает TaskResult<{ name: string }, string>.

unwrapOrElse позволяет безопасно получить значение, задавая default при Err.

taskMatch даёт Rust-подобное сопоставление Ok / Err.

Все ошибки логируются в console, никаких выбросов исключений.
