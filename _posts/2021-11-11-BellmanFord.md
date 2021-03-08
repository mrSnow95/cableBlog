---
title: Currency Exchange and Negative Cycles
date: 2021-01-07
use_math: true
---



I really enjoy graph problems, because most of the problems the difficulty lies not in the knowledge of various graph algorithms, but actually in the graph modeling - the ability to spot the underlying graph in the problem statement. It reminds me of Data Science / Data Engineering, where the hardest job lies in modeling and structuring data, not in the applicatin of state-of-the-art algorithms.

One problem that a i really enjoy about graphs is the following: Given a 2D matrix describing currency exchanges ,write a funcion that determines if a arbitragy opportunity could arise. . Let's say currency 0 is USD, 1 is BRL and 2 is EUR. We can make an arbitrage given the following matrix:



$$
\begin{pmatrix}
1 & 1.32 & 0.9 \\
0.76 & 1 & 0.72 \\
1.11 & 1.47 & 1
\end{pmatrix}
$$


We could make the following : 
1. Sell $$1$$ BRL for $$0.72$$ EUR
2. Sell $$0.72$$ EUR for $$0.80$$ USD ($$0.72 * 1.11$$)
3. Sell $$0.80$$ USD for $$1.055$$ BRL ($$0.72 * 1.11 * 1.32$$)

An hence, from 1 BRL we ended up with 1.055 BRL

In finance, arbitrage is when an investor has a portfolio as function of time $$V(t)$$ , and if at $$t = 0$$, $$V(0) = 0$$ and at $$t = 1$$, $$V(1) > 0$$, then a proffit without any real investment is made.

So .... how to solve this problem ? 

We are asked to determine if there is a sequence of exchanges $$w_{i}$$ such that:

$$w_{1} * w_{2} * w_{3} .... w_{n} > 0 $$

Applying Log in both sides:

$$log(w_{1} * w_{2} * w_{3} .... w_{n}) > 0 $$

$$log(w_{1}) + log(w_{2}) + log(w_{3}) .... + log(w_{n}) > 0 $$

Multiplying by -1 :

$$(-log(w_{1})) + (-log(w_{2})) + (-log(w_{3})) .... + (-log(w_{n})) < 0 $$

Now the fun part. Imagine that we have a graph whose weights are given by $$ -log(w_{i})$$. If, for this graph, we can find a cycle whose sum of weights is negative, then we can indefinitely have smaller sum of weights by traversing more times such cycle. This is what is called a negative cycle for a graph that has negative weights. So, all we got to do is transform the original matrix by applying $$-log()$$ and, if we imagine that this is a adjacency matrix, determine if it has a negative cycle. 

[Bellman Ford](https://en.wikipedia.org/wiki/Bellman–Ford_algorithm) algorithm determines the Single Source Shortest Path vector distance by relaxing the graph V-1 times, where V is the number of vertexes. If, after V-1 iterations we can still have better estimates, then a negative cycle exists:


```c++
bool solve(vector<vector<double>>& matrix) {
    int n = matrix.size();
    int m = matrix[0].size();
    const int INF= 1e9 + 7;
    for(int i=0;i<n;i++) for(int j=0;j<m;j++) matrix[i][j] = -log2(matrix[i][j]);
    int s = 0;
    int V = n;

    vector<double> dist(V,INF);
    dist[s] = 0;
    for(int rep = 0;rep<V-1;rep++){
        for(int u=0;u<V;u++){
            if(dist[u]!=INF){
                for(int v = 0;v<V;v++) dist[v] = min(dist[v],dist[u] + matrix[u][v]);
            }
        }
    }
    // if you can still have better estimates after V-1 iterations, then a 
    // negative cycle exists
    bool hasNegCycle = false;
    for(int u = 0;u<V;u++){
        if(dist[u] != INF){
            for(int v = 0;v<V;v++) if(dist[v] > dist[u] + matrix[u][v]){
                hasNegCycle = true;
                break;
            }
        }
    }
    return hasNegCycle;
}
```

Pretty cool huh :) 


















