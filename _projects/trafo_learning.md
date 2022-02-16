---
layout: page
title: motion detectors
description: emergence of localized motion detectors from natural-image statistics
img: assets/img/project_icon_trafo_learning.png
redirect: 
github: https://github.com/ttesileanu/nsm-motion-detect
importance: 2
category: current
---

Motion detection is a fundamental task for animal visual systems. In fact, both
vertebrates and invertebrates have motion-sensitive cells early on in their visual
pathways - as early as the retina in vertebrates. These cells typically collect
information from a small number of light-sensitive cells in a small area of the visual
field, thus exhibiting localized and sparse connectivity. Is this simply a result of
long-range connectivity being more "expensive" in energetic terms?

We argue that the localization of motion-detector receptive fields is at least partly
related to something else than energy efficiency: the statistics of natural scenes.

If the motion projected on the retina was always global, with a consistent velocity
across the entire visual field, then it would make sense to average across a large
number of cells in order to obtain a more accurate estimate of motion direction and
magnitude. Instead, of course, motion is often localized as different objects move in
different directions and at different rates. It thus appears that it would make sense
even from a purely statistical point of view to have localized motion detectors. Can we
show that this localization arises using a simple unsupervised-learning approach?

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {%- include figure.html path="assets/img/project_trafo_learning_summary.png" dark_path="assets/img/project_trafo_learning_summary-dark.png" title="Transformation learning with biological circuits" class="img-fluid rounded" zoomable=true -%}
    </div>
</div>

We start from the assumption that the early layers of the visual system compress
information by attempting to predict the light activation some time in the future. More
specifically, suppose every pair of consecutive frames in a natural video are
(approximately) related by a transformation $$R_t$$,

$$ \mathbf x_t = R_t \mathbf x_{t-1} \,, $$

where $$\mathbf x_t$$ is a vector (flattened) representation of the frame at time $$t$$.
Using a biologically plausible neural network, we can learn a basis set of
transformations such that $$R_t$$ can be expressed as a sparse linear combination of
elements in this basis for every $$t$$. These transformations double up as filters that
can detect their effect on a frame $$\mathbf x_t$$. It turns out that training our
network on natural (or naturalistic) videos yields filters that correspond to localized
motion detectors, provided the frames are whitened.

While we do observe localized receptive fields in our simulations, biological motion
detectors are even more localized, suggesting that additional principles are at work
in this case.
