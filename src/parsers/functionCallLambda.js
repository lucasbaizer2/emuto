// @flow

import Parsimmon from 'parsimmon'

import type {
  FunctionCallLambdaNodeType,
  NodeType,
  IdentifierNodeType
} from '../types'

const FunctionCallLambdaParser = Parsimmon.lazy((): mixed => {
  const TupleParser = require('./tuple/tuple').default
  const IdentifierParser = require('./identifier').default
  return Parsimmon.seq(
    IdentifierParser,
    Parsimmon.optWhitespace,
    Parsimmon.alt(Parsimmon.regexp(/\$\s*=>\s*/), Parsimmon.string('\\')),
    Parsimmon.optWhitespace,
    TupleParser
  ).map(
    ([left, _, __, ___, right]: [
      IdentifierNodeType,
      mixed,
      mixed,
      mixed,
      NodeType
    ]): FunctionCallLambdaNodeType => ({
      type: 'functionCallLambda',
      value: {
        left,
        right
      }
    })
  )
})

export default FunctionCallLambdaParser