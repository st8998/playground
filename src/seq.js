import { reduce, forEach, clone } from 'ramda'
import Promise, { delay } from 'bluebird'

const log = ::console.log
const delayLog = (time)=> delay(time).then(log(time))

// Promise
const doSeqPromise = reduce(
  (promise, time)=> promise.then(
    ()=> delayLog(time)), Promise.resolve(0))

//recursion
const doSeqRecursion = function(arr) {
  function rec(arr) {
    const time = arr.shift()
    const promise = delayLog(time)

    return arr.length > 0 ? promise.then(()=> rec(arr)) : promise
  }

  return rec(clone(arr))
}

// generators
const doSeqGenerators = Promise.coroutine(function* (arr) {
  for (const time of arr)
    yield delayLog(time)
})

// async/await
const doSeqAsync = async function(arr) {
  for (let time of arr)
    await delayLog(time)
}

const input = [400, 300, 200, 100]

forEach((func)=> func(input), [doSeqPromise, doSeqRecursion, doSeqGenerators, doSeqAsync])