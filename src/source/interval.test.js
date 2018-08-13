import { spy, resetHistory, useFakeTimers } from 'sinon'
import { expect, use } from 'chai'
import sinonChai from 'sinon-chai'
use(sinonChai)

import interval from './interval'

describe('Source', function() {
  describe('interval', function() {
    const sink = spy()
    let clock, source, talkback
    beforeEach(function() {
      clock = useFakeTimers()
      resetHistory()
      source = interval(100)
      source(0, sink)
      talkback = sink.firstCall.args[1]
    })
    afterEach(function() {
      talkback(2)
      clock.restore()
    })
    it('greets back', function() {
      expect(sink).to.have.been.calledOnceWith(0)
      source(1)
      source(2)
      expect(sink).to.have.been.calledOnce
    })
    it('pushes every time period elapses', function() {
      expect(sink).to.have.been.calledOnceWith(0)
      clock.tick(100)
      expect(sink).to.have.callCount(2)
      expect(sink.lastCall.args).to.deep.equals([1, 0])
      clock.tick(100)
      expect(sink).to.have.callCount(3)
      clock.tick(50)
      expect(sink).to.have.callCount(3)
      expect(sink.lastCall.args).to.deep.equals([1, 1])
      clock.tick(50)
      expect(sink).to.have.callCount(4)
      expect(sink.lastCall.args).to.deep.equals([1, 2])
      clock.tick(300)
      expect(sink).to.have.callCount(7)
      expect(sink.lastCall.args).to.deep.equals([1, 5])
    })
    it('doesnt push after end', function() {
      clock.tick(666)
      expect(sink).to.have.callCount(7)
      talkback(0)
      talkback(1)
      clock.tick(333)
      expect(sink).to.have.callCount(10)
      clock.tick(1)
      expect(sink).to.have.callCount(11)
      talkback(2)
      clock.tick(666)
      expect(sink).to.have.callCount(11)
      expect(sink.lastCall.args).to.deep.equals([1, 9])
    })
  })
})
