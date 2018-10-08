// @flow

import execute from '../interpreter'
import compile from '../compiler'
import parse from '../parsers/parser'

const tests = [
  {
    sourceCode: `null`,
    output: null
  },
  {
    sourceCode: `true`,
    output: true
  },
  {
    sourceCode: `$`,
    input: true,
    output: true
  },
  {
    sourceCode: `$`,
    input: 98,
    output: 98
  },
  {
    sourceCode: `.bar`,
    input: { bar: 4, baz: 'hello' },
    output: 4
  },
  {
    sourceCode: `.$shit`,
    input: { $shit: null, baz: 'hello' },
    output: null
  },
  {
    sourceCode: `[0.14, true, "true 2"]`,
    output: [0.14, true, 'true 2']
  },
  {
    sourceCode: `[[false], [true, null]]`,
    output: [[false], [true, null]]
  },
  {
    sourceCode: `false | true`,
    output: true
  },
  {
    sourceCode: `.foo | .bar`,
    input: {
      foo: {
        bar: 'hello'
      }
    },
    output: 'hello'
  },
  {
    sourceCode: `.foo | .bar | .baz`,
    input: {
      foo: {
        bar: {
          baz: 'world'
        }
      }
    },
    output: 'world'
  },
  {
    sourceCode: `.apple.pear`,
    input: {
      apple: {
        pear: 42
      }
    },
    output: 42
  },
  {
    sourceCode: `.apple.pear.bar`,
    input: {
      apple: {
        pear: { bar: false }
      }
    },
    output: false
  },
  {
    sourceCode: `null: true`,
    output: [null, true]
  },
  {
    sourceCode: `{
      "foo": [-42, $],
      "bar": {
        "message": "Hello World"
      }
    }`,
    input: 42,
    output: {
      foo: [-42, 42],
      bar: { message: 'Hello World' }
    }
  },
  {
    sourceCode: `{"foo": ("bar" | "baz")}`,
    output: {
      foo: 'baz'
    }
  },
  {
    sourceCode: `{"foo": ("bar" | "baz")}["foo"]`,
    output: 'baz'
  },
  {
    sourceCode: `[3, 2][0]`,
    output: 3
  },
  {
    sourceCode: `[3, 2][0] : [3, 2][1]`,
    output: [3, 2]
  },
  {
    sourceCode: `[3, 2][0] | [3, 2][1]`,
    output: 2
  },
  {
    sourceCode: `join " "`,
    input: ['Hello', 'World'],
    output: 'Hello World'
  },
  {
    sourceCode: `map \\" "`,
    input: ['Hello', 'World'],
    output: [' ', ' ']
  },
  {
    sourceCode: `{"original": $.foo} | {"new": $}`,
    input: { foo: 42 },
    output: { new: { original: 42 } }
  },
  {
    sourceCode: `map $ => {"original": $.foo} | map $=> {"new": $}`,
    input: [{ foo: 42 }, { foo: 'hello' }],
    output: [{ new: { original: 42 } }, { new: { original: 'hello' } }]
  },
  {
    sourceCode: `map $ => {"original": $.foo} | "foo"`,
    input: [{ foo: 42 }, { foo: 'hello' }],
    output: 'foo'
  }
]

describe('interpreter', () => {
  tests.forEach(
    ({
      sourceCode,
      output,
      input
    }: {
      sourceCode: string,
      output: mixed,
      input?: mixed
    }) => {
      it(`executes ${sourceCode}`, () => {
        expect(execute(sourceCode)(input)).toEqual(output)
      })

      it(`correct target code ${sourceCode}`, () => {
        expect(compile(sourceCode)).toMatchSnapshot()
      })

      it(`correct target tree ${sourceCode}`, () => {
        expect(parse(sourceCode)).toMatchSnapshot()
      })
    }
  )

  it('throws syntax error on invalid source code', () => {
    expect(() => {
      execute('¡')
    }).toThrow(SyntaxError)
  })
})