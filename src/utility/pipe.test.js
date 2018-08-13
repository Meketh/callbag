import { spy, resetHistory, useFakeTimers } from 'sinon'
import { expect, use } from 'chai'
import sinonChai from 'sinon-chai'
use(sinonChai)

import pipe from './pipe'

describe('Utility', function() {
  describe('pipe', function() {
    beforeEach(resetHistory)
    it('runs every function orderly', function() {
      const operation = [
        spy(x => x + 1),
        spy(x => x + 2),
        spy(x => x - 3),
        spy(x => Infinity),
      ]
      pipe(0, ...operation)
      expect(operation[0]).to.have.been.returned(1)
      expect(operation[1]).to.have.been.returned(3)
      expect(operation[2]).to.have.been.returned(0)
      expect(operation[3]).to.have.been.returned(Infinity)
      operation.reduce(
        (a, b) => expect(a).to.have.been.calledBefore(b) && a
      )
    })
  })
})
