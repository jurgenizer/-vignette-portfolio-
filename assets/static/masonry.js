/**
 * Masonry Layout with Cross-Browser Compatibility
 *
 * Creates a responsive flexbox masonry grid layout with these features:
 * - Preloads all images before calculating layout dimensions
 * - Displays a preloader while images are loading
 * - Calculates optimal grid height based on viewport width
 * - Rebuilds layout on window resize for responsiveness
 * - Includes fade-in animation for grid items
 * - Provides Firefox compatibility with timing adjustments
 * - Uses multiple fallbacks to ensure animations work in all browsers
 */

function masonry(grid, gridCell, gridGutter, dGridCol, tGridCol, mGridCol) {
  var g = document.querySelector(grid),
    gc = document.querySelectorAll(gridCell),
    gcLength = gc.length,
    gHeight = 0,
    i;

  // Safety check - ensure grid element exists
  if (!g || gcLength === 0) {
    console.warn('Masonry grid or cells not found');
    return;
  }

  // Force reflow before calculation (Firefox fix)
  g.offsetHeight;

  // Calculate total height of all grid cells
  for (i = 0; i < gcLength; ++i) {
    // Ensure the element is visible and has dimensions
    if (gc[i].offsetHeight > 0) {
      gHeight += gc[i].offsetHeight + parseInt(gridGutter);
    }
  }

  var calculatedHeight;
  
  // Use window.innerWidth for better accuracy across browsers
  if (window.innerWidth >= 1024) {
    // Desktop: use dGridCol columns
    calculatedHeight = gHeight / dGridCol + gHeight / (gcLength + 1) + "px";
    console.info('Desktop masonry grid height: ', calculatedHeight);
  }
  else if (window.innerWidth < 1024 && window.innerWidth >= 768) {
    // Tablet: use tGridCol columns
    calculatedHeight = gHeight / tGridCol + gHeight / (gcLength + 1) + "px";
    console.info('Tablet masonry grid height: ', calculatedHeight);
  }
  else {
    // Mobile: use mGridCol columns
    calculatedHeight = gHeight / mGridCol + gHeight / (gcLength + 1) + "px";
    console.info('Mobile masonry grid height: ', calculatedHeight);
  }
  
  // Apply the calculated height to the grid
  g.style.height = calculatedHeight;
  
  // Force another reflow to ensure height is applied (Firefox fix)
  g.offsetHeight;
}

// Wait for page load to ensure all scripts are available
function initMasonryWhenReady() {
  // Check if masonry element exists
  var masonryElem = document.querySelector('.masonry');
  
  if (!masonryElem) {
    console.warn('Masonry element not found');
    return;
  }

  // Check if imagesLoaded is available
  if (typeof imagesLoaded !== 'function') {
    console.error('imagesLoaded library not loaded!');
    return;
  }
  
  // Insert preloader element
  masonryElem.insertAdjacentHTML("afterend", "<div class='jurgen-preloader'></div>");
  var masonryPreloader = document.querySelector('.jurgen-preloader');
  
  // Hide masonry initially
  masonryElem.style.display = 'none';
  
  // Apply fade-in animation to each brick explicitly
  var bricks = masonryElem.querySelectorAll('.masonry-brick');
  bricks.forEach(function(brick) {
    brick.style.opacity = '0';
  });

  // Initialize masonry after images load
  imagesLoaded(masonryElem, function() {
    // Use a longer timeout for Firefox
    setTimeout(function() {
      // Hide preloader
      if (masonryPreloader) {
        masonryPreloader.style.display = 'none';
      }
      
      // Show masonry
      masonryElem.style.display = 'flex';
      
      // Calculate layout
      masonry('.masonry', '.masonry-brick', 10, 3, 2, 1);
      
      // Force a reflow before adding the loaded class
      masonryElem.offsetHeight;
      
      // Add loaded class to trigger animations
      masonryElem.classList.add('loaded');
      
      // Ensure each brick gets opacity:1 directly for browsers with CSS issues
      setTimeout(function() {
        bricks.forEach(function(brick) {
          if (getComputedStyle(brick).opacity === '0') {
            brick.style.opacity = '1';
          }
        });
      }, 100);
      
      console.log('Masonry loaded with animation!');
    }, 200);
  });
  
  // Re-initialize on resize
  window.addEventListener('resize', function() {
    masonry('.masonry', '.masonry-brick', 10, 3, 2, 1);
  });
}

// Use the proper initialization method based on document readiness
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMasonryWhenReady);
} else {
  // If already loaded, initialize after a short delay to ensure scripts are available
  setTimeout(initMasonryWhenReady, 100);
}