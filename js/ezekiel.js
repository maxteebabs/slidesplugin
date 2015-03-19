jQuery.prototype.ezekielplugin = function(settings) {
    return this.each(function(){
    

    var defaults = { //initializing our default settings
        width: 697,
        height: 400,
        vertical: false,
        auto: false,
        fade: false,
        current: 0,
        items: 0,
        next: false,
        prev: false,
        slidespeed: 600,
        visible: 1,             
        pagination: false,
        paginationItem: function( index ) {
            return '';
        },
        pauseOnClick: false
    };


    var config = $(this).extend(defaults, settings); //storing our default settings in a config variable. .extend merges two objects and store in the first object
    
    // configure our plugin ul and li
    var ul = $(this); //getting ul and li parameters
    var li = ul.children('li');
    
    if(config.pauseOnClick) {
        li.bind('click', function () { //ajax method .bind() allows li to listen to click
            config.autoplay = false;
        });
    }
    
    config.items = li.length; //getting list items the same thing as number of slides
    
    var height = config.height;
    var width = config.width;
    

    if(config.visible>1) {
        if(config.vertical)
            height = height*config.visible;
        else
            width = width*config.visible;
    }
    
    ul.wrap('<div class="myframe" style="width:'+width+'px;height:'+height+'px;overflow:hidden">');
    var container = ul.parent('.myframe');
    if(!config.vertical) {
        ul.width(config.items*config.width);
        ul.height(config.height);
    } else {
        ul.width(config.width);
        ul.height(config.items*config.height);
    }
    ul.css('overflow','hidden');
    
    li.each(function(i,item) {
        $(item).width(config.width);
        $(item).height(config.height);
        if(!config.vertical)
            $(item).css('float','left');
    });
    
    // function for sliding our plugin
    var slide = function(dir, click) {
        
        if(typeof click == "undefined" && config.auto==false)
            return;
    
        if(dir==="next") {
            config.current += config.visible;
            if(config.current >= config.items){
                config.current = 0;
             }
        } else if(dir==="prev") {
            config.current -= config.visible;
            if(config.current<0)
                config.current = (config.visible==1) ? config.items-1 : config.items-config.visible+(config.visible-(config.items%config.visible));
                if(config.current == config.items){
                    config.current = config.items-config.visible;
                }
        } else {
            config.current = dir;
        }
        
        // set pagination
        if(config.pagination != false) {
            container.next('.paginate').find('li').removeClass('paginate-active')
            container.next('.paginate').find('li:nth-child('+(config.current+1)+')').addClass('paginate-active');
            
        }
        
        // fade
        if(config.fade!=false) {
            ul.fadeOut(config.fade, function() {
                ul.css({marginLeft: -1 * config.current* config.width});
                ul.fadeIn(config.fade);
            });
            
        // slide
        } else {
            if(!config.vertical)
                ul.animate( {marginLeft: -1.0*config.current*config.width}, config.slidespeed );
            else
                ul.animate( {marginTop: -1.0*config.current*config.height}, config.slidespeed );
        }
        
        if(typeof click !== "undefined")
            config.auto = false;
        
        if(config.auto !== false)
            setTimeout(function() {
                slide('next');
            }, config.auto);
    }
    
    // include pagination
    if(config.pagination != false) {
        container.after('<ul class="paginate"></ul>');
        var pagination = container.next('.paginate');
        for(var i=0;i<config.items;i++) {
            if(i==0)
                pagination.append('<li class="paginate-active">' + config.paginationItem(i + 1) + '</li>');
            else
                pagination.append('<li>' + config.paginationItem(i + 1) + '</li>');
        }

        pagination.find('li').each(function(index, item) {
            $(this).click(function() {
                slide(index,true);
            });
        });
    }
        
    // set event handler for next and prev
    if(config.next!==false)
        config.next.click(function() {
            slide('next',true);
        });
        
     //to check if the previous handle is already assigned   
    if(config.prev != false)
        config.prev.click(function() {
            slide('prev',true);
        });
    
    // start auto sliding
    if(config.auto !== false)
        setTimeout(function() {
            slide('next');
        }, config.auto);
});
}
