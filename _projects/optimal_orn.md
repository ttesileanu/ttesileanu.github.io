---
layout: page
title: olfactory repertoire
description: efficient coding for optimizing the distribution of olfactory receptor types
img: assets/img/project_icon_optimal_orn.png
redirect: 
github: https://github.com/ttesileanu/OlfactoryReceptorDistribution
importance: 2
category: past
---

Olfaction, or the sense of smell, is mediated by volatile molecules that drift through
the air and enter the nose. These molecules, also called "odorants", make their way to
olfactory sensory neurons (OSNs) in the nasal epithelium. Each sensory neuron expresses
a single type of receptor molecule, and each receptor molecules has a certain binding
profile to a wide variety of odorants.

When an odorant binds to a receptor inside an OSN, there is a certain chance that the
neuron will spike, and this probability depends on both the odorant and receptor type.
All the neurons expressing a certain receptor type project their axons to one (or a few)
spherical structures in the olfactory bulb called glomeruli. This means that all the
information that the brain has regarding the olfactory environment is contained in the
activations at the level of the glomeruli.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {%- include figure.html path="assets/img/project_optimal_orn_osn_to_mitral.png" dark_path="assets/img/project_optimal_orn_osn_to_mitral-dark.png" title="Organization of olfactory periphery" class="img-fluid rounded" zoomable=true -%}
    </div>
</div>

Experiments have shown that olfactory receptors have a wide range of abundances, with
some receptors being thousands of times more common than others in the epithelium. To
explain this, we propose a model based on the so-called "efficient coding" hypothesis,
which suggests that the sensory periphery is structured so as to take advantage of
statistical regularities in the environment.

In the case of olfaction, because of the different likelihood of encountering different
odors in natural olfactory scenes, some receptor types yield more information about the
environment than others. Since each receptor has a certain amount of noise, it is
advantageous to average the activations from many of them in order to increase the
signal-to-noise ratio. Given a fixed total number of neurons (related to the size of the
nasal epithelium), this implies a balance between reducing noise for the most important
receptors, while also maintaining an acceptable signal-to-noise level for the others.
More formally, we are looking for an optimal receptor distribution that maximizes the
information that glomerular activations contain about the olfactory environment.

Since the optimal receptor distribution depends on the statistics of natural odors, the
model predicts that a change in the environment should lead to a change in the
abundances of different receptor types, as observed in mammals. We show that this effect
is more pronounced when the olfactory receptors are narrowly-tuned to detect a small
number of odors. Our model also suggests that there is a monotonic relationship between
the total number of olfactory sensory neurons and the number of receptor types expressed
in the olfactory epithelium of individuals of related species.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {%- include figure.html path="assets/img/project_optimal_orn_summary.png" dark_path="assets/img/project_optimal_orn_summary-dark.png" title="Organization of olfactory periphery" class="img-fluid rounded" zoomable=true -%}
    </div>
</div>

Our basic model prescribes an outcome — maximum information transfer between the
environment and the brain — but does not tell us how this can be implemented with the
building blocks available in the nose. We therefore show that a simple population
dynamical model based on logistic growth can be used to reach the predicted optimum,
suggesting that a realistic implementation is indeed possible.

In short: we developed a theoretical model explaining the uneven distribution of
different receptor types in the olfactory epithelium. We suggest that the reason for
which some receptor types are much more abundant than others is related to the
affinities that these receptors have for different odors, and the natural statistics of
odors. In particular, this means that in mammalian species, where the olfactory
epithelium is regularly replaced, the distribution of receptors changes with olfactory
experience, a phenomenon that has been observed experimentally.

<div class="publications">
    <h2>publication</h2>
    {% bibliography -f papers -q @article[keywords ^= orn] %}
</div>
