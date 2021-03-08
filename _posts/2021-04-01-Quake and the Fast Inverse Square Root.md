---
title: Quake III and the Fast Inverse Square Root
date: 2021-01-20
use_math: true
---


Given a number $$x$$ ,write a program that calculates the inverse square root:

$$ y = \frac{1}{\sqrt{x}} $$

Well, it's not that hard:

```c++
float inverse_sqrt(float x){
    return 1.0/sqrt(x);
}
```

So ... no big deal, right ? Well, maybe not for our current processors embedded with special Floating Operation Units, but old computers with their traditional ALU's had a hard time calculating such task of division and square root. And for old games like Doom and Quake III, calculating efficiently the inverse square root of a number made all the difference in the Physics Engine of the game. The reason for this is because Physics Engines have to perform lot's of vector normalization in order to apply, for example, Snell's Law of refraction correctly for lighting. 

Given a vector $$(x,y,z)$$, it's norm is $$\sqrt{x^2 + y^2 + z^2}$$ and therefore after normalization it becomes ($$\frac{x}{\sqrt{x^2 + y^2 + z^2}},\frac{y}{\sqrt{x^2 + y^2 + z^2}},\frac{z}{\sqrt{x^2 + y^2 + z^2}} $$). And for every frame of the game, hundreds of thousands of this calculations are made. So, how to efficiently calculate this ? Well, [Jonh Carmack](https://en.wikipedia.org/wiki/John_Carmack) leading programmer of idSoftware at the development of Quake III, came up with the following algorithm used in the game (comments are from the original source code) :

```c++
float Q_rsqrt(float number){
    long i;
    float x2,y;
    const float threehalfs = 1.5F;

    x2 = number*0.5F;
    y = number;
    i = * (long *) &y;              // evil floating point bit hack
    i = 0x5f3759df - (i >> 1);      // what the fuck ? 
    y = * (float *) &i;
    y = y * (threehalfs - (x2 * y * y)); // 1st iteration
 // y = y * (threehalfs - (x2 * y * y)); // 2nd iteration, can be removed
    return y;
}

```
Yeah, looks way more complicated than the previous code, and the way it works just shows what a hell of a programmer Carmack was. In order to understand the algorithm, some things have to be clear first:


***How Floating Points Are Represented in 32 bits**

How to represent 696969 in binary ? Well, its just $$ 0000 $$ $$0000$$ $$0000$$ $$1010$$ $$1010$$ $$0010$$ $$1000$$ $$1001$$. Now what about $$ 69.6969 $$ ? The Standard way is how the IEEE 754 describes: Exactly hot we represent in scientific notation ! 

For example, in base 10: $$ 23000 = 2.3 * 10^{4} $$ , $$ 0.0034 = 3.4 * 10 ^ {-3} $$
And in binary: $$ 11000 = 1.1 * 2 ^ {4} $$ , $$ 0.0101 = 1.01 * 2^{-3} $$
According to the triple IEE 754 Standard, the first bit represents the sign ( $$ + $$ or $$ - $$ ), the next 8 bits represents the exponent, and the next 23 bits represents the Mantissa, the number that comes before the exponent in the binary scientific representation. The following picture makes more clear:


![My helpful screenshot](/assets/images/bin.png)

That's how the standard specifies how to interpret these 32 bits for Float Numbers. And thererefore, to get the actual number from these 32 bits, we calculate $$ M $$, from the 23 first bits, $$ E $$, from the next 8, and finally the last sign, $$ S $$, and plug these guys in the formula:

$$ (-1)^{S} * (1 + \frac{M}{2^{23}}) * 2 ^ {E - 127} $$

The $$ E - 127 $$ is necessary to calculate negative exponents, since $$ E $$ goes from $$ 0 $$ to  $$ 255 $$ ,we can have the interval $$ [ -127,128 ] $$.

Since we are calculating positive floating point number for the problem of vector normalization (all guys are squared up), we can leave the representation just as 

 $$F =  (1 + \frac{M}{2^{23}}) * 2 ^ {E - 127} $$

 Now for no particular reason, let's calculate $$log(F)$$ , in base 2:

 $$log(F) = log((1 + \frac{M}{2^{23}}) * 2 ^ {E - 127})$$
 
 $$log(F) = (E - 127) + log((1 + \frac{M}{2^{23}}))$$

For the term $$ log((1 + \frac{M}{2^{23}})) $$ , since $$ M $$ belong to $$[ 0,1 ]$$,
we can approximate the term using the Taylor Approximation: $$ log(1+x) \approx 1+x + \mu $$ , where is a $$\mu$$ is a  $$ \mathcal{O}(x^2) $$ correction term. And therefore, rearranging terms:

$$log(F) = \frac{M + 2^{23} * E}{2 ^{23}} + \mu - 127 $$

The original programmers of Quake calculated that $$\mu = 0.04505$$ was a optimal $$\mu$$ for approximating the original function.

Now, a important note, $$ M + 2^{23}*E $$ is **exactly** how you represent this float number in binary:

![My helpful screenshot](/assets/images/bin2.png)

**The Evil Bit Hack**


We can't do bit tricks with floating numbers, since they are tied to IEEE 754. But with integers we can:

```c++
int p = 4;
p = (p >> 1); // 2 , shift left divide by 2
p = (p << 1) // 4,  shift right multiply by 2
```

So how can we trick C to make bit manipulation with floats ? 
We can't just do

```c++
float f = 3.33;
int i = (int) f;
```
Because we lose information about the floating number in the convertion.

Here's the magic. Take for example $$3.33$$, with binary representation:

$$ 3.33 = 0 10000000 10101010001111010111000 $$

if we make a hard conversion, it becomes:

$$ 3 = 00000000 00000000 00000000 0000011 $$

But, what if the C language inteprets $$0 10000000 10101010001111010111000 $$ as a integer, not a float ? Then it would interpreted as $$1079320248$$. How to do this?
We trick C:

```c++
float f = 3.33
int i = *( int *)&f;
printf("%d",i); //prints 1079320248
```

We first fool C to think that the adress where $$f$$ is located points to a int, not a float, and to extract this information, we point again, thats exactly whats going on line 2. Now we can make bit tricks with the binary representation of floats.

Finally, Knowing all of this, the algorithm can be understood.

**W T F**

We want to calculate 

$$y = \frac{1}{\sqrt{x}} $$

Applying log to both sides: 

$$log(y) = log(x^{\frac{-1}{2}})$$

$$log(y) = -1\frac{1}{2} * log(x)$$

using the previous log representation:

$$ \frac{M_{y} + 2^{23} * E_{y}}{2 ^{23}} + \mu - 127 = -\frac{1}{2} * (\frac{M_{x} + 2^{23} * E_{x}}{2 ^{23}} + \mu - 127)$$

After a long boring rearrangement of terms, we have:

$$M_{y} + 2^{23} * E_{y} = \frac{3}{2} * 2^{23} * (127 - \mu) -\frac{1}{2} * (M_{x} + 2^{23} * E_{x}) $$

Considering that $$M_{y} + 2^{23} * E_{y} $$ is just the binary representation of $$y$$, (the same for $$x$$) then:

$$ y =  \frac{3}{2} * 2^{23} * (127 - \mu) -\frac{1}{2} * x $$

Calculating $$ \frac{3}{2} * 2^{23} * (127 - \mu) $$ for $$\mu = 0.04505$$ and converting to hexadecimal:


$$ y =  0x5f3759df - \frac{x}{2} $$ 

And therefore we transformed the original function involving division and square rooting to one only involving subtraction and bit shifting! we can do the shift because of the evil bit trick :)

To get the actual number in float from the binary representation, we undo the trick:

```c++
y = * (*float)&x;
```

And that's it! .... Well , not quite, there's one more optimzation we can do to enhance the approximation:

**Newton's Method**

Newton's method is a numeric procedure to have an approximation of the root of a function.

The following image makes it more clear:

![My helpful screenshot](/assets/images/newton.png)

So, given a number $$x$$, we iteratively calculate new $x$'s until we have $$f(x) \approx 0.0 $$ in the following way:

$$ f\prime(x) = \frac{dy}{dx} $$


$$ dx = \frac{dy}{f\prime(x)} $$

$$ x_{n} - x_{n-1} = \frac{f(x)}{f\prime(x)} $$

$$ x_{n} = x_{n-1} + \frac{f(x)}{f\prime(x)} $$

$$ \frac{1}{\sqrt{x}} $$ is root for:

For $$ f(y) = \frac{1}{y^{2}} - x $$

So,


$$ \frac{df}{dy} = -2 * y^{-3} $$


So,

$$ y_{n} = y_{n-1} + \frac{y_{n-1}^{-2} - x}{-2*y_{n-1}^{-3}} $$

$$ y_{n} = y_{n-1} - (-0.5 * y_{n-1} + 0.5 * x * y_{n-1}^{3} ) $$

$$ y_{n} = y_{n-1} * (1.5 - 0.5 * x * y_{n-1} * y_{n-1}) $$

Which is exactly the last line of code. Since we already have a good approximation, one iteration is enough. And that's it !!! Personally this was a very cool trick to learn, how algorithms could overcome the hardware limitations at the time in smart ways :) 

























<!-- 

1. You are a public general 
2. Have an unusual amount of personal pain 
3. A lot of rejection from family ( don’t understand you )
4. You are a solver of complex problems ( examples - Daniel and Joesph from the Bible ) 
5. Highly intuitive 
6. Sensitive ( have a heart for people ) 
7. Contact with the spirit and natural world 
8. People have a strong reaction to you ( a lot of hate and love ) 
9. You don’t fit in ( you are special ) 
10. Very vivid dreams that come true in your actual life


IEEE 754

scientific notation

As usual, we are given 32 bits, first bit is the sign  (always zero fo quake)

next eight bits defines the exponent [255 000] -127 , bc we want negative exponent

last 23 bits its the mantissa 

formular ,log , approximation, correction, 

mi -127 + (M+2^23 * E) / (2^23)


cant do bit manipulation, floats are tied to IEEE 754

cast -> lost bits 
```
Write an SQL query that reports the buyers who have bought S8 but not iPhone. 
Product table:
+------------+--------------+------------+
| product_id | product_name | unit_price |
+------------+--------------+------------+
| 1          | S8           | 1000       |
| 2          | G4           | 800        |
| 3          | iPhone       | 1400       |
+------------+--------------+------------+

Sales table:
+------------+----------+------------+----------+-------+
| product_id | buyer_id | sale_date  | quantity | price |
+------------+----------+------------+----------+-------+
| 1          | 1        | 2019-01-21 | 2        | 2000  |
| 1          | 2        | 2019-02-17 | 1        | 800   |
| 2          | 3        | 2019-06-02 | 1        | 800   |
| 3          | 2        | 2019-05-13 | 2        | 2800  |
+------------+----------+------------+----------+-------+


``` -->