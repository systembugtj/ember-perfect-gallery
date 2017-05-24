import Ember from 'ember';
import layout from '../templates/components/ember-perfect-gallery';

export default Ember.Component.extend({
  layout,

  didInsertElement() {
    this._super(...arguments);

    var containerElement = document.getElementById('ember-perfect-gallery');
    this.perfectLayout(containerElement, this.get('photos'));

    this.get('resizeService').on('didResize', event => {
      var numOfPhotos = this.get('photos').length;
      for (var i = 0; i < numOfPhotos; i++) {
        var photoElement = document.getElementsByClassName('ember-perfect-gallery-image')[i];
        photoElement.style.width = `0px`;
        photoElement.style.height = `0px`;
      }

      this.perfectLayout(containerElement, this.get('photos'));
    });
  },

  perfectLayout(node, photos) {
    // The '-20' magical number is a reduction in the width of gallery container DOM element.
    // It is necessary for the images to stay in one row as the window is resized.
    // It was found through experimentation to work well at this vaue.
    // perfect-layout computes the sizes well, but there's something in the DOM sizing (no extra padding/margins added)
    // itself that ends up increasing the width and wrapping elements around.
    // TODO: https://github.com/myartsev/ember-perfect-gallery/issues/2: needs investigation, I don't like magic numbers.
    var width = $(node).width() - 20;
    const perfectRows = perfectLayout(photos, width, $(window).height(), {
      margin: 2
    });

    var photoIndex = 0;
    perfectRows.forEach(function(row) {
      row.forEach(function(img) {
        var photoElement = document.getElementsByClassName('ember-perfect-gallery-image')[photoIndex++];
        photoElement.style.width = `${img.width}px`;
        photoElement.style.height = `${img.height}px`;
        photoElement.style.background = `url('${img.src}')`;
        photoElement.style['background-size'] = 'cover';
      });
    });
  },
});
