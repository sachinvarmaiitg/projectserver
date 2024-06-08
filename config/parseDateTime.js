function parseDateTime(dateString, timeString) {
    const dte = `${dateString}T${timeString}:00Z`;
    var startTime = new Date(dte);
    startTime =   new Date( startTime.getTime() + ( startTime.getTimezoneOffset() * 60000 ) );
    return startTime
}

module.exports = parseDateTime;
