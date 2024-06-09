function parseDateTime(dateString, timeString) {
    const dateTimeString = `${dateString}T${timeString}`;
  return new Date(dateTimeString);
}

module.exports = parseDateTime;
