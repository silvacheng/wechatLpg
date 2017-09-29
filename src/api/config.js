export function parseParam (obj) {
  if (!(obj instanceof Object)) {
    return false
  }
  let objStr = ''
  for (let k in obj) {
    objStr += k + '=' + obj[k] + '&'
  }
  return objStr.substr(0, objStr.length - 1)
}
