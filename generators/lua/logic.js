/**
 * @license
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Lua for logic blocks.
 */

import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Lua.logic');

import {luaGenerator, Order} from '../lua.js';


luaGenerator.forBlock['controls_if'] = function(block, generator) {
  // If/elseif/else condition.
  let n = 0;
  let code = '';
  if (generator.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += generator.injectId(generator.STATEMENT_PREFIX, block);
  }
  do {
    const conditionCode =
        generator.valueToCode(block, 'IF' + n, Order.NONE) || 'false';
    let branchCode = generator.statementToCode(block, 'DO' + n);
    if (generator.STATEMENT_SUFFIX) {
      branchCode = generator.prefixLines(
          generator.injectId(generator.STATEMENT_SUFFIX, block),
          generator.INDENT) + branchCode;
    }
    code +=
        (n > 0 ? 'else' : '') + 'if ' + conditionCode + ' then\n' + branchCode;
    n++;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE') || generator.STATEMENT_SUFFIX) {
    let branchCode = generator.statementToCode(block, 'ELSE');
    if (generator.STATEMENT_SUFFIX) {
      branchCode =
          generator.prefixLines(
            generator.injectId(
              generator.STATEMENT_SUFFIX, block),
            generator.INDENT) +
          branchCode;
    }
    code += 'else\n' + branchCode;
  }
  return code + 'end\n';
};

luaGenerator.forBlock['controls_ifelse'] = luaGenerator.forBlock['controls_if'];

luaGenerator.forBlock['logic_compare'] = function(block, generator) {
  // Comparison operator.
  const OPERATORS =
      {'EQ': '==', 'NEQ': '~=', 'LT': '<', 'LTE': '<=', 'GT': '>', 'GTE': '>='};
  const operator = OPERATORS[block.getFieldValue('OP')];
  const argument0 =
        generator.valueToCode(block, 'A', Order.RELATIONAL) || '0';
  const argument1 =
        generator.valueToCode(block, 'B', Order.RELATIONAL) || '0';
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, Order.RELATIONAL];
};

luaGenerator.forBlock['logic_operation'] = function(block, generator) {
  // Operations 'and', 'or'.
  const operator = (block.getFieldValue('OP') === 'AND') ? 'and' : 'or';
  const order = (operator === 'and') ? Order.AND : Order.OR;
  let argument0 = generator.valueToCode(block, 'A', order);
  let argument1 = generator.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    const defaultArgument = (operator === 'and') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

luaGenerator.forBlock['logic_negate'] = function(block, generator) {
  // Negation.
  const argument0 =
        generator.valueToCode(block, 'BOOL', Order.UNARY) || 'true';
  const code = 'not ' + argument0;
  return [code, Order.UNARY];
};

luaGenerator.forBlock['logic_boolean'] = function(block, generator) {
  // Boolean values true and false.
  const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
  return [code, Order.ATOMIC];
};

luaGenerator.forBlock['logic_null'] = function(block, generator) {
  // Null data type.
  return ['nil', Order.ATOMIC];
};

luaGenerator.forBlock['logic_ternary'] = function(block, generator) {
  // Ternary operator.
  const value_if = generator.valueToCode(block, 'IF', Order.AND) || 'false';
  const value_then =
        generator.valueToCode(block, 'THEN', Order.AND) || 'nil';
  const value_else = generator.valueToCode(block, 'ELSE', Order.OR) || 'nil';
  const code = value_if + ' and ' + value_then + ' or ' + value_else;
  return [code, Order.OR];
};
