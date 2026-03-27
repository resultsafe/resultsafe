/**
 * @module 001-validation
 * @title Form Validation with Error Accumulation
 * @description Complete form validation pipeline with error accumulation. Validates multiple fields and collects all errors for user feedback.
 * @example
 * import { Err, Ok, match } from '@resultsafe/core-fp-result';
 * const result = validateForm({ username: 'john', email: 'john@example.com', password: 'Secure123', age: 25 });
 * match(result, data => console.log('Valid:', data), errors => errors.forEach(e => console.error(e.message)));
 * @example
 * import { Err, Ok, match } from '@resultsafe/core-fp-result';
 * const invalidResult = validateForm({ username: 'J', email: 'invalid', password: 'weak', age: 15 });
 * match(invalidResult, displaySuccess, displayErrors);
 * @tags validation,form,error-accumulation,pipeline,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 15min
 * @category patterns
 * @see {@link ../../01-api-reference/04-refiners/05-refine-result} @see {@link ../../02-patterns/04-error-handling/001-error-recovery} @see {@link https://github.com/Livooon/resultsafe}
 * @ai {"purpose":"Teach form validation with error accumulation using Result","prerequisites":["Result type","Type guards"],"objectives":["Error accumulation","Field validation"],"rag":{"queries":["Result form validation example","error accumulation pattern"],"intents":["learning","practical"],"expectedAnswer":"Use Result with error array for validation accumulation","confidence":0.95},"embedding":{"semanticKeywords":["validation","form","error-accumulation","pipeline","fields"],"conceptualTags":["validation","user-feedback"],"useCases":["form-validation","input-sanitization"]},"codeSearch":{"patterns":["validateForm(data)","validateUsername(username)"],"imports":["import { Err, match, Ok } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["001-error-recovery","005-refine-result"]},"chunking":{"type":"self-contained","section":"patterns","subsection":"validation","tokenCount":400,"relatedChunks":["001-error-recovery","005-refine-result"]}}
 */

import { Err, match, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Types =====

interface FormData {
  username: string;
  email: string;
  password: string;
  age: number;
}

interface FormErrors {
  field: string;
  message: string;
}

type ValidationResult<T> = Result<T, FormErrors[]>;

// ===== Validators =====

const validateUsername = (username: string): Result<string, FormErrors[]> => {
  const errors: FormErrors[] = [];

  if (!username || username.trim().length === 0) {
    errors.push({ field: 'username', message: 'Username is required' });
  } else if (username.length < 3) {
    errors.push({
      field: 'username',
      message: 'Username must be at least 3 characters',
    });
  } else if (username.length > 20) {
    errors.push({
      field: 'username',
      message: 'Username must be less than 20 characters',
    });
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push({
      field: 'username',
      message: 'Username can only contain letters, numbers, and underscores',
    });
  }

  return errors.length > 0 ? Err(errors) : Ok(username.trim());
};

const validateEmail = (email: string): Result<string, FormErrors[]> => {
  const errors: FormErrors[] = [];

  if (!email || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  } else if (!email.endsWith('@example.com')) {
    errors.push({
      field: 'email',
      message: 'Email must be @example.com domain',
    });
  }

  return errors.length > 0 ? Err(errors) : Ok(email.toLowerCase().trim());
};

const validatePassword = (password: string): Result<string, FormErrors[]> => {
  const errors: FormErrors[] = [];

  if (!password || password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters',
    });
  } else if (!/[A-Z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one uppercase letter',
    });
  } else if (!/[a-z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one lowercase letter',
    });
  } else if (!/[0-9]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one number',
    });
  }

  return errors.length > 0 ? Err(errors) : Ok(password);
};

const validateAge = (age: number): Result<number, FormErrors[]> => {
  const errors: FormErrors[] = [];

  if (!Number.isInteger(age)) {
    errors.push({ field: 'age', message: 'Age must be an integer' });
  } else if (age < 18) {
    errors.push({ field: 'age', message: 'You must be at least 18 years old' });
  } else if (age > 120) {
    errors.push({ field: 'age', message: 'Age must be less than 120' });
  }

  return errors.length > 0 ? Err(errors) : Ok(age);
};

// ===== Validation Pipeline =====

const validateForm = (data: FormData): ValidationResult<FormData> => {
  const allErrors: FormErrors[] = [];
  const validData: Partial<FormData> = {};

  // Validate username
  const usernameResult = validateUsername(data.username);
  if (usernameResult.ok) {
    validData.username = usernameResult.value;
  } else {
    allErrors.push(...usernameResult.error);
  }

  // Validate email
  const emailResult = validateEmail(data.email);
  if (emailResult.ok) {
    validData.email = emailResult.value;
  } else {
    allErrors.push(...emailResult.error);
  }

  // Validate password
  const passwordResult = validatePassword(data.password);
  if (passwordResult.ok) {
    validData.password = passwordResult.value;
  } else {
    allErrors.push(...passwordResult.error);
  }

  // Validate age
  const ageResult = validateAge(data.age);
  if (ageResult.ok) {
    validData.age = ageResult.value;
  } else {
    allErrors.push(...ageResult.error);
  }

  // Return result
  if (allErrors.length > 0) {
    return Err(allErrors);
  }

  return Ok(validData as FormData);
};

// ===== Display Helpers =====

const displayErrors = (errors: FormErrors[]) => {
  console.log('\n❌ Validation Errors:');
  errors.forEach((error) => {
    console.log(`  - ${error.field}: ${error.message}`);
  });
};

const displaySuccess = (data: FormData) => {
  console.log('\n✅ Validation Successful!');
  console.log('  Username:', data.username);
  console.log('  Email:', data.email);
  console.log('  Age:', data.age);
};

// ===== Example Usage =====

const runExample = () => {
  console.log('=== Form Validation Example ===\n');

  // Example 1: Valid data
  console.log('--- Test 1: Valid Data ---');
  const validData: FormData = {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'SecurePass123',
    age: 25,
  };

  const validResult = validateForm(validData);
  match(validResult, displaySuccess, displayErrors);

  // Example 2: Invalid data (all fields wrong)
  console.log('\n--- Test 2: Invalid Data ---');
  const invalidData: FormData = {
    username: 'J',
    email: 'invalid-email',
    password: 'weak',
    age: 15,
  };

  const invalidResult = validateForm(invalidData);
  match(invalidResult, displaySuccess, displayErrors);

  // Example 3: Partial errors
  console.log('\n--- Test 3: Partial Errors ---');
  const partialData: FormData = {
    username: 'valid_user',
    email: 'also-valid@example.com',
    password: 'short',
    age: 200,
  };

  const partialResult = validateForm(partialData);
  match(partialResult, displaySuccess, displayErrors);
};

// Run example
runExample();

// ===== Additional Utilities =====

// Async validation (e.g., check username availability)
const checkUsernameAvailability = async (
  username: string,
): Promise<Result<boolean, FormErrors[]>> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));

  const takenUsernames = ['admin', 'root', 'moderator'];
  if (takenUsernames.includes(username)) {
    return Err([{ field: 'username', message: 'Username is already taken' }]);
  }

  return Ok(true);
};

// Real-time validation debouncing
const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
