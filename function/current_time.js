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

module.exports = {
  getCurrentISTTime,
  calculateEndDate,
};














