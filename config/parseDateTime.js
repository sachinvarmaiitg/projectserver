function parseDateTime(dateString, timeString) {
    const dte = `${dateString}T${timeString}`;
    var time = new Date(dte);
    time =   time.toLocaleTimeString('en-US', { hour12: false });
    const newdate= `${dateString}T${time}`;
    return new Date(newdate);
}

module.exports = parseDateTime;
