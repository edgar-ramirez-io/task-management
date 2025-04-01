import { timestamp } from 'rxjs'

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

  describe('isIsomorphic', () => {
    it('test it', () => {
      function isIsomorphic(s: string, t: string): boolean {
        if (s.length !== t.length) {
          return false
        }
        return transformString(s) === transformString(t)
      }

      function transformString(s: string): string {
        const dict = {}
        const result = []

        for (let i = 0; i < s.length; i++) {
          const char = s[i]
          if (dict[char] === undefined) {
            dict[char] = i
          }
          result.push(dict[char])
        }
        return result.join(' ')
      }

      expect(isIsomorphic('egg', 'add')).toBe(true)
      expect(isIsomorphic('foo', 'bar')).toBe(false)
      expect(isIsomorphic('ab', 'aa')).toBe(false)
    })
  })

  describe('wordPattern', () => {
    function wordPattern(pattern: string, s: string): boolean {
      const words = s.split(' ')

      if (pattern.length !== words.length) {
        return false
      }

      const dict = {}

      for (let index = 0; index < pattern.length; index++) {
        const letter = pattern[index]
        const word = words[index]

        const prefix_key_letter = `letter_${letter}`
        const prefix_key_word = `word_${word}`

        if (dict[prefix_key_letter] === undefined) {
          dict[prefix_key_letter] = index
        }

        if (dict[prefix_key_word] === undefined) {
          dict[prefix_key_word] = index
        }

        if (dict[prefix_key_letter] !== dict[prefix_key_word]) {
          return false
        }
      }
      return true
    }

    it('test it', () => {
      expect(wordPattern('abba', 'dog cat cat dog')).toBe(true)
      expect(wordPattern('abba', 'dog cat cat fish')).toBe(false)
      expect(wordPattern('aaaa', 'dog cat cat dog')).toBe(false)
      expect(wordPattern('aaaa', 'a a a a')).toBe(true)
      expect(wordPattern('aaaa', 'a b b a')).toBe(false)
      expect(wordPattern('abc', 'b c a')).toBe(true)
      expect(wordPattern('abba', 'dog constructor constructor dog')).toBe(true)
    })
  })

  describe('RecentCounter', () => {
    it('test it', () => {
      class RecentCounter {
        private queue: Array<number>
        constructor() {
          this.queue = []
        }

        ping(t: number): number {
          this.queue.push(t)
          while (this.queue.length > 0 && this.queue[0] < t - 3000) {
            this.queue.shift()
          }
          return this.queue.length
        }
      }

      const recentCounter = new RecentCounter()

      expect(recentCounter.ping(1)).toBe(1) // range [-2999, 1] -> 1
      expect(recentCounter.ping(100)).toBe(2) // range [-2900, 100] -> 1, 100
      expect(recentCounter.ping(3001)).toBe(3) // range [1, 3001] -> 1, 100, 3001
      expect(recentCounter.ping(3002)).toBe(3) // range [2, 3002] -> 100, 3001, 3002
    })
  })

  describe('StockSpanner', () => {
    class StockSpanner {
      stack: [number, number][]

      constructor() {
        this.stack = []
      }

      next(price: number): number {
        let ans = 1
        while (
          this.stack.length > 0 &&
          this.stack[this.stack.length - 1][0] <= price
        ) {
          ans += this.stack[this.stack.length - 1][1]
          this.stack.pop()
        }
        this.stack.push([price, ans])
        return ans
      }
    }
    it('test it', () => {
      const stockSpanner = new StockSpanner()

      expect(stockSpanner.next(100)).toBe(1)
      expect(stockSpanner.stack).toStrictEqual([[100, 1]])
      expect(stockSpanner.next(80)).toBe(1)
      expect(stockSpanner.stack).toStrictEqual([
        [100, 1],
        [80, 1],
      ])
      expect(stockSpanner.next(60)).toBe(1)
      expect(stockSpanner.stack).toStrictEqual([
        [100, 1],
        [80, 1],
        [60, 1],
      ])
      expect(stockSpanner.next(70)).toBe(2)
      expect(stockSpanner.stack).toStrictEqual([
        [100, 1],
        [80, 1],
        [70, 2],
      ])
      expect(stockSpanner.next(60)).toBe(1)
      expect(stockSpanner.stack).toStrictEqual([
        [100, 1],
        [80, 1],
        [70, 2],
        [60, 1],
      ])
      expect(stockSpanner.next(75)).toBe(4)
      expect(stockSpanner.stack).toStrictEqual([
        [100, 1],
        [80, 1],
        [75, 4],
      ])
      expect(stockSpanner.next(85)).toBe(6)
      expect(stockSpanner.stack).toStrictEqual([
        [100, 1],
        [85, 6],
      ])
    })
  })

  describe('stripe glassdoor', () => {
    it('problem 1', () => {
      /*
      Given a list of inputs which are strings of words separated by 
      commas, print specific words from the input in a given format.  
      e.g. String input could be a list of strings that look like this: 
      "1, A1, 5000, card_number, 1234567"  
      The words represent the timestamp, ID, amount, type, and value respectively. 
      For each string input, print the info in this format: "ID amount APPROVED". 
      You can assume everything is approved for now. Print the info in 
      chronological order according to their timestamps.

      Using the same list of string inputs and another list of string inputs 
      denoting requirements, print each string input in this format: 
      "ID amount APPROVED" if it does not violate any of the requirements and 
      "ID amount REJECTED" if it does violate. 
      e.g. String input could be a list of strings that look like this: 
      "1, A1, 5000, card_number, 1234567" 
      Requirements could be a list of string that look like this: 
      "1, card_number, 1234567". 
      This means that when timestamp 1 happens, this requirement is activated 
      and anything that has a timestamp of 1 or higher and has type card_number 
      and value of 1234567 should be printed with "REJECTED" instead of "APPROVED".
      */

      function parsePaymentsString(input: string[]) {
        const payments = input.map((value) => {
          const components = value.split(',').map((value) => value.trim())
          return {
            timestamp: Number(components[0]),
            id: components[1],
            amount: components[2],
            type: components[3],
            value: components[4],
          }
        })
        return payments
      }

      function sortPayments(payments: any[]) {
        // TODO: handle edge cases
        return payments.sort((a, b) => a['timestamp'] - b['timestamp'])
      }

      function createMap(requirements: any[]) {
        let map = {}
        for (let value of requirements) {
          const components = value.split(',').map((value) => value.trim())
          map[Number(components[0])] = {
            type: components[1],
            value: components[2],
          }
        }

        return map
      }

      function applyRequirements(payments: any[], requirements: any[]) {
        const requirementsByTimestamp = createMap(requirements)
        return payments.map((p) => {
          let isRejected = false
          for (let timestamp in requirementsByTimestamp) {
            const req = requirementsByTimestamp[timestamp]
            if (
              p.timestamp >= timestamp &&
              p.type === req.type &&
              p.value === req.value
            ) {
              isRejected = true
              break
            }
          }
          return `${p.id} ${p.amount} ${isRejected ? 'REJECTED' : 'APPROVED'}`
        })
      }

      function processPayments(input: string[], requirements: string[]) {
        const payments = parsePaymentsString(input)
        const sortedPayments = sortPayments(payments)
        applyRequirements(sortedPayments, requirements).forEach((value) =>
          console.log(value),
        )
      }

      expect(
        parsePaymentsString(['1, A1, 5000, card_number, 1234567']),
      ).toEqual([
        {
          amount: '5000',
          id: 'A1',
          timestamp: 1,
          type: 'card_number',
          value: '1234567',
        },
      ])
      expect(
        sortPayments([
          {
            amount: '1000',
            id: 'C3',
            timestamp: 3,
            type: 'card_number',
            value: '7654321',
          },
          {
            amount: '3000',
            id: 'B2',
            timestamp: 2,
            type: 'card_number',
            value: '7654321',
          },
          {
            amount: '5000',
            id: 'A1',
            timestamp: 1,
            type: 'card_number',
            value: '1234567',
          },
        ]),
      ).toStrictEqual([
        {
          amount: '5000',
          id: 'A1',
          timestamp: 1,
          type: 'card_number',
          value: '1234567',
        },
        {
          amount: '3000',
          id: 'B2',
          timestamp: 2,
          type: 'card_number',
          value: '7654321',
        },
        {
          amount: '1000',
          id: 'C3',
          timestamp: 3,
          type: 'card_number',
          value: '7654321',
        },
      ])
      expect(
        applyRequirements(
          [
            {
              amount: '5000',
              id: 'A1',
              timestamp: 1,
              type: 'card_number',
              value: '1234567',
            },
            {
              amount: '3000',
              id: 'B2',
              timestamp: 2,
              type: 'card_number',
              value: '7654321',
            },
          ],
          ['1, card_number, 1234567'],
        ),
      ).toStrictEqual(['A1 5000 REJECTED', 'B2 3000 APPROVED'])
      expect(createMap(['1, card_number, 1234567'])).toStrictEqual({
        1: { type: 'card_number', value: '1234567' },
      })

      expect(() => {
        processPayments(
          [
            '2, B2, 3000, card_number, 7654321',
            '1, A1, 5000, card_number, 1234567',
            '3, C3, 1000, card_number, 9876543',
          ],
          ['1, card_number, 1234567'],
        )
      }).not.toThrow()
    })
    it('problem 2', () => {
      /*
      Find the best time to shut down a machine given a string of 
      server-statuses "1 0 1 0 0 1" and a time that the server was 
      taken offline (where 0 = running, 1 = offline)
      */
    })
    it('problem 3', () => {
      /*
      Given an input string: 
      "UK:US:FedEx:4,UK:FR:Jet1:2,US:UK:RyanAir:8,CA:UK:CanadaAir:8" 
      Which represents flights between destinations in the format: 
      "Source:Destination:Airline:Cost,..."
       Write a function which will take a Source and Destination 
       and output the cost.

       (Building from the first question) Write a function which will 
       take an Input String, Source and Destination that have no 
       direct connecting flight, and output a route that you can take 
       to reach the destination. The output should be in the format: 
       return {'route': 'US -> UK -> FR', 'method': 'RyanAir -> Jet1', 'cost': 10}
      */

      function findCheapestPrice(
        n: number,
        flights: number[][],
        src: number,
        dst: number,
        k: number,
      ): number {
        const queue: [number, number][] = [[src, 0]]
        const adj = {}
        const MAX_COST = Number.MAX_VALUE
        const dist = new Array(n).fill(MAX_COST)

        dist[0] = 0
        k++

        for (const [from, to, price] of flights) {
          if (adj[from] === undefined) {
            adj[from] = []
          }
          adj[from].push([to, price])
        }

        while (k-- > 0 && queue.length > 0) {
          const [to, price] = queue.shift()
          console.log({ visiting: to })
          if (adj[to] !== undefined) {
            for (const [neighbour, nextPrice] of adj[to]) {
              const newPrice = price + nextPrice
              if (newPrice < dist[neighbour]) {
                dist[neighbour] = newPrice
                queue.push([neighbour, newPrice])
              }
            }
          }
        }
        if (dist[dst] !== MAX_COST) {
          console.log({ arrived: dst })
        }

        return dist[dst] === MAX_COST ? -1 : dist[dst]
      }

      expect(
        findCheapestPrice(
          5,
          [
            [0, 1, 100],
            [1, 2, 100],
            [2, 0, 100],
            [1, 3, 600],
            [2, 3, 200],
          ],
          0,
          3,
          1,
        ),
      ).toBe(700)
    })
    it('problem 3', () => {
      /*
      A real-world question around giving two lists find the overlap and 
      order the output based on requirements in the problem statement and 
      requirements later added by the interviewer.
      */

      function findOverlap(
        list1: string[],
        list2: string[],
        sortOrder?: string[] | undefined,
      ) {
        const set = new Set(list1)
        const overlap = new Array<string>()

        for (let index = 0; index < list2.length; index++) {
          const element = list2[index]

          if (set.has(element)) {
            overlap.push(element)
          }
        }

        return overlap.sort((a, b) => {
          if (!sortOrder) {
            return a.localeCompare(b)
          }
          const indexA = sortOrder.indexOf(a)
          const indexB = sortOrder.indexOf(b)
          return indexA - indexB
        })
      }

      const list1 = ['apple', 'banana', 'cherry', 'date']
      const list2 = ['banana', 'date', 'fig', 'grape']
      const sortOrder = ['date', 'banana', 'apple', 'cherry', 'fig', 'grape']

      expect(findOverlap(list1, list2, sortOrder)).toStrictEqual([
        'date',
        'banana',
      ])
      expect(findOverlap(list1, list2)).toStrictEqual(['banana', 'date'])
    })
    it('problem 4', () => {
      /*
      Find the minimum value in a dictionary.
      Answer question
      Question 2
      Create a UI element/component with built-in input validation.
      Answer question
      Question 3
      General stuff like why Stripe, what are you looking for?
      Answer question
      Question 4
      Find and fix a bug in a third-party library.
      */

      function findMinInDict(dict: {}): number {
        let min = Number.MAX_VALUE
        for (const key in dict) {
          let value = dict[key]

          if (value < min) {
            min = value
          }
        }
        return min
      }

      expect(findMinInDict({ 0: 89, 2: 3 })).toBe(3)
      expect(findMinInDict({ 0: 89, 2: 3 })).toBe(
        Math.min(...Object.values({ 0: 89, 2: 3 })),
      )
    })
    it('problem 5', () => {
      /*
      Find min value of a key given a set of records.
      */
    })
  })
})
