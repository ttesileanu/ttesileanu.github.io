---
layout: default
title: Home
permalink: /
social: true  # includes social icons at the bottom of the page
---

<div class="posts">
  <div class="post" id="springContainer" style="position: relative; width: 75%; margin-left: auto; margin-right: auto;">
    <div id="sketchDescription" style="background-color: rgba(255, 255, 255, 0.98); position: absolute; left: 1em; top: 2em; right: 1em; bottom: 1em; padding: 1em; padding-top:0px; visibility: hidden; border-width: 3px; border-style: solid; overflow: scroll;">
      <h4>Spring simulation</h4>
      <small>
      <table class="sketchTable">
        <tr>
          <td><img src="public/img/springdesc/springmasses.png" style="border: none; width: 4em" /></td>
          <td>masses have different sizes</td>
        </tr>
        <tr>
          <td><img src="public/img/springdesc/springsprings.png" style="border: none; width: 4em" /></td>
          <td>spring stretch indicated by redness</td>
        </tr>
        <tr>
          <td><img src="public/img/springdesc/springgravity.png" style="border: none; width: 4em" /></td>
          <td>uniform acceleration (change using arrow in the corner)</td>
        </tr>
        <tr>
          <td><img src="public/img/springdesc/springdots.png" style="border: none; width: 4em" /></td>
          <td>dots move at constant velocity, except for reflections at walls</td>
        </tr>
        <tr>
          <td><img src="public/img/springdesc/springviscosity.png" style="border: none; width: 4em" /></td>
          <td>masses slowed down by air resistance</td>
        </tr>
        <tr>
          <td><img src="public/img/springdesc/springcollisions.png" style="border: none; width: 4em" /></td>
          <td>collisions between masses are perfectly elastic</td>
        </tr>
        <tr>
          <td><img src="public/img/springdesc/springwalls.png" style="border: none; width: 4em" /></td>
          <td>collisions with walls lose energy</td>
        </tr>
      </table>
      </small>
    </div>
    <canvas id="springCanvas"></canvas>
  </div>
  <div class="post">
    <p>I'm an Associated Research Scientist at the <a href="https://www.simonsfoundation.org/flatiron/center-for-computational-neuroscience/">Center for Computational Neuroscience</a> within the <a href="https://www.simonsfoundation.org/flatiron/">Flatiron Institute</a>. I work on building biologically plausible versions of statistical algorithms, with an emphasis on temporal correlations.</p>

    <p>Use the navigation menu at the top/left to learn more, or contact me using one of the links below.</p>
  </div>
</div>

<script src="public/js/processing_mod.min.js"></script>
<script src="public/js/springs.js"></script>
<script>initSketch();</script>
