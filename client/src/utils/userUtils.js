/**
 * USER UTILITY FUNCTIONS
 * Extracts clean nicknames from Gmail IDs / usernames, filtering out legacy dummy names.
 */

export const getUserNickname = (user) => {
  if (!user) return 'User';

  const isDummyName = (str) => {
    if (!str) return false;
    const lower = str.toLowerCase();
    return lower.includes('leo martin') || lower.includes('sarah martin') || lower.includes('vance');
  };

  if (user.nickname && !isDummyName(user.nickname)) {
    return user.nickname;
  }

  if (user.name && !isDummyName(user.name)) {
    return user.name;
  }

  if (user.email) {
    const prefix = user.email.split('@')[0].trim();
    if (prefix && !isDummyName(prefix)) {
      return prefix;
    }
  }

  return user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'User';
};
