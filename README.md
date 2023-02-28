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
        console.log(`Entering <anonymous function>(${ z }) at line 3.`);
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

## Task 3: Add function and parameters names.

To fulfill this task, I needed to complete the following functions:
* *addLogging(code)*: Allows to build the AST and traverses it. It's main objective is to call the *addBeforeCode(node)* function in order to modify the **AST**, only in the required functions. It is important to say that the *ecmaVersion* in the first line is necessary if we want to work with backticks (``). This occurs because **Espree** does not support them in old versions.

    ```javascript
    export function addLogging(code) {
        let ast = espree.parse(code, {ecmaVersion: 12});
        estraverse.traverse(ast, {
        enter: function(node, parent) {
            if (node.type === 'FunctionDeclaration' ||
                node.type === 'FunctionExpression') {
                addBeforeCode(node);
            }
        }
        });
        return escodegen.generate(ast);
    }
    ```

* *addBeforeCode(node)*: Allows to modify the **AST**, inserting code in it. All I had to do was to take the name of the function and it's arguments. With that, I created a string that has all the information.

    ```javascript
    function addBeforeCode(node) {
        let parameters = '';

        // Function name.
        let name = node.id ? node.id.name : '<anonymous function>';

        // Function parameters.
        if (node.params.length != 0) {
            parameters = node.params.map(param => ` \${ ${param.name} }`);
            parameters[0] = parameters[0].slice(1);
        }

        // Creating the code to insert.
        let beforeCode = `console.log(\`Entering ${name}(${parameters})\`);`;

        // Creating the new node.
        let beforeNodes = espree.parse(beforeCode, {ecmaVersion: 12}).body;

        // Adding the new node.
        node.body.body = beforeNodes.concat(node.body.body);
    }
    ```

If we run the code with the following function:

```javascript
function foo(a, b) {
    var x = 'blah';
    var y = (function (z) {
        return z + 3;
    })(2);
}
```

The result shows this, at this point:

![First try](img/try1.png)

## Task 4: Arrow functions supported.

This task is easily acomplished if we modify the *addLogging(code)* function. The only thing that is needed is to change the conditional clause, adding a new condition that supports **ArrowFunctionExpression**. With this, the task is completed.

```javascript
export function addLogging(code) {
    let ast = espree.parse(code, {ecmaVersion: 12});
    estraverse.traverse(ast, {
      enter: function(node, parent) {
        if (node.type === 'FunctionDeclaration' ||
            node.type === 'FunctionExpression' ||
            node.type === 'ArrowFunctionExpression') {
            addBeforeCode(node);
        }
      }
    });
    return escodegen.generate(ast);
}
```

If we try this modified function with the following code (contains an arrow function):

```javascript
function foo(a, b, c) {
    let x = 'tutu';
    let y = (function (x) { return x * x })(2);
    let z = (e => { return e + 1 })(4);
    console.log(x,y,z);
}
```

The result shows that the arrow function assigned to *let z* is visited, showing that it's name is anonymous and it's "e" parameter:

![Second try](img/try2.png)

## Task 5: Add line number.

In order to show the line number, we must modify our two functions. This happens because the following reasons:
* In the *addLogging(code)* function, when we parse the code, we must add an option that allows the resultant **AST** to have the location information. This means that, aside from other information, the **AST** will have the lines where all the nodes are located inside the code.

    ```javascript
    export function addLogging(code) {
        let ast = espree.parse(code, {ecmaVersion: 12, loc: true});
        estraverse.traverse(ast, {
        enter: function(node, parent) {
            if (node.type === 'FunctionDeclaration' ||
                node.type === 'FunctionExpression' ||
                node.type === 'ArrowFunctionExpression') {
                addBeforeCode(node);
            }
        }
        });
        return escodegen.generate(ast);
    }
    ```

* In the *addBeforeCode(node)* function, we need to extract the location and add it to our modified code.

    ```javascript
    function addBeforeCode(node) {
        let parameters = '';

        // Function name.
        let name = node.id ? node.id.name : '<anonymous function>';

        // Function parameters.
        if (node.params.length != 0) {
            parameters = node.params.map(param => ` \${ ${param.name} }`);
            parameters[0] = parameters[0].slice(1);
        }

        // Creating the code to insert.
        let beforeCode = `console.log(\`Entering ${name}(${parameters}) at line ${node.loc.start.line}\`);`;

        // Creating the new node.
        let beforeNodes = espree.parse(beforeCode, {ecmaVersion: 12}).body;

        // Adding the new node.
        node.body.body = beforeNodes.concat(node.body.body);
    }
    ```

Once all the changes are done, if we try the functions with the arrow function code we tried in the previous task, the result is:

![Third try](img/try3.png)

## Task 6: Testing.

## Task 7: Code Coverage.

## Task 8: CI with GitHub Actions.

## Task 9: Documentation with JSDoc.

## Task 10: Publishing the module in NPM and GitHub.
