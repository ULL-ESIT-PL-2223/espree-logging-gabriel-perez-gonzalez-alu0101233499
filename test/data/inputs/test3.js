function foo(a, b, c) {
    let x = 'tutu';
    let y = (function (x) { return x * x })(2);
    let z = (e => { return e + 1 })(4);
}
foo(1, 'wut', 3);