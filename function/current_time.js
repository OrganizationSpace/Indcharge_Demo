function getCurrentISTTime() {
  const utcTime = new Date();
  const istOffsetMinutes = 5 * 60 + 30; // IST offset from UTC in minutes
  const istTime = new Date(utcTime.getTime() + istOffsetMinutes * 60 * 1000);
  return istTime;
}

function calculateEndDate(istTime, planDuration) {
  const endDate = new Date(istTime);
  endDate.setDate(istTime.getDate() + planDuration);
  return endDate.toISOString();
}

function getCurrentDate() {
  const utcTime = new Date();
  const dateCurrent = new Date(utcTime.getTime() - 19 * 24 * 60 * 60 * 1000);
  return dateCurrent;
}

function getCurrentDateTo(days) {
  const utcTime = new Date();
  const dateCurrent = new Date(utcTime.getTime() - days * 24 * 60 * 60 * 1000);
  dateCurrent.setHours(0, 0, 0, 0);
  return dateCurrent;
}

module.exports = {
  getCurrentISTTime,
  calculateEndDate,
  getCurrentDate,
  getCurrentDateTo
};














