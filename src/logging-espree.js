import * as escodegen from "escodegen";
import * as espree from "espree";
import * as estraverse from "estraverse";
import * as fs from "fs/promises";

/**
 * Read the file with the JS program, calls addLogin to add the login messages and writes the output.
 * @param {string} inputFile Input file's name.
 * @param {string} outputFile Output file's name.
 */
export async function transpile(inputFile, outputFile) {
    let code = fs.readFileSync(inputFile, 'utf8');
    code = addLogging(code);
    fs.writeFile(outputFile, code, err => {
      if (err) {
        console.error(err);
        return;
      }
    });
}

/** 
 * Builds the AST and traverses it, searching for function nodes.
 * Calls addBeforeNode to transform the AST.
 * @param {string} code Source code.
 * @returns Transformed AST.
 */
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

/**
 * AST transformation.
 * @param {AST function type node} node AST node.
 */
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

console.log(
    addLogging(
       `function foo(a, b, c) {
            let x = 'tutu';
            let y = (function (x) { return x * x })(2);
            let z = (e => { return e + 1 })(4);
            console.log(x,y,z);
        }
        foo(1, 'wut', 3);
    `)
);
