/**
 * @license
 * Copyright 2015 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating PHP for variable blocks.
 */

import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.PHP.variables');

import {NameType} from '../../core/names.js';
import {phpGenerator, Order} from '../php.js';


phpGenerator.forBlock['variables_get'] = function(block, generator) {
  // Variable getter.
  const code =
      generator.nameDB_.getName(
        block.getFieldValue('VAR'), NameType.VARIABLE);
  return [code, Order.ATOMIC];
};

phpGenerator.forBlock['variables_set'] = function(block, generator) {
  // Variable setter.
  const argument0 =
      generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '0';
  const varName =
      generator.nameDB_.getName(
        block.getFieldValue('VAR'), NameType.VARIABLE);
  return varName + ' = ' + argument0 + ';\n';
};
