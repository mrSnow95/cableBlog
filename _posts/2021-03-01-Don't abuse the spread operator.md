---
title: Don't abuse the Spread Operator
date: 2021-03-01
use_math: true
---


Here I was on my spare time doing some problems on [Binary Search](https://www.binarysearch.com) and I was doing this easy [one](https://binarysearch.com/problems/Remove-Last-Duplicate-Entries)
, which is basically "Given a list of integers nums, find all duplicate numbers and delete their last occurrences" 

 At first, since I'm using the spread operator all the time writing React Components,  I wrote this solution:

```javascript
class Solution {
    solve(nums) {
        const m = new Map()

        nums.forEach((x,i) => {
            m.set(x,i)
        })

        const ans = nums.reduce((arr,x,i) => {
            if(arr.indexOf(x) === -1) return [...arr,x]

            return m.get(x) === i ? arr : [...arr,x]
        },[])

        return ans
    }
}
```

Which was successful for cases like:  [1, 3, 4, 1, 3, 5] and [1, 1, 1, 2, 2, 2, 3, 3, 3]. But then I submitted and got TLE for an array with 100.000 entries. The problem is that the reduce/spread operator is $$ \mathcal{O}(N^2) $$. [Link](https://www.richsnapp.com/article/2019/06-09-reduce-spread-anti-pattern) to a interesting post.


Thinking more in data structures, here is a Solution that is accepted: 

```javascript
class Solution {
    solve(nums) {
        const m = new Map()
        const m2 = new Map()

        const add = (m,x) => {
            if(!m.has(x)) m.set(x,1)
            else m.set(x,m.get(x) + 1)
        }

        nums.forEach((x,i) => {
            add(m2,x)
            m.set(x,i)
        })

        let list = []
        nums.forEach((x,i) => {
            if(m2.get(x) === 1 || m.get(x) !== i) return list.push(x)
        })

        return list
    }
}


```


Which is not as readable as the reduce/spread pattern , but it's way way more efficient, since it's approximately linear.[post](https://medium.com/@pouyae/what-is-the-es6-spread-operator-and-why-you-shouldnt-use-it-57c056078ed9).

