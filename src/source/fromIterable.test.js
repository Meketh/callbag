import { spy, resetHistory } from 'sinon'
import { expect, use } from 'chai'
import sinonChai from 'sinon-chai'
use(sinonChai)

import fromIterable from './fromIterable'

describe('Source', function() {
  describe('fromIterable', function() {
    const sink = spy()
    beforeEach(resetHistory)
    it('greets back', function() {
      const source = fromIterable([])
      source(1)
      source(2)
      expect(sink).to.not.have.been.called
      source(0, sink)
      expect(sink).to.have.been.calledOnceWith(0)
    })
    it('ends on done', function() {
      const source = fromIterable([])
      source(0, sink)
      const talkback = sink.firstCall.args[1]
      sink.resetHistory()
      talkback(1)
      talkback(1)
      expect(sink).to.have.been.calledOnceWith(2)
    })
    it('pushes each element in order', function() {
      const arr = [1,3,2,9,5,6]
      const source = fromIterable(arr)
      source(0, sink)
      const talkback = sink.firstCall.args[1]
      sink.resetHistory()
      arr.forEach(x => talkback(1))
      expect(sink.args).to.be.deep.equals([[1,1],[1,3],[1,2],[1,9],[1,5],[1,6]])
      sink.resetHistory()
      talkback(1)
      expect(sink).to.have.been.calledOnceWith(2)
    })
    it('doesnt push after end', function() {
      const source = fromIterable([])
      source(0, sink)
      const talkback = sink.firstCall.args[1]
      talkback(2)
      expect(sink).to.have.been.calledOnceWith(0)
      talkback(1)
      talkback(1)
      expect(sink).to.have.been.calledOnceWith(0)
    })
  })
})
