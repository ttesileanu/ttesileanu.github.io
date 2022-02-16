---
layout: page
title: transcriptional regulation
description: building models to predict the effect of transcription factors on gene expression
img: assets/img/project_icon_transcription.png
redirect: 
github: https://github.com/ttesileanu/fitseq
importance: 6
category: past
---

We worked on building quantitative models for describing transcriptional regulation in
prokaryotes and eukaryotes. The models assume that the interaction between a
transcription factor and a promoter or enhancer region is mediated by a
sequence-dependent binding energy. Using a high-throughput mutational assay, we were
able to accurately model the transcriptional profile of a mammalian enhancer, and used
this information to generate artificial enhancer sequences better suited for a given
purpose.

Not all genes in an organism's DNA are active at the same time. This is most clear for
multicellular organisms, where, for example, brain cells and muscle cells have very
different expression patterns despite having identical DNA. Even in unicellular
organisms, the genes expressed at any given time, and the level at which they are
expressed, is heavily regulated depending on internal and external conditions. A classic
example is the *lac* operon in *E. coli* which turns on or off the genes necessary for
metabolizing lactose depending on whether lactose is present in the environment, and
whether a more desirable sugar (such as glucose) is not.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {%- include figure.html path="assets/img/project_transcription_model.png" dark_path="assets/img/project_transcription_model-dark.png" title="Example promoter with transcription factors" class="img-fluid rounded" zoomable=true -%}
    </div>
</div>

One way in which gene transcription is regulated is with the help of proteins called
transcription factors. These bind to DNA regions near the gene, called promoters, and
affect the ease with which RNA polymerase can bind to the DNA and transcribe the gene.
The binding of transcription factors to promoters is highly sequence-specific and having
quantitative models for this binding is important for understanding transcriptional
regulation.

Our approach starts with a library of thousands of promoter sequences that have been
randomly mutated from their wild type. These sequences are built and used in an assay
capable of measuring the changes in transcription due to the mutations. Our algorithms
start with this data, identify likely spots for transcription factor binding, and then
attempt to fit the data by positing a particular form for how the interaction between
transcription factors and DNA depends on the promoter sequence. We have demonstrated
this technique by applying it to a widely-used mammalian enhancer (a DNA region similar
to a promoter, but located farther away from the gene it controls). We used the model to
search for enhancer sequences that improve the behavior of the system, and validated
them in experiments.

<div class="publications">
    <h2>publication</h2>
    {% bibliography -f papers -q @article[keywords ^= transcription] %}
</div>
