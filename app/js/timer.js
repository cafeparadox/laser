// duration in milliseconds
const duration = 25 * 60 * 1000

console.log('timer loaded')
initializeClock('clockdiv', duration);

function getTimeRemaining(elapsed, duration){
  // console.log(`getTimeRemaining :: (${elapsed}, ${duration})`)
  const t = duration - elapsed;
  const seconds = Math.floor( (t/1000) % 60 );
  const minutes = Math.floor( (t/1000/60) % 60 );
  const hours = Math.floor( (t/(1000*60*60)) % 24 );
  const days = Math.floor( t/(1000*60*60*24) );
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, duration){
  console.log(`initializeClock :: duration = ${duration}`);
  const clock = document.getElementById(id);
  const daysSpan = clock.querySelector('.days');
  const hoursSpan = clock.querySelector('.hours');
  const minutesSpan = clock.querySelector('.minutes');
  const secondsSpan = clock.querySelector('.seconds');

  var elapsed = 0
  var lastUpdate = Date.now()

  function updateClock(){
    const t = getTimeRemaining(elapsed, duration);
    daysSpan.innerHTML = leftPad(t.days);
    hoursSpan.innerHTML = leftPad(t.hours);
    minutesSpan.innerHTML = leftPad(t.minutes);
    secondsSpan.innerHTML = leftPad(t.seconds);

    if(t.total<=0){
      clearInterval(timeinterval);
    }

    const currentUpdate = Date.now()
    elapsed += currentUpdate - lastUpdate
    lastUpdate = currentUpdate
  }

  updateClock(); // run function once at first to avoid delay
  const timeinterval = setInterval(updateClock, 1000);
}

function leftPad(text, padText = '0') {
  return `${padText}${text}`.slice(-2);
}
