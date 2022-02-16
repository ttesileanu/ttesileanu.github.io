---
layout: page
title: birdsong two-stage learning
description: a model of how two areas in the bird brain cooperate to improve learning
img: assets/img/project_icon_birdsong.png
redirect: 
github: https://github.com/ttesileanu/twostagelearning
importance: 3
category: past
---

<div class="row justify-content-sm-center">
    <div class="col-sm-6 mt-3 mt-md-0">
        We built a novel, two-stage model of song learning in zebra finches. In our
        model, a "tutor" circuit (area LMAN in the bird) learns a corrective bias for
        the song which is later solidified in a "student" circuit (pre-motor area RA).
        This requires a match between the tutor signal and the student synaptic
        plasticity rule, whose structure can be derived analytically in a firing-rate
        approximation. The resulting learning rules also work in spiking networks, and
        the tutor signal can also be generated using a reinforcement rule.
    </div>
    <div class="col-sm-6 mt-3 mt-md-0">
        {%- include figure.html path="assets/img/project_birdsong_zebra_finches.jpg" title="Zebra finches" class="img-fluid rounded" zoomable=true -%}
    </div>
</div>

Vocalizations in birds range from simple calls to more complex songs. Bird songs are
typically described as sequences of stereotyped vocalizations called syllables. It is
hypothesized that females use song quality as an indication of male fitness, making bird
song important for sexual selection.

Song complexity can vary greatly between different species of song birds, with some
species such as lyrebirds and mockingbirds being capable of imitating
[almost arbitrary sounds](https://www.youtube.com/watch?v=VjE0Kdfos4Y). Other species
produce [more stereotyped songs](https://www.youtube.com/watch?v=XNCYAZcDuGQ).

Song learning is typically split into two parts: sensory learning, during which the bird
memorizes the pattern it wants to emulate; and motor learning, during which the bird
practices singing the pattern until it gets it right. These two periods of learning can
be overlapping, as is the case for the zebra finch – the bird from which our work gets
inspiration.

The brain regions involved in song learning have been well characterized. Current
evidence suggests that neurons in the HVC generate a time base by firing at different
moments in the song, similar to a [synfire chain](http://www.scholarpedia.org/article/Synfire_chains).
The signals from HVC are projected to RA, which provides a topographic map for the
muscles involved in bird song. The synapses between HVC and RA are plastic, and
experimental evidence suggests that they are the ones responsible for song learning.

While HVC and RA are necessary and sufficient for song production, successful learning
also requires another brain area called LMAN, which also projects onto RA. Since the
firing in LMAN is highly variable, it was thought that its only role was to add
randomness to the song, providing the exploratory behavior necessary for reinforcement
learning. More recently, it has been observed that LMAN provides a biased input to RA.
Learning happens in two stages: first LMAN learns a corrective bias, and then, on a
longer time scale, this is stored in the HVC-RA synapses.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {%- include figure.html path="assets/img/project_birdsong_circuits.png" dark_path="assets/img/project_birdsong_circuits-dark.png" title="Biological circuit, and our model" zoomable=true -%}
    </div>
</div>

Our study focuses mostly on the second stage in the learning process, the transfer of
information between LMAN and RA. Using a firing-rate approximation, we showed that
efficient learning requires LMAN to adapt its signal to the synaptic plasticity rule at
work in RA. The particular structure of the LMAN signal can be derived from a gradient
descent approach. In particular, the LMAN output can range from a signal that depends
only on the current song output, to a signal that integrates the error in song
production over a long period of time.

Neurons in the brain do not have continuous outputs, but rather fire discrete spikes.
Using computer simulations, we showed that our results also hold in networks that use
spiking neurons. In addition, in these network a simple reinforcement rule can be used
to generate the LMAN signal.

Transferring information between two brain areas is likely to occur more broadly. A
straightforward generalization is to mammalian motor control, where there is also some
evidence that learning proceeds in two stages. Another process where information
transfer is important is in long-term memory formation. Short-term memory is dependent
on the hippocampus, while long-term memory is not, suggesting that memories get
transferred outside the hippocampus. Hippocampal memory replay may play a role in this
transfer, and it may parallel the way in which birds practice their song.

<div class="publications">
    <h2>publication</h2>
    {% bibliography -f papers -q @article[keywords ^= birdsong] %}
</div>
