import assert from 'assert';
import User from '../app/models/User.js';

describe('Model', function() {
  describe('#Select', function() {
    it('should return +1 when the User ID:1 is exist', async function() {
      const user = await User.findByPk(1);
      if(user){
        assert.strict.equal(user.id,1);
      }else{
        assert.fail('There is no user with id:1');
      }
    });
  });
});