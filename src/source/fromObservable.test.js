import { spy, resetHistory } from 'sinon'
import { expect, use } from 'chai'
import sinonChai from 'sinon-chai'
use(sinonChai)

import fromObservable from './fromObservable'

describe('Source', function() {
  describe('fromObservable', function() {
    const subscription = { unsubscribe: spy() }
    const observable = { subscribe: spy(() => subscription) }
    const sink = spy()
    beforeEach(resetHistory)
    it('greets back', function() {
      const source = fromObservable(observable)
      source(1)
      source(2)
      expect(sink).to.not.have.been.called
      source(0, sink)
      expect(sink).to.have.been.calledOnceWith(0)
    })
    it('subscribes only on start', function() {
      const source = fromObservable(observable)
      source(0, sink)
      expect(observable.subscribe).to.have.been.calledOnce
    })
    it('unsubscribes on end', function() {
      const source = fromObservable(observable)
      source(0, sink)
      const talkback = sink.firstCall.args[1]
      talkback(0)
      talkback(1)
      expect(subscription.unsubscribe).to.not.have.been.called
      talkback(2)
      expect(subscription.unsubscribe).to.have.been.calledOnce

      sink.resetHistory()
      const unsubscribeFunction = spy()
      const observableWithUnsubscribeFunction = { subscribe: spy(() => unsubscribeFunction) }
      const source2 = fromObservable(observableWithUnsubscribeFunction)
      source2(0, sink)
      const talkback2 = sink.firstCall.args[1]
      talkback(0)
      talkback(1)
      expect(unsubscribeFunction).to.not.have.been.called
      talkback2(2)
      expect(unsubscribeFunction).to.have.been.calledOnce
    })
    describe('once started', function() {
      let source, subscriptor
      beforeEach(function(){
        source = fromObservable(observable)
        source(0, sink)
        subscriptor = observable.subscribe.firstCall.args[0]
        sink.resetHistory()
      })
      it('pushes data on next', function() {
        subscriptor.next(Symbol)
        expect(sink).to.have.been.calledOnceWith(1, Symbol)
      })
      it('ends on completion', function() {
        subscriptor.complete()
        expect(sink).to.have.been.calledOnceWith(2)
      })
      it('ends on error', function() {
        subscriptor.error(Symbol)
        expect(sink).to.have.been.calledOnceWith(2, Symbol)
      })
    })
  })
})
