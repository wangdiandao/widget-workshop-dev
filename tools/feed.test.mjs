import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeFeed, safeHttps} from '../examples/information-feed/model.js';

test('unsafe navigation schemes and embedded credentials are rejected', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,hello', 'file:///C:/x', 'http://example.com', 'https://user:password@example.com']) {
    assert.equal(safeHttps(url), null);
  }
  assert.equal(safeHttps('https://example.com/a'), 'https://example.com/a');
});
test('remote HTML stays text; duplicate IDs and invalid rows do not expand the model', () => {
  const result = normalizeFeed({items: [
    {id: '1', title: '<img src=x onerror=alert(1)>', url: 'javascript:alert(1)'},
    {id: '1', title: 'duplicate'}, {id: '2', title: ' '.repeat(3)}, null
  ]});
  assert.deepEqual(result.items, [{id: '1', title: '<img src=x onerror=alert(1)>', url: null}]);
});
test('feed input and rendered rows are bounded', () => {
  assert.throws(() => normalizeFeed({items: Array(501).fill(null)}));
  assert.throws(() => normalizeFeed({items: 'bad'}));
  assert.equal(normalizeFeed({items: Array.from({length: 500}, (_, i) => ({id: String(i), title: 'row'}))}).items.length, 50);
});
