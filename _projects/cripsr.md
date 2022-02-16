---
layout: page
title: CRISPR against bacteriophage
description: modeling the interaction between bacteria with CRISPR and phages
img: assets/img/project_icon_crispr.png
redirect: 
github: https://github.com/ttesileanu/crispr-against-phage
importance: 4
category: past
---

We modeled bacteria-phage interactions when bacteria are capable of CRISPR-mediated
adaptive immunity. Our model exhibits a variety of behaviors, from long-term coexistence
of bacteria and phage, to extinction of one of the populations. We characterized the way
in which the immune repertoire of a bacterial population depends on various
characteristics of the interaction, showing how the rate at which immunity is acquired
can lead to more or less diverse immune repertoires.

<div class="row justify-content-sm-center">
    <div class="col-sm-7 mt-3 mt-md-0">
        {%- include figure.html path="assets/img/project_crispr_bio.png" dark_path="assets/img/project_crispr_bio-dark.png" title="Basic biology of the CRISPR mechanism" class="img-fluid rounded" zoomable=true -%}
    </div>
</div>

Bacteria are constantly at threat from invading viruses (bacteriophages). There are
various ways in which bacteria can defend themselves against such infections, but one of
the most intriguing ones is a recently-discovered mechanism called CRISPR. CRISPR is a
heritable, adaptive immune system, meaning that immunity to a particular phage persists
after the infection ends, as with mammalian immunity. Furthermore, unlike in mammals,
this immunity is passed on to daughter cells.

CRISPR works by incorporating small bits (30-70 base pairs) of viral DNA sequence,
called "spacers", into the bacterial genome. When a virus enters the cell, its DNA is
compared against these templates, and if a match is found, the virus is chopped up and
neutralized.

The exact way in which spacers are acquired is not completely understood. It is also not
known whether different spacers for the same virus can be more or less effective at
defending against the infection. We have been working on a population dynamics model of
the interaction between CRISPR-enabled bacteria and phage that can help approach these
questions from a quantitative standpoint.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {%- include figure.html path="assets/img/project_crispr_model.png" dark_path="assets/img/project_crispr_model-dark.png" title="Our model of the interaction between CRISPR and bacteriophages" class="img-fluid rounded" zoomable=true -%}
    </div>
</div>

Our model shows that differences in the effectiveness of spacers can lead to
highly-peaked spacer distributions, in which a few spacers dominate the population. This
is what is observed in experiments. In contrast, if spacers differ mainly in the ease
with which they are acquired, or if the overall acquisition rate is high, the
steady-state spacer distribution is more homogeneous.

<div class="publications">
    <h2>publication</h2>
    {% bibliography -f papers -q @article[keywords ^= crispr] %}
</div>
