import { describe, it, expect } from 'vitest';
import { moveItemInArray, transferArrayItem } from '../drag-utils';

describe('moveItemInArray', () => {
  it('moves item forward', () => {
    const a = [1,2,3,4,5];
    moveItemInArray(a, 0, 3);
    expect(a).toEqual([2,3,4,1,5]);
  });

  it('moves item backward', () => {
    const a = [1,2,3,4,5];
    moveItemInArray(a, 4, 1);
    expect(a).toEqual([1,5,2,3,4]);
  });

  it('no-op when from === to', () => {
    const a = [1,2,3];
    moveItemInArray(a, 1, 1);
    expect(a).toEqual([1,2,3]);
  });

  it('clamps out-of-bounds indices', () => {
    const a = [1,2,3];
    moveItemInArray(a, -5, 100);
    expect(a).toEqual([2,3,1]);
  });
});

describe('transferArrayItem', () => {
  it('moves item from source to target', () => {
    const src = ['a','b','c'];
    const dst = ['x','y'];
    transferArrayItem(src, dst, 1, 1);
    expect(src).toEqual(['a','c']);
    expect(dst).toEqual(['x','b','y']);
  });

  it('appends to end when targetIndex = length', () => {
    const src = ['a','b'];
    const dst = ['x'];
    transferArrayItem(src, dst, 0, 1);
    expect(dst).toEqual(['x','a']);
  });

  it('no-op when source is empty', () => {
    const src: string[] = [];
    const dst = ['x'];
    transferArrayItem(src, dst, 0, 0);
    expect(dst).toEqual(['x']);
  });
});
