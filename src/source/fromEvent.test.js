import { spy, resetHistory } from 'sinon'
import { expect, use } from 'chai'
import sinonChai from 'sinon-chai'
use(sinonChai)

import fromEvent from './fromEvent'

describe('Source', function() {
  describe('fromEvent', function() {
    const sink = spy()
    const node = {
      addEventListener: spy(),
      removeEventListener: spy(),
    }
    beforeEach(resetHistory)
    it('greets back', function() {
      const source = fromEvent(node, 'event')
      source(1)
      source(2)
      expect(sink).to.not.have.been.called
      source(0, sink)
      expect(sink).to.have.been.calledOnceWith(0)
    })
    it('subscribes on start', function() {
      const source = fromEvent(node, Symbol)
      expect(node.addEventListener).to.not.have.been.called
      source(0, sink)
      expect(node.addEventListener).to.have.been.calledOnceWith(Symbol)
    })
    it('pushes events', function() {
      const source = fromEvent(node, 'event')
      source(0, sink)
      const callback = node.addEventListener.firstCall.args[1]
      sink.resetHistory()
      callback(Symbol)
      expect(sink).to.have.been.calledOnceWith(1, Symbol)
    })
    it('unsubscribes on end', function() {
      const source = fromEvent(node, Symbol)
      source(0, sink)
      const callback = node.addEventListener.firstCall.args[1]
      const talkback = sink.firstCall.args[1]
      talkback(0)
      talkback(1)
      expect(node.removeEventListener).to.not.have.been.called
      talkback(2)
      expect(node.removeEventListener).to.have.been.calledOnceWith(Symbol, callback)
    })
  })
})
