import { spy, resetHistory, useFakeTimers } from 'sinon'
import { expect, use } from 'chai'
import sinonChai from 'sinon-chai'
use(sinonChai)

import fromIterable from '~/source/fromIterable'
import map from './map'
import forEach from '~/sink/forEach'
import { start } from 'repl';

describe('Transformator', function() {
  describe('map', function() {
    it('greets source and greets back', function() {
      const source = spy((start, sink) => sink(0))
      const operation = spy()
      const operator = map(operation)(source)
      const sink = spy()
      operator(2, sink)
      operator(1, sink)
      expect(source).to.not.have.been.called
      expect(sink).to.not.have.been.called
      operator(0, sink)
      expect(source).to.have.been.calledOnceWith(0)
      expect(sink).to.have.been.calledOnceWith(0)
    })
    it('maps every item with operation', function() {
      const log = spy()
      const operation = spy(x => x + 1)
      fromIterable([1,5,6,-3,-43])
      |> map(operation)
      |> forEach(log)
      expect(log.args).to.deep.equals([[2],[6],[7],[-2],[-42]])
      expect(operation).to.have.callCount(5)
    })
  })
})
