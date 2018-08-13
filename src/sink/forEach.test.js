import { spy, resetHistory, useFakeTimers } from 'sinon'
import { expect, use } from 'chai'
import sinonChai from 'sinon-chai'
use(sinonChai)

import forEach from './forEach'

describe('Sink', function() {
  describe('forEach', function() {
    const source = spy()
    const operation = spy()
    let sink, talkback
    beforeEach(function() {
      resetHistory()
      sink = forEach(operation)
      sink(source)
      talkback = source.firstCall.args[1]
    })
    it('greets source', function() {
      expect(source).to.have.been.calledOnceWith(0)
    })
    it('pulls on greet', function() {
      source.resetHistory()
      talkback(0, source)
      expect(source).to.have.been.calledOnceWith(1)
    })
    it('pulls on every push', function() {
      talkback(0, source)
      source.resetHistory()
      for (let i = 0; i < 100; i++) {
        expect(source).to.have.callCount(i)
        talkback(1, i)
      }
      expect(source).to.have.callCount(100)
    })
    it('doesnt pull after end', function() {
      talkback(0, source)
      source.resetHistory()
      talkback(1, 0)
      talkback(1, 1)
      talkback(1, 2)
      talkback(2)
      talkback(1, 3)
      talkback(1, 4)
      talkback(1, 5)
      expect(source).to.have.callCount(3)
    })
  })
})
