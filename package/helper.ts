/**
 * is Date
 * @param val 
 * @returns 
 */
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}
/**
 * is object
 * @param val
 * @returns
 */
export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

/**
 * Determine whether it is an ordinary object
 *
 * @param params object
 * @returns Boolean
 */

export function isPlainObject(params: any): params is Object {
  return toString.call(params).toLowerCase() === '[object object]'
}

export function extend<T, K>(to: T, from: K): T & K {
  for (const key in from) {
    ;(to as T & K)[key] = from[key] as any
  }
  return to as T & K
}
/**
 * Depth merges the objects
 * @param obj object
 * @returns T
 */
export const deepMerge = (...obj: any[]) => {
  const result = Object.create(null)
  obj.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}
