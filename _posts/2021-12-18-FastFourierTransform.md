---
title: An Easy Way to Understand Fast Fourier Transforms
date: 2021-01-28
use_math: true

---



One of the most remarkable things about Mathematics is how abstraction can lead to real improvements in the real world. Just by extending the real numbers to the complex numbers, by letting $$i^2 = -1$$ and defining a perpendicular axis to the real line representing the imaginary part, whole branchs of knowledge like Control Theory and Fourier Analysis are possible. 

One of my favorite algorithms is the Fast Fourier Transform because, besides its beauty involving complex numbers, it has real value for engineers, for example, speeding up the training of convolutional neural networks. In this post i'd like to give a simple and intuitive introduction of this amazing algorithm.

Suppose we are asked to evaluate the product of two polynomials. For example, given $$A(x)$$ and $$B(x)$$ , calculate $$C(x) = A(x)*B(x)$$.

**Working with Polynomials:**

Consider a polynomial

$$f(x) = c_{0} + c_{1}x + c_{2}x^2 + ... c_{n-1}x^{n-1} $$

There are two ways to represent such polynomial:

1. *Coefficient Representation* : We create a vector that contains the coefficients of the polynomial. For example, given $$A(x) = 1 + 5x + 7x^2 + x^3$$, its representation would be $$[1,5,7,1]$$

2. *Point-value representation*:  If the degree of an polynomial is $$ n − 1 $$ and we know its values at $$n$$ distinct points, this uniquely defines the polynomial. Therefore we can represent the polynomial by having a vector of pairs $$(x,y)$$ :$$[(x_0, f (x_0)), (x_1, f(x_1)), . . . , (x_{n−1}, f(x_{n−1}))]$$

More formally, if we have the following system of equations :

$$P(x_{0}) = p_{0} + p_{1}x_{0} + p_{2}x_{0}^2 + ... p_{d}x_{0}^d $$


$$P(x_{1}) = p_{0} + p_{1}x_{1} + p_{2}x_{1}^2 + ... p_{d}x_{1}^d $$


$$P(x_{2}) = p_{0} + p_{1}x_{2} + p_{2}x_{2}^2 + ... p_{d}x_{2}^d $$


$$                          .                             $$


$$                          .                             $$


$$                          .                             $$


$$P(x_{d}) = p_{0} + p_{1}x_{d} + p_{2}x_{d}^2 + ... p_{d}x_{}^d $$

We could represent such system with the following matrix equation:

$$
\left[ \begin{array}{c} P(x_{0}) \\ P(x_{1}) \\ . \\ . \\ P(x_{d}) \end{array} \right]  = 

\begin{bmatrix} 
1 & x_{0} & x_{0}^2 & . & . & . & . & x_{0}^d \\
1 & x_{1} & x_{1}^2 & . & . & . & . & x_{1}^d \\
. &  .    &   .     & . & . & . & . & .       \\
. &  .    &   .     & . & . & . & . & .       \\
1 & x_{d} & x_{d}^2 & . & . & . & . & x_{d}^d \\
\end{bmatrix} \times \left[\begin{array}{c} p_{0} \\ p_{1} \\ p_{2} \\ . \\ . \\ p_{d} \end{array}\right]
$$

If the matrix of the powers of $$x$$ has a non-zero determinant (which is a Vandermonde matrix), the system has a unique solution, and thus, a well defined polynomial.

Now that we know how to represent polynomials, we can try to come up with an algorithm to calculate the product of polynomials. The first one is using the coefficient representation, which follows the classic method that we learn in high school math:

```c++
for(int j = 0;j<=n;j++){
    for(int k=0;k<=n;k++){
        res[j+k] += A[j]*B[k];
    }
}
```

Which is a $$\mathcal{O}(n*n)$$ time complexity, where $$ n $$ and $$ m $$ are the degrees of the polynomials. Such solution is not efficient.

If we use the Point-value representation however, we come up with a solution way more efficient,$$\mathcal{O}(n)$$, since, for a given $$ x_{0} $$ , $$ C(x_{0}) = A(x_{0})B(x_{0}) $$

```
def multiply_point_value(a,b):

    c = []
    for i in range(len(a)):
        c.append( (a[i][0],a[i][1]*b[i][1]) )
    return c
```

But here it is the catch. Although the Point-Value is faster to calculate, we can't do much with such representation. I mean, if you want to study the behavior of a polynomial, it's roots, it's derivatives, perform transformations on it, you must know it's coefficient representation. So how we can combine the efficiency of the Point-Value representation with the usefulness of the coefficient representation ?

Since multiplication in the point-value representation is faster, If somehow we could come up with the following scheme:

![My helpful screenshot](/assets/images/fastFourier1.png)

We could better of our multiplication algorithm. As we're gonna find out soon, the black box that turns the coefficient representation to the point-value one is our Fast Fourier Transform.

**F F T**

The Fast Fourier Transform is a divide and conquer algorithm to compute a Discrete Fourier Transform of a series (or an ordered set of polynomials coefficients). To understand DFT, one also needs to know about complex numbers and Euler's formula and it's relation with the $$n^{th}$$ root of a unity.

I start by describing a D&C algorithm to evaluate a polynomial $$A(X)$$ for a given $$$$. Let $$A(x) = (a_{0}, a_{1}, a_{2},.....,a_{n})$$ be a polynomial function (in the coefficient representation).Let $$A_{0}(x) = (a_{0}, a_{2}, a_{4}, ...) $$ be a polynomial with the even terms of $$A(x)$$, and let $$A_{1}(x) = (a_{1},a_{3},a_{5}, .... ) $$ be a polynomial with the odd terms of $$A(X)$$. Both $$A_{0}(x)$$ and $$A_{1}(x)$$ have half the degree of $$A(x)$$.


$$ A(x) = a_{0} + a_{1} * x + a_{2} * x^{2} + a_{3} * x^3 .... + a_{n} * x^{n-1} $$

$$ A_{0}(x) = a_{0} + a_{2} * x^{1} + a_{4} * x^{2}.... $$

$$ A_{1}(x) = a_{1} + a_{3} * x^{1} + a_{5} * x^{3}.... $$


And therefore,

$$ A(x) = A_{0}(x^2) + x * A_{1}(x^2) $$


For the following example, I slightly abuse the notation $$A_{a_{1},a_{2},a_{3}...,a_{n}}$$ to be a polynomial $$(a_{0},a_{1},...,a_{n})$$. 

Let $$A_{(3,0,2,5)}(x)$$ be the polynomial function, and we want to evaluate at $$x=2$$. Separate the even and odd terms coefficients and evaluate on $$x^{2}$$, i.e, $$A_{(3,2)}(x^2)$$ and $$A_{(0,5)}(x^2)$$. To evaluate $$A_{(3,2)}(x^2)$$ recursively, separate it's even and odd terms coefficients and evaluate on $$(x^{2})^{2}$$, i.e, $$A_{(3)}(x^4)$$ and $$A_{(2)}(x^4)$$. Similarly, to evaluate $$A_{(0,5)}$$ recursively, separate it's even and odd terms evaluate on $$x^4$$, i.e, $$A_{(0)}(x^4)$$ and $$A_{(5)}(x^4)$$

$$A_{(3,0,2,5)}(2) = A_{(3,2)}(2^2) + 2 * A_{(0,5)}(2^2)$$

The first term:

$$A_{(3,2)}(2^2) = A_{(3)}(2^4) + 4 * A_{(2)}(2^4) $$

$$A_{(3)}(2^4) = 3 , A_{(2)}(2^4) = 2$$

$$A_{(3,2)}(2^4) = 3 + 4 * 2 = 11$$

The second term,


$$A_{(0,5)}(2^2) = A_{(0)}(2^4) + 4 * A_{(5)}(2^4) $$

$$A_{(0)}(2^4) = 0 , A_{(5)}(2^4) = 5 $$

$$A_{(0,5)}(2^4) = 0 + 4 * 5 = 20$$

And therefore,

$$A_{(3,0,2,5)}(2) = 11 + 2 * 20 = 51 $$

This is the Divide and Conquer procedure for polynomial evaluation, which runs in $$ \mathcal{O}(n * log (n)) $$. If we want to evaluate for all $$x \in X $$ one by one, where $$ \Vert{X}\Vert = 2n + 1 $$, then it's gonna take $$\mathcal{O}(n^2 * log(n))$$ with this D&C algorithm. We can evaluate for all $$ x \in  X $$ all at once, but it still requires $$ \mathcal{O}(n^2) $$. The magic of the FFT is a clever choice for $$x\in X$$, and D&C can evaluate in $$\mathcal{O}(n * log(n))$$  all $$n$$ values. 








