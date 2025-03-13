import { describe, it, expect } from 'vitest';
import { getPathnameFromNode, setPathParameterNames } from './set-path-parameter-names.js';
import { IrNode } from '../types/index.js';

const irNodeDefaults: IrNode = {
  key: '',
  data: null,
  parent: null,
  childrenStatic: {},
  childrenDynamic: [],
};

describe('determineName', () => {
  it('meets expectations for pattern /static(root)/static/static/dynamic', () => {
    // The tree we will check /v1/posts/123
    const root: IrNode = { ...irNodeDefaults, key: '', parent: null };
    const v1: IrNode = { ...irNodeDefaults, key: 'v1', parent: root };
    root.childrenStatic = { v1 };
    const posts: IrNode = { ...irNodeDefaults, key: 'posts', parent: v1 };
    v1.childrenStatic = { posts };
    const postId: IrNode = { ...irNodeDefaults, key: '123', parent: posts };
    posts.childrenStatic = { postId };
    
    // Candidate leaves /v1/posts/456
    const candidate1: IrNode = { ...irNodeDefaults, key: '', parent: null };
    const v1_1: IrNode = { ...irNodeDefaults, key: 'v1', parent: candidate1 };
    candidate1.childrenStatic = { v1_1 };
    const posts_1: IrNode = { ...irNodeDefaults, key: 'posts', parent: v1_1 };
    v1_1.childrenStatic = { posts_1 };
    const postId_1: IrNode = { ...irNodeDefaults, key: '456', parent: posts_1 };
    posts_1.childrenStatic = { postId_1 };
    setPathParameterNames(postId, [posts_1]);
    expect(getPathnameFromNode(postId)).toEqual(['', 'v1', 'posts', '{post}']);
  });

  it('meets expectations for pattern /static(root)/static/static/dynamic/static/dynamic/dynamic', () => {
    const root: IrNode = { ...irNodeDefaults, key: '', parent: null };
    const v1: IrNode = { ...irNodeDefaults, key: 'v1', parent: root };
    root.childrenStatic = { v1 };
    const posts: IrNode = { ...irNodeDefaults, key: 'posts', parent: v1 };
    v1.childrenStatic = { posts };
    const postId: IrNode = { ...irNodeDefaults, key: '123', parent: posts };
    posts.childrenStatic = { postId };
    const animal: IrNode = { ...irNodeDefaults, key: 'animal', parent: postId };
    postId.childrenStatic = { animal };
    const animalSpecies: IrNode = { ...irNodeDefaults, key: 'dog', parent: animal };
    animal.childrenStatic = { animalSpecies };
    const number: IrNode = { ...irNodeDefaults, key: '1', parent: animalSpecies };
    animalSpecies.childrenStatic = { number };
    
    // Candidate leaves
    const candidate1: IrNode = { ...irNodeDefaults, key: '', parent: null };
    const v1_1: IrNode = { ...irNodeDefaults, key: 'v1', parent: candidate1 };
    candidate1.childrenStatic = { v1_1 };
    const posts_1: IrNode = { ...irNodeDefaults, key: 'posts', parent: v1_1 };
    v1_1.childrenStatic = { posts_1 };
    const postId_1: IrNode = { ...irNodeDefaults, key: '456', parent: posts_1 };
    posts_1.childrenStatic = { postId_1 };
    const animal_1: IrNode = { ...irNodeDefaults, key: 'animal', parent: postId_1 };
    postId_1.childrenStatic = { animal_1 };
    const animalSpecies_1: IrNode = { ...irNodeDefaults, key: 'cat', parent: animal_1 };
    animal_1.childrenStatic = { animalSpecies_1 };
    const number_1: IrNode = { ...irNodeDefaults, key: '2', parent: animalSpecies_1 };
    animalSpecies_1.childrenStatic = { number_1 };

    setPathParameterNames(number, [number_1]);
    expect(getPathnameFromNode(number)).toEqual(['', 'v1', 'posts', '{post}', 'animal', '{animal}', '{param6}']);
  });

  it('meets expectations for pattern /static(root)/static/static/static/static/dynamic', () => {
    const root: IrNode = { ...irNodeDefaults, key: '', parent: null };
    const v1: IrNode = { ...irNodeDefaults, key: 'a', parent: root };
    root.childrenStatic = { v1 };
    const posts: IrNode = { ...irNodeDefaults, key: 'b', parent: v1 };
    v1.childrenStatic = { posts };
    const postId: IrNode = { ...irNodeDefaults, key: 'c', parent: posts };
    posts.childrenStatic = { postId };
    const animal: IrNode = { ...irNodeDefaults, key: 'd', parent: postId };
    postId.childrenStatic = { animal };
    const animalSpecies: IrNode = { ...irNodeDefaults, key: '1', parent: animal };
    animal.childrenStatic = { animalSpecies };
    
    // Candidate leaves
    const candidate1: IrNode = { ...irNodeDefaults, key: '', parent: null };
    const v1_1: IrNode = { ...irNodeDefaults, key: 'a', parent: candidate1 };
    candidate1.childrenStatic = { v1_1 };
    const posts_1: IrNode = { ...irNodeDefaults, key: 'b', parent: v1_1 };
    v1_1.childrenStatic = { posts_1 };
    const postId_1: IrNode = { ...irNodeDefaults, key: 'c', parent: posts_1 };
    posts_1.childrenStatic = { postId_1 };
    const animal_1: IrNode = { ...irNodeDefaults, key: 'd', parent: postId_1 };
    postId_1.childrenStatic = { animal_1 };
    const animalSpecies_1: IrNode = { ...irNodeDefaults, key: '2', parent: animal_1 };
    animal_1.childrenStatic = { animalSpecies_1 };

    setPathParameterNames(animalSpecies, [animalSpecies_1]);
    expect(getPathnameFromNode(animalSpecies)).toEqual(['', 'a', 'b', 'c', 'd', '{d}']);
  });
});