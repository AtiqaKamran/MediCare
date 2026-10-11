import { supabase } from "../lib/supabase";

const USERS_KEY = "medicare_users";
const CURRENT_USER_KEY = "medicare_current_user";

// USERS / LOCAL PROFILE

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
    return;
  }

  const { password, ...safeUser } = user;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;

  localStorage.removeItem(CURRENT_USER_KEY);
}

export function createUser(user) {
  const users = getUsers();

  const existingUser = users.find(
    (item) =>
      item.id === user.id ||
      item.email?.toLowerCase() === user.email?.toLowerCase()
  );

  if (existingUser) {
    const updatedUser = { ...existingUser, ...user };
    const updatedUsers = users.map((item) =>
      item.id === updatedUser.id ? updatedUser : item
    );

    saveUsers(updatedUsers);
    return updatedUser;
  }

  const { password, ...safeUser } = user;
  users.push(safeUser);
  saveUsers(users);

  return safeUser;
}

export function updateUser(updatedUser) {
  const users = getUsers();
  const { password, ...safeUser } = updatedUser;

  const updatedUsers = users.map((user) =>
    user.id === safeUser.id ? { ...user, ...safeUser } : user
  );

  saveUsers(updatedUsers);
  setCurrentUser(safeUser);

  return safeUser;
}

export function findUserByEmail(email) {
  if (!email) return null;

  const normalizedEmail = email.trim().toLowerCase();

  return (
    getUsers().find(
      (user) => user.email?.toLowerCase() === normalizedEmail
    ) || null
  );
}

export function findUserById(userId) {
  if (!userId) return null;

  return getUsers().find((user) => user.id === userId) || null;
}

// SUPABASE MEDICAL HISTORY

async function getAuthenticatedUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Please log in to access medical history.");

  return user.id;
}

export async function getPatientHistory() {
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("patient_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((record) => ({
    ...record,
    createdAt: record.created_at,
    conditionDetails: record.condition_details,
    selfCare: record.self_care,
    safetyNotes: record.safety_notes,
  }));
}

export async function savePatientHistory(record) {
  if (!record) {
    throw new Error("Medical history record is required.");
  }

  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("patient_history")
    .insert({
      user_id: userId,
      symptoms: record.symptoms ?? [],
      duration: record.duration ?? "",
      severity: record.severity ?? "",
      guidance: record.guidance ?? null,
      recommendations: record.recommendations ?? null,
      condition_details: record.conditionDetails ?? [],
      self_care: record.selfCare ?? [],
      safety_notes: record.safetyNotes ?? [],
    })
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    createdAt: data.created_at,
    conditionDetails: data.condition_details,
    selfCare: data.self_care,
    safetyNotes: data.safety_notes,
  };
}

export async function deletePatientHistory(recordId) {
  if (!recordId) {
    throw new Error("Medical history record ID is required.");
  }

  const userId = await getAuthenticatedUserId();

  const { error } = await supabase
    .from("patient_history")
    .delete()
    .eq("id", recordId)
    .eq("user_id", userId);

  if (error) throw error;
}