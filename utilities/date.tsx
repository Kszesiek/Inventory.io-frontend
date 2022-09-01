export function displayDateTimePeriod(start: Date | undefined, end: Date | undefined): string {
  if (start == undefined || end == undefined) {
    return 'cannot parse date'
  }

  let output: string = ""

  const startDate: string = start.toLocaleDateString().replace(/\//g, '.');
  let   endDate: string   =   end.toLocaleDateString().replace(/\//g, '.');
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
      output = `Początek:  ${startDate}  ${startHour}\nKoniec:  ${endDate}  ${endHour}`;
    }
  }

  return output;
}