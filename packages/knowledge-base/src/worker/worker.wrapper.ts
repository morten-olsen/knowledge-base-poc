import { PGlite } from '@electric-sql/pglite'
import { vector } from '@electric-sql/pglite/vector'
import { worker } from '@electric-sql/pglite/worker'

worker({
  async init() {
    // Create and return a PGlite instance
    return new PGlite({
      extensions: {
        vector,
      }
    })
  },
})
