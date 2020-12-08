// @flow 报错，搞不定
function foo(x: ?number): string {
    if (x) {
      return x;
    }
    return "default string";
}