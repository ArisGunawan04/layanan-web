export const formatLastSeen = (lastSeen) => {
  const now = new Date();
  const lastSeenDate = new Date(lastSeen);
  const diffMs = now - lastSeenDate;
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "baru saja";
  } else if (diffMinutes < 60) {
    return `aktif ${diffMinutes} menit yang lalu`;
  } else if (diffHours < 24) {
    return `aktif ${diffHours} jam yang lalu`;
  } else if (diffDays < 7) {
    return `aktif ${diffDays} hari yang lalu`;
  } else {
    return lastSeenDate.toLocaleDateString();
  }
};