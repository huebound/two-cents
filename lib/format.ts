function getDateFromTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatDateRange(start: string, end: string) {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });

  if (startDate.toDateString() === endDate.toDateString()) {
    return formatter.format(startDate);
  }

  const startString = formatter.format(startDate);
  const endString = formatter.format(endDate);

  return `${startString} - ${endString}`;
}

export function formatTimeRange(start: string, end: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const startDate = getDateFromTime(start);
  const endDate = getDateFromTime(end);

  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
}

export function formatDuration(start: string, end: string) {
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);

  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes;
  const minutes = Math.max(endTotal - startTotal, 0);

  if (minutes === 0) {
    return "0 minutes";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours && remainingMinutes) {
    return `${hours} hr ${remainingMinutes} min`;
  }

  if (hours) {
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }

  return `${remainingMinutes} min`;
}
