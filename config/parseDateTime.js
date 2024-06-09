function parseDateTime(dateString, timeString) {
    const dateTimeString = `${dateString}T${timeString}`;
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}


module.exports = parseDateTime;
