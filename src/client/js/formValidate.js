// Validate if inputText is empty
function isValidData(inputText) {
  if (inputText.trim().length === 0) {
    return 0;
  } else {
    return 1;
  }
}

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Pad month
  const day = date.getDate().toString().padStart(2, '0');         // Pad day
  return `${year}-${month}-${day}`;
}

// Calculating the time difference of two dates
function timeBetween2Dates(txtEndDate) {
  let currentDate = new Date(getCurrentDate()).toISOString().slice(0, 10)
  let newCurrentDate = new Date(currentDate);
  let newEndDate = new Date(txtEndDate);

  return newEndDate.getTime() - newCurrentDate.getTime();
}

// endDate in the pass is not valid
function isEndDateValid(txtEndDate){
  if (timeBetween2Dates(txtEndDate) >= 0){
    return 1
  } else {
    return 0
  }
}

// Calculating the number of days between two dates
function daysBetween2Dates(txtEndDate) {
  return Math.round(timeBetween2Dates(txtEndDate) / (1000 * 3600 * 24));
}

export { isValidData, getCurrentDate, isEndDateValid, daysBetween2Dates };
