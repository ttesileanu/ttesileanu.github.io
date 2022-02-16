---
layout: page
title: optimal navigation
description: how animals might find optimal paths using multi-scale place cells
img: assets/img/project_icon_optimal_nav.png
redirect: 
github: https://github.com/ttesileanu/bio-optimal-nav
importance: 3
category: current
---

This a project that Jason Prentice, Josh Merel, and Vijay Balasubramanian started many
years ago and developed quite extensively. The project stalled, however, as the first
two left academia. I have joined the effort to try to finish the work and share this
with the world.

There are neurons in an animal's hippocampus that fire when the animal is in a specific
location – these are called place cells. (See also
[this other project](/projects/koopman_grid).) One curious aspect of place cells is that
the size of their receptive field changes in a specific way, with larger place fields in
the ventral hippocampus and smaller once in the dorsal one. If the goal is to encode
position, what is the purpose of having different sizes of place cells? What additional
information can larger place cells provide that the smaller ones do not?

One answer to this question is that multi-scale place cells are needed to facilitate
navigation, rather than simply encode position. To put this into a mathematical
framework, we use a [2009 control-theory paper](https://www.pnas.org/content/106/28/11478.short)
that develops very efficient methods for solving a particular restricted class of
control task.

Specifically, assume an animal is navigating a two-dimensional environment that exhibits
a non-trivial cost landscape: each location incurs a certain cost per unit time,
$$q(x)$$. Movement also incurs a cost, proportional to the squared velocity of motion.
The task is for the animal to decide how to move over a finite time horizon $$T$$ in
order to minimize the total cost incurred over that time frame.

It turns out that this problem can be solved in terms of the solution to a certain
diffusion dynamics in two dimensions, in which there are sources that are related to the
cost map $$q(x)$$:

$$ \frac{\partial g}{\partial s} = \frac{1}{2} \sigma^{2} \mathbf{\nabla}^{2} g - \frac{q(\mathbf{x})}{m\sigma^{2}} g\,, $$
with initial condition $$g(\mathbf x, 0) = 1$$.

The speed that the animal should take at each location $$\mathbf x$$ is then related to
the gradient of the function $$g$$,

$$ \mathbf u(\mathbf x) =  \frac {\sigma^2} {g(\mathbf{x},T)} \mathbf{\nabla} g(\mathbf{x},T) \,. $$

The multi-scale aspect comes in when we look for ways to efficiently calculate the
gradient.
