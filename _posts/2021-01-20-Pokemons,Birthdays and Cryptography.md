---
title: Pokemons,Birthdays and Cryptography
date: 2020-12-18
use_math: true
---



Supose you're walking on the streets hunting Pokemons in $$Pokemon Go$$. Your objective is to collect $$N$$ different types of Pokemon, where each type has an equal probability to appear (actually it depends if its a regular Pokemon or a rare one, but that doesn't matter for the moment :) ). Then, you ask yourself two questions:

1. What is the average number of Pokemons you'll catch till you catch 'em all ?
2. What is the average number of Pokemons you'll catch till you catch a repeated Pokemon ?

For the first question, suppose you already collected $$N - 1$$ Pokemons, then for the last Pokemon remaining, there is a $$\frac{1}{N}$$ probability to catch it, so $$N$$ its the expected number of Pokemons to catch till you see the last one. Now repeat the same reasoning supposing you already collected $$N-2$$ Pokemons, then for the last 2 Pokemons remaining, there is a $$\frac{2}{N}$$ probability to catch'em all, therefore $$\frac{N}{2}$$ its the expected number of Pokemons. And therefore, to catch'em all, you're gonna get:

$$
\frac{N}{N} + \frac{N}{N-1} + .... + \frac{N}{3} + \frac{N}{2} + \frac{N}{1}
$$

What we are seeing is the famous **Harmonic Series**, which its a divergent one, so if there is a infinite number of Pokemons out there, good luck in your quest :)

There is a nice approximation for the Harmonic Series, $$H_{n}$$ given by:

$$ \gamma = \lim_{n \to \infty} (H_{n} - ln(n)) $$

And therefore:

$$
\frac{N}{N} + ... + \frac{N}{2} + \frac{N}{1} = N*(1 + \frac{1}{2} + \frac{1}{3} + ... + \frac{1}{N})
$$

$$
\approx N * ln(N))
$$ 

And this is it for the first question :)

Now the second and most interesting one.

Supposing you already picked up a Pikachu, what is the average number of Pokemons to catch till you see another Pikachu ?

Considering we have already picked up $$n-1$$ pokemons, in the $$n^{th}$$ Pokemon we have:

$$P($$2 times same pokemon $$)$$ = $$1 - P($$ no pokemon is the same $$)$$

Using some boring factoring and combinatorics from high school combinatorial math, we have:

$$ P = 1 - \frac{N * (N-1) * ... * (N - n)}{N^{n}} = 1 - (1 - \frac{1}{N}) * (1 - \frac{2}{N}) * ... * (1 - \frac{n-1}{N}) $$

If we have $$ n << N $$ ,i.e, you got very few Pokemons so far compared to the total Pokemons on the universe, we can use the following Taylor approximation: 

$$ e^{x} = 1 - x $$

We have:

$$ e^{-\frac{1}{N}} = 1 - \frac{1}{N} $$

So,

$$ P = 1 - e^{-\frac{1}{N}} * e^{-\frac{2}{N}} * ... * e^{-\frac{n-1}{N}} $$

$$ P = 1 - e^{-\frac{n*(n-1)}{2N}} $$

Using once again the Taylor approximation:

$$ P \approx 1 - (1 - \frac{n * (n-1)}{2N} ) \approx \frac{n^2}{2N} $$

Finally,

$$ P \approx \frac{n^2}{2N} $$

So if we wanna be $$50 \%$$ to catch a Pikachu in the next trial, we expect to get $$n$$ Pokemons so far given by:

$$ 0.5 = \frac{n^2}{2N} $$

$$ n^{2} = N $$ 

$$ n = \sqrt{N} $$


This is actually a Poke Version of the classic **Birthday Paradox**, where, if we have $$ n = \sqrt{365}  \approx 20 $$ people in a room, we have a pretty good chance to have two birthdays cakes for lunch.

And why all of this so important ?

Most cryptosystems use some kind of hash function to process messages. A hash function
$$f$$ is not injective, but is created so that collisions, or instances where 
$$x \neq y$$ but $$ f(x) = f(y) $$ are hard to discover. An attacker who can find collisions can access information or messages that are not meant to be public. The birthday attack is a restatement of the birthday paradox that measures how collision-resistant a well-chosen hash function is. For instance, suppose that a hash function is chosen with a 64-bit range; that is, its image is a nonnegative integer less than $$ 2^{64} $$. If an attacker computes $$ \sqrt{M} $$ hash values, he has a $$50 \%$$ chance to make a collision. A 64-bit function represents a significant improvement in relation to its 32-bit counter part. $$ 2^{32} \approx 4 * 10^{9} $$, while $$2^{64} $$ is greater than $$10^{9}$$. This vulnerability necessitates the use of a large hash range in practical applications.

**Birthday Paradox in Competitive Programming**

Birthday Paradox is also a good tool to competitive programming. A lot of problems where the input is too large, something like $$N=10^{11}$$ for example, an efficient algorithm should be $$ \mathcal{O}(\sqrt{N}) $$ , which reminds us of the Birthday Paradox. Here is a very nice [problem](https://community.topcoder.com/stat?c=problem_statement&pm=15790) from TopCoder 2019 finals to ilustrate this. 

The problem asks: Given a number $$X$$ and $$L$$, find a number $$N$$ such that $$N$$ is a multiple of $$X$$ and has $$L$$ number of digits,  and N will have no more than 4 distinct digits . $$X$$ will be in the range $$1$$ and $$10^{11}$$ . $$L$$ will be in the range $$40$$ and $$120$$.

A naive brute force approach would be to test every single number in the possible range:

```c++
#include <stdio.h>
#include <iostream>
#include <vector>
#include <unordered_set>
#include <unordered_map>
using namespace std;
typedef long long ll;

//  give X and L , write a program that returns a number that
//  has length L with no more than 4 diffents digits and is 
//  a multiple of X

int fast_pow(int n,int p){
    int ret = 1;
    while(p){
        if(p & 1) ret *= n;
        p = (p >> 1);
        n = n*n;
    }
    return ret;
}

bool has4diffDigits(int n){
    unordered_set<int> d;
    while(n){
        d.insert(n%10);
        if(d.size() > 4) return false;
        n /= 10;
    }
    return true;
}


int brute_force(int X,int L){
    int n = fast_pow(10,L-1);
    while(true){
        if(n % X == 0 and has4diffDigits(n)) return n;
        n++; 
    }
    return -1;
}
```

Obviously that for a number with $$40$$ digits and a possible multiple of $$10^{11}$$ this is extremelly extremelly slow.

We solve this problem by using Birthday Paradox :)

Imagine a number generator that generates numbers modulo X. For example, a random number generator modulo $$5$$ will generate only $$0$$, $$1$$, $$2$$, $$3$$ and $$4$$, with equal probability. If we have $$x_{1} \neq x_{2} $$ and

$$ x_{1} = (r) mod(5) $$

and 

$$ x_{2} = (r) mod(5) $$

then 

$$ x_{1} - x_{2} = (0) mod(5)$$

and therefore this difference is a multiple of $$5$$ !

Now, with a random number generator modulo $$X$$ and according to the birthday paradox, we expect a  $$ \mathcal{O}(\sqrt{X}) $$ calculations until we have two numbers that have the same modulo $$X$$, and therefore we substract them to have our answer. And what if the difference has less than $$L$$ digits ? just complement it with $$0$$'s :) and what about the 4 distinct digits constraint ? well, if you generate random numbers with only $$0$$'s and $$1$$'s , the difference between any of them can only have the digits $$0$$, $$1$$, $$8$$ and $$9$$ :) So we just have to generate numbers with only $$0$$'s and $$1$$'s and if a previous number has the same remainder that of the actual number, compute their difference, otherwise keep it in a hash map.  Since we are dealing with big numbers, we represent them with strings, and therefore each diff operation has  $$ \mathcal{O}(L) $$ complexity, and therefore the final algorithm has  $$ \mathcal{O}(\sqrt{X} * L) $$ complexity, which is waay more efficient and has AC result <)


``` c++
#include <stdio.h>
#include <iostream>
#include <vector>
#include <unordered_set>
#include <unordered_map>
using namespace std;
typedef long long ll;

//  give X and L , write a program that returns a number that
//  has length L with no more than 4 diffents digits and is 
//  a multiple of L


// Returns true if str1 is smaller than str2.
bool isSmaller(string str1, string str2)
{
    // Calculate lengths of both string
    int n1 = str1.length(), n2 = str2.length();
 
    if (n1 < n2)
        return true;
    if (n2 < n1)
        return false;
 
    for (int i = 0; i < n1; i++)
        if (str1[i] < str2[i])
            return true;
        else if (str1[i] > str2[i])
            return false;
 
    return false;
}
 
// Function for find difference of larger numbers
string findDiff(string str1, string str2)
{
    // Before proceeding further, make sure str1
    // is not smaller
    if (isSmaller(str1, str2))
        swap(str1, str2);
 
    // Take an empty string for storing result
    string str = "";
 
    // Calculate length of both string
    int n1 = str1.length(), n2 = str2.length();
 
    // Reverse both of strings
    reverse(str1.begin(), str1.end());
    reverse(str2.begin(), str2.end());
 
    int carry = 0;
 
    // Run loop till small string length
    // and subtract digit of str1 to str2
    for (int i = 0; i < n2; i++) {
        // Do school mathematics, compute difference of
        // current digits
 
        int sub
            = ((str1[i] - '0') - (str2[i] - '0') - carry);
 
        // If subtraction is less then zero
        // we add then we add 10 into sub and
        // take carry as 1 for calculating next step
        if (sub < 0) {
            sub = sub + 10;
            carry = 1;
        }
        else
            carry = 0;
 
        str.push_back(sub + '0');
    }
 
    // subtract remaining digits of larger number
    for (int i = n2; i < n1; i++) {
        int sub = ((str1[i] - '0') - carry);
 
        // if the sub value is -ve, then make it positive
        if (sub < 0) {
            sub = sub + 10;
            carry = 1;
        }
        else
            carry = 0;
 
        str.push_back(sub + '0');
    }
 
    // reverse resultant string
    reverse(str.begin(), str.end());
 
    return str;
}


ll mod(ll N,int M){ return (N%M + M)%M; }

//generate a number of length L with only 0's and 1's and also return its modulo X
pair<string,ll> gen_number(int L,ll X){
    ll R = 0;
    string num = "";
    for(int i=0;i<L;i++){
        bool bit = (rand()%2 >= 0.5);
        R = mod(10*R + bit,X);
        num += '0' + bit;
    }
    return make_pair(num,R);
}

string solve(int L, ll X){ // O(sqrt(X) * L)
    unordered_map<ll,string> mp;
    while(true){
        auto p = gen_number(L,X);
        string num = p.first;
        ll r = p.second;
        if(mp.count(r)){

            string ret = findDiff(num,mp[r]);
            int d  = 0;

            while(*ret.begin() == '0') ret.erase(ret.begin()),d++;
            while(d--) ret += '0';

            return ret;
        }
        mp[r] = num;
    }
    return "";
}


int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    srand(time(NULL));
    ll X; int L;
    cin >> X >> L;
    cout << solve(L,X) << endl;
    return 0;

}

```





