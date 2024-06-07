
export default class Num {

  static integerPart(n: number) { return Math.floor(n) }

  static round(n: number) { return this.integerPart(n + .5) }

  static fractionalPart(n: number) { return n - this.integerPart(n) }

  static fractionalRemainder(n: number) { return 1 - this.fractionalPart(n) }

}
