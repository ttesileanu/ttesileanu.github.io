---
layout: page
title: grid cells and Koopman
description: understanding grid and place cells in terms of transfer operators
img: assets/img/project_icon_koopman_grid.png
redirect: 
github: https://github.com/ttesileanu/bio-koopman-private
importance: 1
category: current
---

Animals are capable of performing complex navigational tasks, from exploring an unknown
environment to finding efficient paths to target locations in known environments. There
are cells in the animal hippocampus that fire when – and only when – the animal is in a
given position. These are called *place cells*, and are widely believed to facilitate
navigation.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {%- include figure.html path="assets/img/project_koopman_grid_rfs.png" dark_path="assets/img/project_koopman_grid_rfs-dark.png" title="Place cells and grid cells" class="img-fluid rounded" -%}
    </div>
    <div class="caption">
        Receptive fields for place cells (left) and grid cells (right). From <a href="https://www.sciencedirect.com/science/article/abs/pii/S0166223615002283">Sanders et al., 2015</a>.
    </div>
</div>

The entorhinal cortex, located adjacent to the hippocampus, contains a different kind of
location-sensitive cells: the *grid cells*. Grid cells fire not at a single position,
but at a hexagonal grid of positions. The periodic nature of grid fields is reminiscent
of the periodicity in Fourier modes, or more generally, the periodicity seen in the
eigenvectors of matrices that have to do with spatial adjacency in some way. This has
led many to speculate that grid cells correspond to the eigenvectors of some matrix –
which matrix exactly is a matter of debate.

Understanding how place cells and grid cells relate to one another is itself unclear,
with models sometimes suggesting that either one of these types of cells is "primordial"
and the other is derived from it. Putting this all together into a model of how place
and grid cells are actually used in order to generate accurate navigation is yet another
issue.

Our work suggests an answer based on the mathematics of *transfer operators*. One basic
question is why a concept that is fundamentally linear – eigendecomposition – enters the
picture for a system that is, in some sense, *non*linear – the dynamics of real-world
navigation. The theory of transfer operators suggests an answer: any nonlinear system
can be linearized by representing it in a particular infinite-dimensional way.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {%- include figure.html path="assets/img/project_koopman_grid_overview.png" dark_path="assets/img/project_koopman_grid_overview-dark.png" title="Koopman place/grid system" class="img-fluid rounded" -%}
    </div>
</div>

The idea that nonlinear dynamics can be linearized can sound paradoxical at first, but
the basic mathematical formalism is actually relatively straightforward. Consider a
nonlinear dynamical system with state $$\mathbf x(t)$$ that obeys

$$ \mathbf x(t+s) = T_s(\mathbf x(t))\,, $$

where $$T_s$$ is some nonlinear mapping that propagates the state forward in time for
a time $$s$$. We can define the *Koopman operator*, a function that maps functions into
other functions:

$$ (\mathcal K_s f)(\mathbf x(t)) = f(\mathbf x(t+s))\,. $$

This operator is clearly linear. The price we pay for the linearization is that the
space on which it acts is the space of all functions mapping a state to a number – an
infinite-dimensional space in most cases. This is a steep price to pay, but the hope is
that restricting to a space of functions that is large-enough dimensional will lead to
dynamics is linear to a good-enough approximation. This approach is called Dynamic Mode
Decomposition (DMD).

Where do place cells and grid cells enter into the picture? Imagine that place cells act
as the restricted function space from DMD. They are functions of an animal's state and
there are enough of them to yield a increase in dimensionality. If this dimensionality
increase is large enough, and if the functions are perhaps chosen diligently (though
maybe a random choice would work nearly as well), then the dynamics of place-cell
activations should be approximately linear.

It is important to consider several different kinds of dynamics. The system could be
trying to predict natural, uncontrolled dynamics, such as falling or sliding on ice.
From the point of view of navigation, however, it is perhaps more natural to consider
*controlled* dynamics: for example, an animal might want to know where it will end up if
it takes a few steps to the right. We therefore assume that there are several different
dynamics that the system can encode and that there is a mechanism that chooses between
them.

Once the dynamics of the system has been linearized, predicting future states is a
matter of matrix multiplications, which can be implemented in biological circuits
relatively easily. What, then, is the role of the grid cells?

Our idea for the grid cells revolves around the fact that the actions that animals can
take are often not all-or-nothing, but allow a certain level of gradation. For instance,
an animal may move slower or faster in a given direction. Having a different dynamical
mode learned for each possible strength would be wasteful; instead, the same goal can be
achieved by raising the linear operator that implements the dynamics to a power
proportional to the strength. This is most easily done in the eigenbasis of that
operator – hence, the introduction of grid cells that decompose the place-cell
activations into the eigenmodes of the linear transfer operator. This transfer operator
is an approximation of the Koopman operator, and so our conjecture is that grid cells
correspond to the Koopman eigenmodes.

Many questions remain: for instance, the output of real neurons, even if we focus only
on the firing rate, is real and non-negative; Koopman eigenmodes can not only take
negative values, but are typically complex. There are ways to deal with this, but it is
not clear to what extent these are present in the brain.
