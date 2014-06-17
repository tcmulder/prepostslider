//prepost jquery plugin
(function($) {
  $.fn.prepost = function(options) {

    //the slide slideshow object
    var slide = {
      //initialize the object properties
      initVars: function(slideshow){
        //the div that contains the slideshow
        this.slideDiv = slideshow;
        //the ul that contains the slides
        this.slideUl = this.slideDiv.find('ul');
        //the li slides
        this.slideLi = this.slideDiv.find('li');
        //the current slide
        this.slideCur = 0;
        //options passed into the plugin
        this.opt = $.extend({
          //center the first and last slide
          centerEnds: false
        }, options);
      },

      //initialize the slider
      init: function(slideshow){

        //set up the properties
        this.initVars(slideshow);

        //for the slider parent div
        this.slideDiv
          //hide overflow (visible by default as fallback)
          .css('overflow-x','hidden')
          //bind swipe navigation for touch devices
          .bind('touchstart touchend', function(e){
            slide.swipe(e);
          })
          //add the post slide/pre slide navigation buttons
          .prepend('<a href="javascript:void(0);" id="prepost-pre" class="prepost-pre">prev</a><a href="javascript:void(0);" id="prepost-post" class="prepost-post">next</a>');
        //for each slide list item (indivisual slides)
        this.slideLi.each(function(){
          var that = $(this);
          that
            //grab the img src and add it as the background image
            .css({
              'background-image': 'url(' + that.find('img').attr('src') + ')'
            })
            //hide the imgs but maintain placement
            .find('img')
              .css('visibility','hidden');
        //when users click an li
        }).bind('click',function(){
          //get the clicked li's index number
          var thisSlide = slide.slideLi.index($(this));
          //identify this li as the current slide
          slide.slideCur = thisSlide;
          //move to this slide
          slide.moveTo(thisSlide);
        });

        //on pre slide nav button click
        $('#prepost-pre').click(function(){
          //go one slide back
          slide.decrement();
        });
        //on post slide nav button click
        $('#prepost-post').click(function(){
          //go one slide forward
          slide.increment();
        });

        //fix up the slider on window resize
        var slideResize = null;
        $(window).resize(function(){
          //clear any existing timeout
          window.clearTimeout(slideResize);
          //move to the current slide again 100ms after the window stops resizing
          slideResize = window.setTimeout(function(){slide.moveTo(slide.slideCur);}, 100);
        });

        //nav forward and back on left/right arrow click
        $(document).keydown(function(e){
            if (e.keyCode == 37) { //left
              slide.decrement();
            } else if (e.keyCode == 39){ //right
              slide.increment();
            }
        });

        //initially, move to the current slide (first one)
        slide.moveTo(this.slideCur);
      },

      //move to a slider
      moveTo: function(slideNum){
        //store the position to move to
        var movePos = null;
        ///get the li's width
        var liWidth = Math.round(this.slideLi.eq(slideNum).width());
        //get the li's left position
        var liPos = this.slideLi.eq(slideNum).position().left;
        //get the div's (slider parent's) width
        var viewWidth = this.slideDiv.width();
        //center the slide
        movePos = -(liPos - ((viewWidth - liWidth) / 2));
        //if the first and last slide should not center (default)
        if(!this.opt.centerEnds){
          //if this is the first slide
          if(slideNum == 0){
            //move to the starting (don't center)
            movePos = liPos;
          //if this is the last slide
          } else if(slideNum == this.slideLi.length - 1){
            //just slide to the end (don't center)
            movePos = -(liPos - ((viewWidth - liWidth)));
          }
        }
        //move the ul with the slides in it
        this.slideUl.css('transform','translateX(' + movePos + 'px)');
        //for all the slides (lis)
        this.slideLi
          //add innactive class
          .addClass('inactive-slide')
            //for the current slide
            .eq(slideNum)
              //remove the inactive class
              .removeClass('inactive-slide');
      },

      //increment the slide
      increment: function(){
        //if it's not the last slide
        if(slide.slideCur < slide.slideLi.length - 1){
          //increment the current slide and move to it
          slide.moveTo(++slide.slideCur);
        }
      },

      //decrement the slide
      decrement: function(){
        //if it's not the first slide
        if(slide.slideCur != 0){
          //decrement the current slide and move to it
          slide.moveTo(--slide.slideCur);
        }
      },

      //handle touch swipes
      swipe: function(e){
        //get mouse position
        var mousePos = function(e){
          return e.clientX - slide.slideDiv.offset().left;
        }
        //if the event was the starting of a touch
        if(e.type == 'touchstart'){
          //set swipe from origin
          slide.swipeFrom = mousePos(e.originalEvent.touches[0]);
        //if the event was the end of a touch
        } else if (e.type == 'touchend'){
          //set the swipe to origin
          slide.swipeTo = mousePos(e.originalEvent.changedTouches[0]);
          //determine the difference between from and to
          var delta = slide.swipeFrom - slide.swipeTo;
          //if the delta was big enough and positive then increment
          if(delta > 100){
            slide.increment();
          //if the detla was big enough and negative then decrement
          } else if (delta < -100){
            slide.decrement();
          }
        }
      }

    };

    //initialize the slider for the object passed in
    slide.init(this);

  };

}(jQuery));

//call prepostslider on an element
jQuery(function($){
  $('.prepostslider').prepost({
    centerEnds: true
  });
});
