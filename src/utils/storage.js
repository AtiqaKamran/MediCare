const USERS_KEY = "medicare_users";
const CURRENT_USER_KEY = "medicare_current_user";

// Get all registered users
export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

// Save all users
export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get currently logged-in user
export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  } catch {
    return null;
  }
}

// Set currently logged-in user
export function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Logout
export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Add a new user
export function createUser(user) {
  const users = getUsers();

  users.push(user);
  saveUsers(users);

  return user;
}

// Update existing user
export function updateUser(updatedUser) {
  const users = getUsers();

  const updatedUsers = users.map((user) =>
    user.id === updatedUser.id ? updatedUser : user
  );

  saveUsers(updatedUsers);
  setCurrentUser(updatedUser);

  return updatedUser;
}

// Find user by email
export function findUserByEmail(email) {
  const users = getUsers();

  return users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}
// =========================================
// PATIENT MEDICAL HISTORY
// =========================================

const HISTORY_KEY = "medicare_patient_history";

// Get history for a specific patient
export function getPatientHistory(userId) {
  try {
    const history = JSON.parse(
      localStorage.getItem(HISTORY_KEY)
    ) || [];

    return history.filter(
      (record) => record.userId === userId
    );
  } catch {
    return [];
  }
}

// Save a new symptom check
export function savePatientHistory(record) {
  const history = JSON.parse(
    localStorage.getItem(HISTORY_KEY)
  ) || [];

  const newRecord = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  history.push(newRecord);

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history)
  );

  return newRecord;
}

// Delete a history record
export function deletePatientHistory(recordId) {
  const history = JSON.parse(
    localStorage.getItem(HISTORY_KEY)
  ) || [];

  const updatedHistory = history.filter(
    (record) => record.id !== recordId
  );

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(updatedHistory)
  );
}