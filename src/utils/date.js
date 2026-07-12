export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

export const formatDateForSubmit = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

export const formatDateTimeForSubmit = (dateTime) => {
  if (!dateTime) return "";
  const [date, time] = dateTime.split("T");
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year} ${time}:00`;
};

export const formatDateDisplay = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export const formatMovieDateTimeDisplay = (dateString) => {
  if (!dateString) return "";
  const dateObj = new Date(dateString);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes} - ${day}/${month}/${year}`;
};
