export function displayDateTimePeriod(start: Date, end: Date): string {
  let output: string = "";

  const ISOstart = start.toISOString();
  const ISOend = end.toISOString();
  const startDate: string = ISOstart.slice(8, 10) + '.' + ISOstart.slice(5, 7) + '.' + ISOstart.slice(0, 4);
  let   endDate: string   =   ISOend.slice(8, 10) + '.' +   ISOend.slice(5, 7) + '.' +   ISOend.slice(0, 4);
  const startHour: string = start.toLocaleTimeString().slice(0, -3);
  let   endHour: string   =   end.toLocaleTimeString().slice(0, -3);
  // console.log(startDate + ' ' + startHour + " - " + endDate + ' ' + endHour)

  const one_day = 24 * 60 * 60 * 1000

  if (endHour === '00:00' && end.getTime() - start.getTime() < one_day && end.getTime() - start.getTime() > 0) {
    endDate = startDate;
    endHour = '24:00';
  }

  if (startDate === endDate) {
    output += startDate;

    if (startHour !== endHour) {
      output += ', ' + startHour + ' - ' + endHour;
    } else {
      output += ', cały dzień';
    }
  } else {
    if (startHour === '00:00' && endHour === '00:00') {
      output += startDate + ' - ' + endDate
    } else {
      output = `od: ${startDate}, ${startHour}\ndo: ${endDate}, ${endHour}`;
    }
  }

  return output;
}

export function displayDateTime(date: Date): string {
  const dayOfWeek = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
  // const monthName = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec",
  //     "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];

  return date.getDate() + '.' + String(date.getMonth() + 1).padStart(2, "0") +
    "." + date.getFullYear() + ", godz. " + String(date.getHours()).padStart(2, "0") + ":" +
    String(date.getMinutes()).padStart(2, "0") + "  (" + dayOfWeek[date.getDay()] + ")";
}

export function displayDate(date: Date): string {
  const dayOfWeek = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];

  return date.getDate() + '.' + String(date.getMonth() + 1).padStart(2, "0") +
    "." + date.getFullYear() + " (" + dayOfWeek[date.getDay()] + ")";
}

export function displayTime(date: Date): string {
  return String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0");
}

//   const options: Intl.DateTimeFormatOptions = {
//     weekday: "long",
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: "numeric",
//     minute: "numeric",
//   };
//
//   return date.toLocaleDateString('pl-PL', options);
// }