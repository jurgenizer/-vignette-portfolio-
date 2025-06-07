/**
 * Preload and reform the masonry
 *
 * Add some preloader text to the masonry grid and rebuild it on every resize
 * and load event after making sure all the images in the grid are loaded
 * completely.
 */

function masonry(grid, gridCell, gridGutter, dGridCol, tGridCol, mGridCol) {
  var g = document.querySelector(grid),
    gc = document.querySelectorAll(gridCell),
    gcLength = gc.length,
    gHeight = 0,
    i;

  for (i = 0; i < gcLength; ++i) {
    gHeight += gc[i].offsetHeight + parseInt(gridGutter);
  }

  if (window.screen.width >= 1024) {
    g.style.height = gHeight / dGridCol + gHeight / (gcLength + 1) + "px";
    console.info('Desktop masonry grid height: ', g.style.height);
  }
  else if (window.screen.width < 1024 && window.screen.width >= 768) {
    g.style.height = gHeight / tGridCol + gHeight / (gcLength + 1) + "px";
    console.info('Tablet masonry grid height: ', g.style.height);
  }
  else {
    g.style.height = gHeight / mGridCol + gHeight / (gcLength + 1) + "px";
    console.info('Mobile masonry grid height: ', g.style.height);
  }
}

// Initialize masonry when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if masonry element exists before proceeding
  var masonryElem = document.querySelector('.masonry');
  
  if (masonryElem) {
    // Insert preloader element dynamically
    masonryElem.insertAdjacentHTML("afterend", "<div class='jurgen-preloader'></div>");

    // Grab the masonry preloader
    var masonryPreloader = document.querySelector('.jurgen-preloader');

    // Fire the magic on every load and resize event
    ['resize', 'load'].forEach(function (event) {
      // Hide the masonry until it loads
      masonryElem.style.display = 'none';

      // Follow the below steps on every load and resize event
      window.addEventListener(event, function () {

        // Check if all the images finished loading
        imagesLoaded(document.querySelector('.masonry'), function () {

          // Hide the preloader, as it is not needed anymore
          if (masonryPreloader) {
            masonryPreloader.style.display = 'none';
          }

          // Show the masonry, as it is loaded now
          masonryElem.style.display = 'flex';

          masonry('.masonry', '.masonry-brick', 10, 3, 2, 1);

          // Done!
          console.log('Flexbox Masonry Loaded');
        });
      }, false);
    });
  } else {
    console.warn('Masonry element not found');
  }
});