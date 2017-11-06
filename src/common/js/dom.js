
export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

// export function datePlusHalfHour () {
//   let timeStamp = Date.parse(new Date()) + 30 * 60 * 1000
//   let time = new Date(timeStamp)
//   let year = time.getFullYear
//   let month = time.getMonth() + 1
//   let day = time.getDay()
//   let hour = time.getHours()
//   let minute = time.getMinutes()
//   let second = time.getSeconds()
//   let timeStr = ''
//   timeStr = year + '-' + month + '-' + day 
//   return timeStr
// }