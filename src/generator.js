import { into, map, identity } from 'ramda'

function* numbers(start, end) {
  for(let curr = start; curr <= end; curr++)
    yield curr
}

const arr = into([], map(identity), numbers(1, 3))

console.log(arr)
