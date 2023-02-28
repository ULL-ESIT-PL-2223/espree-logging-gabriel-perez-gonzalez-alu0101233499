[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-f4981d0f882b2a3f0472912d15f9806d57e124e0fc890972558857b51b24a6f9.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=10311247)

# Assignment: Espree Logging

In this assignment, we must have done the following main objectives:
* Show the function's name each time we enter a function.
* Show the function's parameters each time we enter a function.
* Show the line where the function was initialized.

These steps will be executed each time the program encounters a **Function Declaration**, **Function Expression** or **Arrow Function**.

The `logging-espree.js` code was modified in order to show all the values I said previously: 
Example:

```javascript
function foo(a, b) {
    var x = 'blah';
    var y = (function (z) {
        return z + 3;
    })(2);
}

foo(1, 'wut', 3);
```

```javascript
function foo(a, b) {
    console.log(`Entering foo(${ a }, ${ b }) at line 1.`);
    var x = 'blah';
    var y = function (z) {
        console.log(`Entering <anonymous function>(${ z }) at line 4.`);
        return z + 3;
    }(2);
}

foo(1, 'wut', 3);
```

## Task 1: CLI with [Commander.js](https://www.npmjs.com/package/commander).

For the first task, as usual, I created a **CLI** with *Commmander*. The code was almost complete, but I added a name to the program.
The result is the following one:

![Commander](img/commander.png)

The name is in the *Usage* section. It's default value is *log*, but I changed it to *./bin/log.js*.

## Task 2: Scripts in *package.json* and imported modules.

The first thing was to add some dependencies in order to work with tests, make better documentation reports and use code coverage. The following lines represent the dependencies I added:

```javascript
"chai": "^4.3.6",
"nyc": "^15.1.0",
"jsdoc": "^4.0.2"
```

Also, I added a couple of scripts to the *package.json* file, so I can carry on some tasks a little easier. 

```javascript
"scripts": {
    "log": "./bin/log.js -h",
    "test": "mocha",
    "cov": "nyc --reporter=lcov --reporter=text npm run test",
    "doc": "jsdoc ./src"
},
```

## Task 3: Add function name and parameters.

## Task 4: Arrow functions supported.

## Task 5: Add line number.

## Task 6: Testing.

## Task 7: Code Coverage.

## Task 8: CI with GitHub Actions.

## Task 9: Documentation with JSDoc.

## Task 10: Publishing the module in NPM and GitHub.
