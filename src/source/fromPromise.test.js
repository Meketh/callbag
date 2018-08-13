import { spy, resetHistory } from 'sinon'
import { expect, use } from 'chai'
import sinonChai from 'sinon-chai'
use(sinonChai)

import fromPromise from './fromPromise'

describe('Source', function() {
  describe('fromPromise', function() {
    const sink = spy()
    const promise = {
      then: spy(() => promise),
      catch: spy(() => promise),
    }
    let source = fromPromise(promise)
    beforeEach(function() {
      resetHistory()
      source = fromPromise(promise)
      source(0, sink)
    })
    it('greets back', function() {
      expect(sink).to.have.been.calledOnceWith(0)
      source(1)
      source(2)
      expect(sink).to.have.been.calledOnce
    })
    it('pushes and ends on resolve', function() {
      promise.then.callArgWith(0, Symbol)
      promise.then.callArgWith(0, Object)
      expect(sink).to.have.been.calledThrice
      expect(sink).to.have.been.calledWith(0)
      expect(sink).to.have.been.calledWith(1, Symbol)
      expect(sink).to.not.have.been.calledWith(1, Object)
      expect(sink).to.have.been.calledWith(2)
    })
    it('ends on error', function() {
      promise.catch.callArgWith(0, Symbol)
      promise.catch.callArgWith(0, Object)
      expect(sink).to.have.been.calledTwice
      expect(sink).to.have.been.calledWith(0)
      expect(sink).to.have.been.calledWith(2, Symbol)
      expect(sink).to.not.have.been.calledWith(2, Object)
    })
    it('doesnt push after end', function() {
      const talkback = sink.firstCall.args[1]
      talkback(0)
      talkback(1)
      talkback(2)
      expect(sink).to.have.been.calledOnceWith(0)
      promise.then.callArgWith(0, Symbol)
      promise.catch.callArgWith(0, Symbol)
      expect(sink).to.have.been.calledOnceWith(0)
    })
  })
})
