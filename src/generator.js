import { into, map, identity, transduce, uncurryN } from 'ramda'

function* numbers(start, end) {
  for(let curr = start; curr <= end; curr++)
    yield curr
}

const noop = identity

const each = uncurryN(2, func => transduce(identity, (_, val)=> func(val), null))

const logEach = each(::console.log)

logEach(numbers(1, 3)) //=> 1 2 3
logEach([1, 2, 3, 4]) //=> 1 2 3 4
