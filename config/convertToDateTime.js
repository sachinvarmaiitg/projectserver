function convertToDateTime(dateString) {
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false }); // Get current time in 24-hour format
  const dateTimeString = `${dateString}T${currentTime}`;
  return new Date(dateTimeString);
}

module.exports=convertToDateTime;