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

  describe('LRUCache', () => {
    class Node {
      constructor(
        public key: number,
        public value: number,
        public prev: Node | null = null,
        public next: Node | null = null,
      ) {}
    }

    class LRUCache {
      dict: Map<number, Node>
      head: Node
      tail: Node

      constructor(private capacity: number) {
        this.capacity = capacity
        this.dict = new Map()
        this.head = new Node(-1, -1)
        this.tail = new Node(-1, -1)

        this.head.next = this.tail
        this.tail.prev = this.head
      }

      // int get(int key) Return the value of the key
      // if the key exists, otherwise return -1.
      get(key: number): number {
        if (!this.dict.has(key)) {
          return -1
        }
        const node = this.dict.get(key)
        this.remove(node)
        this.add(node)
        return node.value
      }

      // Update the value of the key if the key exists.
      // Otherwise, add the key-value pair to the cache.
      // If the number of keys exceeds the capacity from
      // this operation, evict the least recently used key.
      put(key: number, value: number) {
        if (this.dict.has(key)) {
          this.remove(this.dict.get(key))
        }

        let node = new Node(key, value)
        this.add(node)
        this.dict.set(key, node)

        if (this.dict.size > this.capacity) {
          const nodeToDelete = this.head.next
          this.remove(nodeToDelete)
          this.dict.delete(nodeToDelete.key)
        }
      }

      private add(node: Node): void {
        const last = this.tail.prev
        last.next = node
        node.prev = last
        node.next = this.tail
        this.tail.prev = node
      }

      private remove(node: Node): void {
        node.prev.next = node.next
        node.next.prev = node.prev
      }
    }
    it('constructor', () => {
      expect(() => {
        let cache = new LRUCache(2)
      }).not.toThrow()
    })

    it('test it', () => {
      let cache = new LRUCache(2)

      expect(() => {
        cache.put(1, 1)
      }).not.toThrow()
      expect(() => {
        cache.put(2, 2)
      }).not.toThrow()
      expect(cache.get(1)).toBe(1)
      expect(() => {
        cache.put(3, 3)
      }).not.toThrow()
      expect(cache.get(2)).toBe(-1)
      expect(() => {
        cache.put(4, 4)
      }).not.toThrow()
      expect(cache.get(1)).toBe(-1)
      expect(cache.get(3)).toBe(3)
      expect(cache.get(4)).toBe(4)
    })

    it('leetcode test case 1', () => {
      let cache = new LRUCache(2)

      expect(() => {
        cache.put(1, 0)
      }).not.toThrow()
      expect(() => {
        cache.put(2, 2)
      }).not.toThrow()
      expect(cache.get(1)).toBe(0)
      expect(() => {
        cache.put(3, 3)
      }).not.toThrow()
      expect(cache.get(2)).toBe(-1)
      expect(() => {
        cache.put(4, 4)
      }).not.toThrow()
      expect(cache.get(1)).toBe(-1)
      expect(cache.get(3)).toBe(3)
      expect(cache.get(4)).toBe(4)
    })
  })

  describe('BSTIterator', () => {
    class TreeNode {
      constructor(
        public val?: number,
        public left?: TreeNode | null,
        public right?: TreeNode | null,
      ) {
        this.val = val || 0
        this.left = left
        this.right = right
      }
    }
    class BSTIterator {
      stack: Array<TreeNode>

      constructor(root: TreeNode) {
        this.stack = []
        this.leftMostInOrder(root)
      }

      hasNext(): boolean {
        return this.stack.length > 0
      }

      next(): number {
        const current = this.stack.pop()
        if (current?.right) {
          this.leftMostInOrder(current.right)
        }
        return current?.val
      }

      leftMostInOrder(root: TreeNode) {
        while (root) {
          this.stack.push(root)
          root = root.left
        }
      }
    }
    it('constructor', () => {
      expect(() => {
        let root = new TreeNode(1)
        let _ = new BSTIterator(root)
      }).not.toThrow()
    })

    it('happy path', () => {
      let root = new TreeNode(2, new TreeNode(1), new TreeNode(3))
      let iterator = new BSTIterator(root)

      expect(iterator.hasNext()).toBe(true)
      expect(iterator.next()).toBe(1)
      expect(iterator.next()).toBe(2)
      expect(iterator.next()).toBe(3)
      expect(iterator.hasNext()).toBe(false)
      expect(iterator.next()).toBe(undefined)
    })

    it('default value', () => {
      let root = new TreeNode()
      let iterator = new BSTIterator(root)

      expect(iterator.hasNext()).toBe(true)
    })
  })

  describe('MinStack', () => {
    class MinStack {
      stack: Array<number>
      secondStack: Array<number>

      constructor() {
        this.stack = []
        this.secondStack = []
      }

      push(val: number) {
        if (this.stack.length > 0) {
          const min = Math.min(
            val,
            this.secondStack[this.secondStack.length - 1],
          )
          this.stack.push(val)
          if (min !== this.secondStack[this.secondStack.length - 1]) {
            this.secondStack.push(min)
          }
        } else {
          this.stack.push(val)
          this.secondStack.push(val)
        }
      }

      pop() {
        if (this.stack.length == 0) {
          throw Error()
        }
        const value = this.stack.pop()
        if (value == this.secondStack[this.secondStack.length - 1]) {
          this.secondStack.pop()
        }
      }

      top(): number {
        if (this.stack.length === 0) {
          throw Error()
        }
        const val = this.stack[this.stack.length - 1]
        return val
      }

      getMin(): number {
        if (this.stack.length == 0 && this.secondStack.length == 0) {
          throw Error()
        }
        const min = this.secondStack[this.secondStack.length - 1]
        return min
      }
    }

    it('constructor', () => {
      expect(() => {
        let _ = new MinStack()
      }).not.toThrow()
    })

    it('happy path', () => {
      let minStack = new MinStack()

      expect(minStack.push(-2))
      expect(minStack.stack).toStrictEqual([-2])
      expect(minStack.secondStack).toStrictEqual([-2])
      expect(() => {
        minStack.pop()
      }).not.toThrow()
      expect(minStack.stack).toStrictEqual([])
      expect(minStack.secondStack).toStrictEqual([])
      expect(() => {
        minStack.pop()
      }).toThrow(Error)
      expect(() => {
        minStack.top()
      }).toThrow(Error)
      expect(minStack.push(0))
      expect(minStack.top()).toBe(0)
      expect(minStack.stack).toStrictEqual([0])
      expect(minStack.secondStack).toStrictEqual([0])
      expect(minStack.getMin()).toBe(0)
      expect(() => {
        const emptyMinStack = new MinStack()
        emptyMinStack.getMin()
      }).toThrow(Error)
      expect(minStack.stack).toStrictEqual([0])
      expect(minStack.secondStack).toStrictEqual([0])
      minStack.push(1)
      expect(minStack.stack).toStrictEqual([0, 1])
      expect(minStack.secondStack).toStrictEqual([0])
    })

    it('leetcode', () => {
      const minStack = new MinStack()
      minStack.push(-2)
      minStack.push(0)
      minStack.push(-3)
      expect(minStack.getMin()).toBe(-3)
      minStack.pop()
      expect(minStack.top()).toBe(0)
      expect(minStack.getMin()).toBe(-2)
    })
  })
})
