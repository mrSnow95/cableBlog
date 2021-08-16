---
title: Multivariable Calculus
date: 2021-07-01
use_math: true
---

Multivariable Calculus and Linear Algebra are my favorite subjects in Math. Mainly because we can manipulate entitites that are way beyond 3 Dimensional, even though humans can't imagine what they would look like.

For multivariable integrals, the true story starts with a change of coordinates.

Let $$f : D ⊂ R ^ n → R $$ be an integrable function. Let also $$ x_{u} = (x_{i}(u_{j}))^ n _{i,j = 1} $$ be a change of coordinates, viewed as a map from some domain $$ D^* $$ to $$ D $$, with Jacobian $$ \frac{\partial x}{\partial u} =  det  (\frac{\partial x_{i} }{\partial u_{j}}). $$. Then :

$$  \int_{D} f(x) \,dx  =  \int_{D ^ *} f(x(u)) * | \frac{\partial x}{\partial u} | * du $$

There are three special situations worth mentioning:

-  The change in three dimensions from Cartesian to spherical coordinates $$ x = \rho * sin \phi * cos \theta, y = \rho * cos \phi * sin \theta, z = \rho * cos \phi $$ with the Jacobian $$ \frac{\partial (x,y,z)}{\partial (\rho,\theta,\phi)} = \rho ^ 2 * sin \phi $$

- The change in two dimensions from Cartesian to polar coordinates $$ x = r * cos\theta, y = r * sin \theta, $$ with the Jacobian $$ \frac{\partial (x,y)}{\partial (r,\theta)} = r $$ 

- The change in two dimensions from Cartesian to cylindrical coordinates $$ x = r * cos\theta, y = r * sin \theta, z = z $$ with the Jacobian $$ \frac{\partial (x,y,z)}{\partial (r,\theta,z)} = r $$


**Example. Compute the Fresnel integrals** 

$$ I = \int_{0} ^ {\infty} cos x ^ 2 dx $$ and $$ I = \int_{0} ^ {\infty} sin x ^ 2 dx $$ 


