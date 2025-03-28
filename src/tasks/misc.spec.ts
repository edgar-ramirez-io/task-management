describe('misc', () => {
  it('test Set and Map', function () {
    let set = new Set()
    set.add(1)
    expect(set.has(1)).toBe(true)

    let map = new Map()
    map.set(1, (map.get(1) || 0) + 1)
    expect(map.get(1)).toBe(1)

    map.set(1, (map.get(1) || 0) + 1)
    expect(map.get(1)).toBe(2)
  })

  it('majorityElement', function () {
    const hashMap: { [key: number]: number } = {}
    const arr = [1, 2, 3, 4, 5, 1, 1, 1]

    for (let num of arr) {
      hashMap[num] = (hashMap[num] || 0) + 1
    }

    let foundNumber = -1
    for (let key in hashMap) {
      if (hashMap[key] >= arr.length / 2) {
        foundNumber = Number(key)
        break
      }
    }

    expect(foundNumber).toBe(1)

    expect(7 % 3).toBe(1)
  })

  it('create Array and set defaults', function () {
    const array = [1, 2]
    const tempArray = new Array(2).fill(-1)

    expect(tempArray).toStrictEqual([-1, -1])
  })

  it('create a Set', function () {
    let set = new Set<number>()

    set.add(1)

    expect(set.has(1)).toBe(true)
    expect(set.has(2)).toBe(false)

    class MySet {
      mySet: Set<number> // use instead dict and array
      dict: { [key: string]: number }
      array: Array<number>

      constructor() {
        this.mySet = new Set()
        this.dict = {}
        this.array = []
      }

      insert(val: number): boolean {
        this.mySet.add(val)
        if (this.dict[val] !== undefined) {
          return false
        }
        this.array.push(val)
        this.dict[val] = this.array.length - 1
        return true
      }

      remove(val: number): boolean {
        const idx = this.dict[val]
        if (idx === undefined) {
          return false
        }

        const last = this.array[this.array.length - 1] // last
        this.array[idx] = last
        this.dict[last] = idx // update idx of re-arrenged item

        delete this.dict[val]
        this.array.pop()

        this.mySet.delete(val)
        return true
      }

      getRandom(): number {
        const array = [...this.mySet]
        let randomIdx = Math.floor(Math.random() * this.array.length)

        return this.array[randomIdx]
      }
    }

    const mySet = new MySet()

    expect(mySet.mySet.has(1)).toBe(false)
    // test insert
    // Returns true if the item was not present, false otherwise.
    expect(mySet.insert(1)).toBe(true)
    expect(mySet.mySet.has(1)).toBe(true)
    // test getRandom
    expect(mySet.getRandom()).toBe(1)
    // test remove
    // Returns true if the item was present, false otherwise.
    expect(mySet.remove(1)).toBe(true)
    expect(mySet.mySet.has(1)).toBe(false)
    // test getRandom
    expect(mySet.getRandom()).toBe(undefined)

    const mySet2 = new MySet()
    expect(mySet2.insert(1)).toBe(true)
    expect(mySet2.remove(2)).toBe(false)
    expect(mySet2.insert(2)).toBe(true)
    let result = mySet2.getRandom()
    expect(result === 1 || result === 2).toBe(true)
    expect(mySet2.remove(1)).toBe(true)
    expect(mySet2.insert(2)).toBe(false)
    expect(mySet2.getRandom()).toBe(2)

    const mySet3 = new MySet()
    expect(mySet3.insert(0)).toBe(true)
    expect(mySet3.getRandom()).toBe(0)
  })

  it('WordDictionary', () => {
    class WordDictionary {
      trie: { [key: string]: {} }

      constructor() {
        this.trie = {}
      }

      add(word: string) {
        let node = this.trie

        for (let char of word) {
          if (!node[char]) {
            node[char] = {}
          }
          node = node[char]
        }
        node['$'] = true
      }

      search(word: string): boolean {
        return this.searchInNode(word, 0, this.trie)
      }

      private searchInNode(
        word: string,
        index: number,
        node: { [key: string]: {} },
      ): boolean {
        if (index === word.length) {
          return node['$'] === true
        }

        const char = word[index]
        if (char === '.') {
          for (const char in node) {
            if (
              char !== '$' &&
              this.searchInNode(word, index + 1, node[char])
            ) {
              return true
            }
          }
          return false
        } else {
          if (!node[char]) {
            return false
          }
          return this.searchInNode(word, index + 1, node[char])
        }
      }
    }

    const wordDictionary = new WordDictionary()
    expect(wordDictionary.add('test')).toBeUndefined()
    expect(wordDictionary.search('test')).toBe(true)
    expect(wordDictionary.search('test2')).toBe(false)
    expect(wordDictionary.add('test2')).toBeUndefined()
    expect(wordDictionary.search('test2')).toBe(true)
    expect(wordDictionary.search('tes.')).toBe(true)

    expect(wordDictionary.add('bad')).toBeUndefined()
    expect(wordDictionary.add('dad')).toBeUndefined()
    expect(wordDictionary.add('mad')).toBeUndefined()
    expect(wordDictionary.search('pad')).toBe(false)
    expect(wordDictionary.search('bad')).toBe(true)
    expect(wordDictionary.search('.ad')).toBe(true)
    expect(wordDictionary.search('b..')).toBe(true)
  })
})
