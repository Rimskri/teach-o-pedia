const dateChecker = (data) => {
  if(data.getDate() < 10) {
    const cd = `0${data.getDate()}`;
    return cd;
  } else {
    return data.getDate();
  }
};

const monthChecker = (data) => {
  let month = data.getMonth()+1;
  if(month < 10) {
    const cd = `0${month}`;
    return cd;
  } else {
    return month;
  }
}


exports.getNumericTodayDate = () => {
  let date = new Date();
  let cm = date.getMonth()+1;
  let currentMonth = monthChecker(date);
  let currentDate = dateChecker(date);
  let currentYear = date.getFullYear();
  let today = `${currentYear}-${currentMonth}-${currentDate}`;
  return today;
};

exports.getNumericFutureDate = () => {
  let fdate = new Date();
  fdate.setDate(fdate.getDate() + 7);
  let futureDate = dateChecker(fdate);
  let futureMonth = monthChecker(fdate);
  let futureYear = fdate.getFullYear();
  let future = `${futureYear}-${futureMonth}-${futureDate}`;
  return future;
};

exports.getNumericTomoDate = () => {
    let fdate = new Date();
    fdate.setDate(fdate.getDate() + 1);
    let futureDate = dateChecker(fdate);    
    let futureMonth = monthChecker(fdate);
    let futureYear = fdate.getFullYear();
    let tomorrow = `${futureYear}-${futureMonth}-${futureDate}`;
    return tomorrow;
  };