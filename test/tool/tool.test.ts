import { describe, expect, it } from 'vitest'
import { isEmptyStr } from '../../package/@runtime-core/helper'

describe('test tool', () => {
  it('test isEmptyStr', () => {
    const str = 'str'
    const ft = isEmptyStr(str)
    expect(ft).toBe(false)
    const str1 = ''
    expect(isEmptyStr(str1)).toBe(true)
    const str2 = '        str'
    expect(isEmptyStr(str2)).toBe(true)
    const str3 = '  http://test.com'
    expect(isEmptyStr(str3)).toBe(false)
  })
})
