---
layout: page
title: perception of visual textures
description: efficient coding predicts psychophysical thresholds for visual textures
img: assets/img/project_icon_viztex.png
github: https://github.com/ttesileanu/TextureAnalysis
importance: 1
category: past
---

Information from sensory organs typically contains a lot of redundancy: for instance,
the light intensity at nearby points on the retina is likely to be about the same, so
that the output from nearby photoreceptors is likely to be similar. Taking advantage of
such redundancies by, e.g., subtracting the average output of surrounding receptors from
that of a "central" one allows the same sensory information to be transmitted using
fewer resources.

Of course, how much redundancy there is in the sensory information and how this is
manifested depends on the statistics of natural scenes that are likely to be encountered
by the organism. For instance, the size of the surround field mentioned above might be
related to the correlation length found in natural images. This can have [measurable
consequences](https://www.pnas.org/content/107/40/17368.short).

The idea that sensory information is processed in a way that optimizes information
transfer is called the *efficient coding hypothesis*, and was introduced by Horace
Barlow in the 60s. The hypothesis has been verified in several contexts related to the
periphery of the sensory system. Some [recent](https://www.pnas.org/content/107/42/18149)
[work](https://elifesciences.org/articles/03722) has suggested that similar ideas can
apply at higher levels of processing – for instance, in the case of visual textures,
which are processed in the cortex.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {%- include figure.html path="assets/img/project_viztex_summary.png" dark_path="assets/img/project_viztex_summary-dark.png" title="Summary of psychophysics and natural-texture results" class="img-fluid rounded" zoomable=true -%}
    </div>
</div>

Our work builds on those earlier findings to show a remarkable match between the
*perceptual salience* of certain types of grayscale textures, and their variability in
natural scenes. Salience was measured, like in earlier studies, by using psychophysical
trials where a subject is asked to indicate which side of a square filled with an
unstructured random texture contains a strip of structured texture. In other words, the
subjects have to try to discriminate between unstructured and structured textures. By
measuring how hard this task is for textures that are, from a statistical standpoint,
just as different from unstructured noise, we can get a glimpse into which visual
correlations are treated as more or less important by the brain. The fact that
natural-scene analysis can predict these varying difficulty levels suggests that the
brain is adapted to the regularities found in natural scenes, in accordance with the
efficient coding hypothesis.

Interestingly, while we found excellent agreement between psychophysics and natural-image
predictions in most of the over 300 measurements that we took, there are some
significant mismatches. This is to be expected on general grounds: after all, the goal
of the brain is not simply to produce the most efficient encoding, but eventually to
use this encoded information to guide behavior. Thus, departures from efficient coding
ideas are expected. We hope that the observations we made can be used to guid further
research into the principles that guide visual processing.

<div class="publications">
    <h2>publication</h2>
    {% bibliography -f papers -q @article[keywords ^= viztex] %}
</div>
