import numberformat from '../../src/main'
import Decimal from 'decimal.js'

describe('numberformat', () => {
  it('builds formatters', () => {
    expect(new numberformat.Formatter({format: 'hybrid'}).opts.format).to.equal('hybrid')
  }),
  it('formats numbers', () => {
    const formatter = numberformat
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    //expect(formatter.format(8/9)).to.equal('0.889')
    //expect(formatter.format(1e3)).to.equal('1 thousand')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.0000 million')
    expect(formatter.format(1.1111e6)).to.equal('1.1111 million')
    expect(formatter.format(1.1111e9)).to.equal('1.1111 billion')
    expect(formatter.format(1.1111e12)).to.equal('1.1111 trillion')
    expect(formatter.format(1e21)).to.equal('1.0000 sextillion')
    expect(formatter.format(1e36)).to.equal('1.0000 undecillion')
  })
  it('formats long-scale numbers', () => {
    const formatter = new numberformat.Formatter({format: 'longScale'})
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    //expect(formatter.format(8/9)).to.equal('0.889')
    //expect(formatter.format(1e3)).to.equal('1 thousand')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.0000 million')
    expect(formatter.format(1.1111e6)).to.equal('1.1111 million')
    expect(formatter.format(1.1111e9)).to.equal('1.1111 milliard')
    expect(formatter.format(1.1111e12)).to.equal('1.1111 billion')
    expect(formatter.format(1e21)).to.equal('1.0000 trilliard')
    expect(formatter.format(1e36)).to.equal('1.0000 sextillion')
  })
  it('formats hybrid', () => {
    const formatter = new numberformat.Formatter({format: 'hybrid'})
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    //expect(formatter.format(8/9)).to.equal('0.889')
    //expect(formatter.format(1e3)).to.equal('1 thousand')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.0000 million')
    expect(formatter.format(1.1111e6)).to.equal('1.1111 million')
    expect(formatter.format(1e36)).to.equal('1.0000e36')
  })
  it('formats scientificE', () => {
    const formatter = new numberformat.Formatter({format: 'scientific'})
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    //expect(formatter.format(8/9)).to.equal('0.889')
    //expect(formatter.format(1e3)).to.equal('1e3')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.0000e6')
    expect(formatter.format(1.1111e6)).to.equal('1.1111e6')
    expect(formatter.format(1e36)).to.equal('1.0000e36')
  })
  it('formats engineering', () => {
    const formatter = new numberformat.Formatter({format: 'engineering'})
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    //expect(formatter.format(8/9)).to.equal('0.889')
    //expect(formatter.format(1e3)).to.equal('1E3')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.0000E6')
    expect(formatter.format(1.1111e6)).to.equal('1.1111E6')
    expect(formatter.format(1e7)).to.equal('10.000E6')
    expect(formatter.format(1.1111e7)).to.equal('11.111E6')
    expect(formatter.format(1e8)).to.equal('100.00E6')
  })
  it('formats short numbers', () => {
    const formatter = new numberformat.Formatter({flavor: 'short'})
    expect(formatter.format(1)).not.to.equal(1)
    expect(formatter.format(1)).to.equal('1')
    expect(formatter.format(1e3)).to.equal('1,000')
    expect(formatter.format(1e6)).to.equal('1.00M')
    expect(formatter.format(100e3)).to.equal('100K')
    expect(formatter.format(1e9)).to.equal('1.00B')
    expect(formatter.format(1.1111e6)).to.equal('1.11M')
    expect(formatter.format(1.1111e6, {format: 'engineering'})).to.equal('1.11E6')
  })
  it('supports `opts` as a second argument', () => {
    const formatter = numberformat
    expect(formatter.format(1, {flavor: 'short'})).to.equal('1')
    expect(formatter.format(1e3, {flavor: 'short'})).to.equal('1,000')
    expect(formatter.format(1e6, {flavor: 'short'})).to.equal('1.00M')
    expect(formatter.format(100e3, {flavor: 'short'})).to.equal('100K')
    expect(formatter.format(1e9, {flavor: 'short'})).to.equal('1.00B')
    expect(formatter.format(1.1111e6, {flavor: 'short'})).to.equal('1.11M')
  })
  it('handles bogus formats', () => {
    const formatter = numberformat
    expect(() => formatter.format(1, {format: 'bogus'})).to.throw()
    expect(() => formatter.format(1, {format: 'standard'})).not.to.throw()
    expect(() => formatter.format(1, {format: null})).not.to.throw()
  })
  it('supports suffix-only', () => {
    const formatter = numberformat
    expect(formatter.suffix(1e6, {format: 'standard'})).to.equal(' million')
    expect(formatter.suffix(1e6, {format: 'standard', flavor: 'short'})).to.equal('M')
    expect(formatter.suffix(1e6, {format: 'engineering'})).to.equal('E6')
  })
  it('supports negatives', () => {
    const formatter = numberformat
    expect(formatter.format(0)).to.equal('0')
    expect(formatter.format(-1)).to.equal('-1')
    expect(formatter.format(-1e3)).to.equal('-1,000')
    expect(formatter.format(-1e6)).to.equal('-1.0000 million')
    expect(formatter.format(-1e21)).to.equal('-1.0000 sextillion')
  })
  it('supports small decimals', () => {
    const formatter = numberformat
    expect(formatter.format(8/9)).to.equal('0')
    expect(formatter.format(8/9, {maxSmall: 1})).to.equal('0.88889')
    expect(formatter.format(-8/9, {maxSmall: 1})).to.equal('-0.88889')
    expect(formatter.format(8/9, {sigfigs: 3, maxSmall: 1})).to.equal('0.889')
    expect(formatter.format(8/9, {sigfigs: 1, maxSmall: 1})).to.equal('0.9')
    expect(formatter.format(8/9, {flavor: 'short', maxSmall: 1})).to.equal('0.889')
    // zero-sigfigs after the decimal point are truncated
    expect(formatter.format(0.1, {maxSmall: 1, sigfigs:9})).to.equal('0.1')
    expect(formatter.format(0.11, {maxSmall: 1, sigfigs:9})).to.equal('0.11')
    expect(formatter.format(0.111, {maxSmall: 1, sigfigs:9})).to.equal('0.111')
    expect(formatter.format(0.101, {maxSmall: 1, sigfigs:9})).to.equal('0.101')
  })

  it('formats bigger numbers', () => {
    const formatter = numberformat
    expect(formatter.format(1e18)).to.equal('1.0000 quintillion')
    expect(formatter.format(1e18, {flavor: 'short'})).to.equal('1.00Qi')
    // 1e20 is an important breakpoint: JS's native number formatting changes
    // from '123,456' to '1.23e21'
    expect(formatter.format(1e21)).to.equal('1.0000 sextillion')
    expect(formatter.format(1e21, {flavor: 'short'})).to.equal('1.00Sx')
  })
  it('supports decimal.js', () => {
    const formatter = new numberformat.Formatter({backend: 'decimal.js'})
    //console.log(new Decimal('1e999').toString())
    expect(formatter.format(new Decimal('1e9999'), {format: 'engineering'})).to.equal('1.0000E9999')
    expect(formatter.format(new Decimal('1e9999'))).to.equal('1.0000e9999')
    expect(formatter.format(new Decimal('1'))).to.equal('1')
    expect(formatter.format(new Decimal('1e3'))).to.equal('1,000')
    expect(formatter.format(new Decimal('1e6'))).to.equal('1.0000 million')
    expect(formatter.format(new Decimal('1.1111e6'))).to.equal('1.1111 million')
    expect(formatter.format(new Decimal('1.1111e9'))).to.equal('1.1111 billion')
    expect(formatter.format(new Decimal('1.1111e12'))).to.equal('1.1111 trillion')
    expect(formatter.format(new Decimal('1e21'))).to.equal('1.0000 sextillion')
    expect(formatter.format(new Decimal('1e36'))).to.equal('1.0000 undecillion')
  })
  it('has shortcuts for each flavor', () => {
    const formatter = numberformat
    expect(!!formatter.formatFull).to.equal(true)
    expect(!!formatter.formatShort).to.equal(true)
    expect(formatter.formatFull(1e6)).to.equal('1.0000 million')
    expect(formatter.formatShort(1e6)).to.equal('1.00M')
  })
  it('doesn\'t round smallish numbers by default, #13', () => {
    const f = numberformat
    expect(f.format(12345)).to.equal('12,345')
    expect(f.formatShort(12345)).to.equal('12,345')
  })
  for (let backend of ['native', 'decimal.js']) {
    let f = new numberformat.Formatter({backend})
    it('supports undefined sigfigs, #15: standard, '+backend, () => {
      expect(f.format(1.00e9, {format: 'standard', sigfigs: undefined})).to.equal('1 billion')
      expect(f.format(1.23e9, {format: 'standard', sigfigs: undefined})).to.equal('1.23 billion')
    })
    it('supports undefined sigfigs, #15: hybrid, '+backend, () => {
      expect(f.format(1.00e9, {format: 'hybrid', sigfigs: undefined})).to.equal('1 billion')
      expect(f.format(1.23e9, {format: 'hybrid', sigfigs: undefined})).to.equal('1.23 billion')
    })
    it('supports undefined sigfigs, #15: scientific, '+backend, () => {
      expect(f.format(1.00e9, {format: 'scientific', sigfigs: undefined})).to.equal('1e9')
      expect(f.format(1.23e9, {format: 'scientific', sigfigs: undefined})).to.equal('1.23e9')
    })
    it('supports undefined sigfigs, #15: engineering, '+backend, () => {
      expect(f.format(1.00e9, {format: 'engineering', sigfigs: undefined})).to.equal('1E9')
      expect(f.format(1.23e9, {format: 'engineering', sigfigs: undefined})).to.equal('1.23E9')
    })
    it('supports undefined sigfigs, #15: longScale, '+backend, () => {
      expect(f.format(1.00e9, {format: 'longScale', sigfigs: undefined})).to.equal('1 milliard')
      expect(f.format(1.23e9, {format: 'longScale', sigfigs: undefined})).to.equal('1.23 milliard')
    })
    it('supports undefined sigfigs, #15: standard/short, '+backend, () => {
      expect(f.format(1.00e9, {format: 'standard', sigfigs: undefined, flavor: 'short'})).to.equal('1B')
      expect(f.format(1.23e9, {format: 'standard', sigfigs: undefined, flavor: 'short'})).to.equal('1.23B')
    })
    it('supports undefined sigfigs, #15: standard/null, '+backend, () => {
      expect(f.format(1.00e9, {format: 'standard', sigfigs: null})).to.equal('1 billion')
      expect(f.format(1.23e9, {format: 'standard', sigfigs: null})).to.equal('1.23 billion')
    })
    it('supports undefined sigfigs, #15: standard/0, '+backend, () => {
      expect(f.format(1.00e9, {format: 'standard', sigfigs: 0})).to.equal('1 billion')
      expect(f.format(1.23e9, {format: 'standard', sigfigs: 0})).to.equal('1.23 billion')
    })
  }
});
