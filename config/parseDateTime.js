function parseDateTime(dateString, timeString) {
    const dte = `${dateString}T${timeString}`;
    return new Date(dte);
}

module.exports = parseDateTime;
