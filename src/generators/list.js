// @flow

import type {ListNodeType, GeneratedCodeType, NodeType} from '../types'

export default ({value}: ListNodeType): GeneratedCodeType =>
  `[${value
    .map((item: NodeType): string => {
      const Generator = require('./generator').default
      return Generator(item)
    })
    .join(', ')}]`
