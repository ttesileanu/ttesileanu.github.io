---
layout: post
title: A javascript real-time neural simulation
---

I wrote this around 2015-2016, when I first realized that Javascript code can run *very* fast.

Run your mouse over the neurons of the network to seed the activity. These are [integrate-and-fire neurons](https://en.wikipedia.org/wiki/Biological_neuron_model#Leaky_integrate-and-fire) with nearest-neighbor connections, so the activation propagates in waves. The connections also follow a [synaptic timing-dependent plasticity (STDP) learning rule](http://www.scholarpedia.org/article/Spike-timing_dependent_plasticity), so interesting patterns may emerge.

{% include nnet_simulation.html %}
