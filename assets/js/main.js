/*  TABLE OF CONTENT
    1. Common function
    2. Initialing
*/
/*================================================================*/
/*  1. Common function
/*================================================================*/
function path(){
    var args = arguments,result = [];
    for(var i = 0; i < args.length; i++)
        result.push(args[i].replace('@', '/assets/js/syntaxhighlighter/'));
    return result;
};
var ghostApp={
    reformatPost:function(){
        if($('.post').length){
            $('.post:not(.formated)').each(function() {
                // Add ribbon
                if($(this).is('.featured')){
                    $(this).prepend('<span class="ribbon">Featured</span>');
                }
                if($(this).find('.post-media').has('img').length){
                    var $postMedia=$('.post-media',$(this));
                    var $postImg=$postMedia.find('img');
                    var postUrl=$(this).find('.post-title a').attr('href');
                    var maskStr='<div class="mask">\
                                    <a class="preview magnific-popup" href="'+$postImg.attr('src')+'">\
                                        <i class="fa fa-search"></i>\
                                    </a>\
                                    <a class="detail" href="'+postUrl+'">\
                                        <i class="fa fa-link"></i>\
                                    </a>\
                                </div>';
                    $postMedia.append(maskStr);
                }
                else if($(this).find('.post-content').has('img').length){
                    var imgs=$(this).find('.post-content').find('img');
                    $.each(imgs, function(i, item) {
                        var $item=$(item);
                        $item.replaceWith('<div class="post-photo">\
                                <img src="'+$item.attr('src')+'" alt=""/>\
                                <div class="mask">\
                                    <a class="preview magnific-popup" href="'+$item.attr('src')+'">\
                                        <i class="fa fa-search"></i>\
                                    </a>\
                                </div>\
                            </div>');
                    });
                }
                $(this).addClass('formated');
            });
            $('.mask .magnific-popup').magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                mainClass: 'mfp-img-mobile',
                image: {
                    verticalFit: true
                }
            });
        }
    },
    getAuthorInfo:function(){
        if($('#author-info').length && $('.widget.about-me').length){
            if($('#author-info').data('author-image') && $('#author-info').data('author-image')!=''){
                $('.widget.about-me .flip .front .avatar').html('<img src="'+$('#author-info').data('author-image')+'" alt=""/>');
            }
            if($('#author-info').data('author-name') && $('#author-info').data('author-name')!=''){
                $('.widget.about-me .flip .front .info .name').html($('#author-info').data('author-name'));
            }
            if($('#author-info').data('author-bio') && $('#author-info').data('author-bio')!=''){
                $('.widget.about-me .flip .front .info .bio').html($('#author-info').data('author-bio'));
            }
            $('.widget.about-me .flip .front').imagesLoaded(function() {
                var height=$('.widget.about-me .flip .front .avatar').height()+$('.widget.about-me .flip .front .info').height()+35;
                $('.widget.about-me .widget-content .flip-container .flip').css('height', height+'px');
            });
            $(document).on('click', '.flip-detail', function(event) {
                $(".widget.about-me .flip-container .flip").flippy({
                    direction: "right",
                    duration: "400",
                    verso: $('.widget.about-me .flip-data').html()
                });
                event.preventDefault();
            });
            $(document).on('click', '.flip-back', function(event) {
                $(".widget.about-me .flip-container .flip").flippyReverse();
                event.preventDefault();
            });
        }
    },
    getRecentPosts:function(){
        if($('.recent-post').length){
            $('.recent-post').each(function(){
                var $this=$(this);
                var showPubDate=false;
                var showDesc=false;
                var descCharacterLimit=-1;
                var size=-1;
                var type='static';
                var slideMode='horizontal';
                var slideSpeed=500;
                var slidePager=false;
                var isTicker=false;
                var monthName=new Array();
                monthName[0]="Jan";
                monthName[1]="Feb";
                monthName[2]="Mar";
                monthName[3]="Apr";
                monthName[4]="May";
                monthName[5]="June";
                monthName[6]="July";
                monthName[7]="Aug";
                monthName[8]="Sept";
                monthName[9]="Oct";
                monthName[10]="Nov";
                monthName[11]="Dec";
                if($this.data('pubdate'))
                    showPubDate=$this.data('pubdate');
                if($this.data('desc')){
                    showDesc=$this.data('desc');
                    if($this.data('character-limit'))
                        descCharacterLimit=$this.data('character-limit');
                }
                if($this.data('size'))
                    size=$this.data('size');
                if($this.data('type'))
                    type=$this.data('type');
                if(type==='scroll'){
                    if($this.data('mode'))
                        slideMode=$this.data('mode');
                    if($this.data('speed'))
                        slideSpeed=$this.data('speed');
                    if($this.data('pager'))
                        slidePager=$this.data('pager');
                    if($this.data('ticker'))
                        isTicker=$this.data('ticker');
                }
                $.ajax({
                    type: 'GET',
                    url: '/rss/',
                    dataType: "xml",
                    success: function(xml) {
                        if($(xml).length){
                            var htmlStr='';
                            var date;
                            var count=0;
                            $('item', xml).each( function() {
                                if(size>0 && count < size){
                                    htmlStr+='<li class="clearfix">';
                                    if(showPubDate){
                                        date = new Date($(this).find('pubDate').eq(0).text());
                                        htmlStr += '<span class="itemDate">\
                                                        <span class="date">'+date.getDate()+'</span>\
                                                        <span class="month">'+monthName[date.getMonth()]+'</span>\
                                                    </span>';
                                    }
                                    htmlStr+='<span class="itemContent">';
                                    htmlStr += '<span class="title">\
                                                        <a href="' + $(this).find('link').eq(0).text() + '">\
                                                        ' + $(this).find('title').eq(0).text() + '\
                                                        </a>\
                                                </span>';
                                    if (showDesc) {
                                        var desc=$(this).find('description').eq(0).text();
                                        // trip html tag
                                        desc=$(desc).text();
                                        if (descCharacterLimit > 0 && desc.length > descCharacterLimit) {
                                            htmlStr += '<span class="desc">' + desc.substr(0, descCharacterLimit) + ' ...\
                                                            <a href="'+$(this).find('link').eq(0).text()+'">View »</a>\
                                                        </span>';
                                        }
                                        else{
                                            htmlStr += '<span class="desc">' + desc + "</span>";
                                        }
                                    }
                                    htmlStr+='</span>';
                                    htmlStr += '</li>';
                                    count++;
                                }
                                else{
                                    return false;
                                }
                            });
                            if(type==='static')
                                htmlStr='<ul class="feedList static">'+ htmlStr + "</ul>";
                            else{
                                htmlStr='<ul class="feedList bxslider">'+ htmlStr + "</ul>";
                            }
                            $this.append(htmlStr);
                            if(type!=='static'){
                                // Updating on v1.2
                            }
                        }
                    }
                });
            });
        }
    },
    getMaxPagination:function(){
        if($('.page-number').length){
            var numberPattern = /\d+/g;
            var pageNumberStr=$('.page-number').html();
            var result=pageNumberStr.match(numberPattern);
            if(result!=null && result.length>1){
                return result[1];
            }
            else{
                return 1;
            }
        }
    },
    isotopeSetup:function(){
        if($('body').is('.masonry') && $('#isotope-content').length){
            var $container = $('#isotope-content');
            $('.post').imagesLoaded(function() {
                $container.isotope({
                    itemSelector : '.item-list',
                    resizable: false,
                    animationOptions: {
                        duration: 400,
                        easing: 'swing',
                        queue: false
                    },
                    masonry: {}
                });
                ghostApp.reloadIsotope();
            });
        }
    },
    infiniteScrollSetup:function(){
        if($('body').is('.masonry') && $('#isotope-content').length){
            var $container = $('#isotope-content');
            $container.infinitescroll({
                    navSelector     : '.pagination',    // selector for the paged navigation
                    nextSelector    : '.pagination a',  // selector for the NEXT link (to page 2)
                    itemSelector    : '.item-list',     // selector for all items you'll retrieve
                    maxPage           : ghostApp.getMaxPagination(),
                    loading: {
                        finishedMsg: 'No more post to load.',
                            img: '/assets/img/loading.gif'
                    }
                },
                // call Isotope as a callback
                function( newElements ) {
                    $container.isotope('appended', $(newElements),function(){
                        ghostApp.reformatPost();
                        $(".post").fitVids();
                        ghostApp.reloadIsotope();
                    });
                }
            );
        }
    },
    reloadIsotope:function(){
        if($('body').is('.masonry') && $('#isotope-content').length){
            ghostApp.reformatPost();
            $('#isotope-content').isotope();
        }
    },
    getFlickr:function(){
        if($('.flickr-feed').length){
            var count=1;
            $('.flickr-feed').each(function() {
                if(flickr_id=='' || flickr_id=='YOUR_FLICKR_ID_HERE'){
                    $(this).html('<li><strong>Please change Flickr user id before use this widget</strong></li>');
                }
                else{
                    var feedTemplate='<li><a href="{{image_b}}" target="_blank"><img src="{{image_m}}" alt="{{title}}" /></a></li>';
                    var size=15;
                    if($(this).data('size'))
                        size=$(this).data('size');
                    var isPopupPreview=false;
                    if($(this).data('popup-preview'))
                        isPopupPreview=$(this).data('popup-preview');
                    if(isPopupPreview){
                        feedTemplate='<li><a href="{{image_b}}"><img src="{{image_m}}" alt="{{title}}" /></a></li>';
                        count++;
                    }
                    $(this).jflickrfeed({
                        limit: size,
                        qstrings: {
                            id: flickr_id
                        },
                        itemTemplate: feedTemplate
                    }, function(data) {
                        if(isPopupPreview){
                            $(this).magnificPopup({
                                delegate: 'a',
                                type: 'image',
                                closeOnContentClick: false,
                                closeBtnInside: false,
                                mainClass: 'mfp-with-zoom mfp-img-mobile',
                                gallery: {
                                    enabled: true,
                                    navigateByImgClick: true,
                                    preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                                },
                                image: {
                                    verticalFit: true,
                                    tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
                                },
                                zoom: {
                                    enabled: true,
                                    duration: 300, // don't foget to change the duration also in CSS
                                    opener: function(element) {
                                        return element.find('img');
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    getInstagram: function(){
        if($('.instagram-feed').length){
            if(instagram_accessToken!='' || instagram_accessToken!='your-instagram-access-token'){
                $.fn.spectragram.accessData = {
                    accessToken: instagram_accessToken,
                    clientID: instagram_clientID
                };
            }
            $('.instagram-feed').each(function(){
                if(instagram_accessToken=='' || instagram_accessToken=='your-instagram-access-token'){
                    $(this).html('<li><strong>Please change instagram api access info before use this widget</strong></li>');
                }
                else{
                    var display=15;
                    var wrapEachWithStr='<li></li>';
                    if($(this).data('display'))
                        display=$(this).data('display');
                    $(this).spectragram('getUserFeed',{
                        query: 'adrianengine',
                        max: display
                    });
                }
            });
        }
    },
    getDribbble: function(){
        if($('.dribbble-feed').length){
            var count=1;
            $('.dribbble-feed').each(function(){
                var $this=$(this);
                var display=15;
                if($this.data('display'))
                    display=$this.data('display');
                var isPopupPreview=false;
                if($this.data('popup-preview'))
                    isPopupPreview=$this.data('popup-preview');
                $.jribbble.getShotsByList('popular', function (listDetails) {
                    var html = [];
                    $.each(listDetails.shots, function (i, shot) {
                        if(isPopupPreview){
                            html.push('<li><a href="' + shot.image_url + '">');
                        }
                        else{
                            html.push('<li><a href="' + shot.url + '">');
                        }
                        html.push('<img src="' + shot.image_teaser_url + '" ');
                        html.push('alt="' + shot.title + '"></a></li>');
                    });
                    $this.html(html.join(''));
                    if(isPopupPreview){
                        $this.magnificPopup({
                            delegate: 'a',
                            type: 'image',
                            tLoading: 'Loading image #%curr%...',
                            mainClass: 'mfp-img-mobile',
                            gallery: {
                                enabled: true,
                                navigateByImgClick: true,
                                preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                            },
                            image: {
                                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
                            }
                        });
                    }
                }, {page: 1, per_page: display});
            });
        }
    },
    fitVids:function(){
        $(".post .wrap").fitVids();
        $(".post").fitVids();
    },
    updateCommentCount:function(){
        if($('.disqus-comment-count').length){
            var urlArray = [];
            $('.disqus-comment-count').each(function () {
              var url = $(this).attr('data-disqus-url');
              urlArray.push('link:' + url);
            });
            $.ajax({
                type: 'GET',
                url: "http://disqus.com/api/3.0/threads/set.jsonp",
                data: { api_key: disqusPublicKey, forum : disqus_shortname, thread : urlArray },
                cache: false,
                dataType: 'jsonp',
                success: function (result) {
                    for (var i in result.response) {
                        var countText = " comments";
                        var count = result.response[i].posts;
                        if (count <= 1)
                          countText = " comment";
                        $('span[data-disqus-url="' + result.response[i].link + '"]').html(count + countText);
                    }
                }
            });
        }
        else if(window.FB){
            FB.XFBML.parse(document.body);
        }
        else if($('.gplus-comment-count').length){
            var count=1;
            $('.gplus-comment-count').each(function(){
                $(this).attr('id', 'commentscounter'+count);
                gapi.commentcount.render('commentscounter'+count, {
                    href: $(this).data('href'),
                    color: $(this).data('color')
                });
                count++;
            });
        }
    },
    mailchimpSetup:function(){
        // Submit event
        $("#mc-form input").not("[type=submit]").jqBootstrapValidation({
            submitSuccess: function ($form, event) {
                var url=$form.attr('action');
                if(url=='http://arturmeyster.us9.list-manage.com/subscribe?u=6b4dcde3e32157839f6edc1de&id=601799f673')
                {
                    console.log('Please config your mailchimp form url for this widget');
                    return false;
                }
                else{
                    url=url.replace('/post?', '/post-json?').concat('&c=?');
                    var data = {};
                    var dataArray = $form.serializeArray();
                    $.each(dataArray, function (index, item) {
                        data[item.name] = item.value;
                    });
                    $.ajax({
                        url: url,
                        data: data,
                        success: function(resp){
                            if (resp.result === 'success') {
                                alert("Got it, you've been added to our newsletter. Thanks for subscribe!");
                            }
                            else{
                                alert(resp.result);
                            }
                        },
                        dataType: 'jsonp',
                        error: function (resp, text) {
                            console.log('mailchimp ajax submit error: ' + text);
                        }
                    });
                    return false;
                }
            }
        });
    },
    syntaxHighlighter:function(){
        SyntaxHighlighter.autoloader.apply(null, path(
            'applescript            @shBrushAppleScript.js',
            'actionscript3 as3      @shBrushAS3.js',
            'bash shell             @shBrushBash.js',
            'coldfusion cf          @shBrushColdFusion.js',
            'cpp c                  @shBrushCpp.js',
            'c# c-sharp csharp      @shBrushCSharp.js',
            'css                    @shBrushCss.js',
            'delphi pascal          @shBrushDelphi.js',
            'diff patch pas         @shBrushDiff.js',
            'erl erlang             @shBrushErlang.js',
            'groovy                 @shBrushGroovy.js',
            'java                   @shBrushJava.js',
            'jfx javafx             @shBrushJavaFX.js',
            'js jscript javascript  @shBrushJScript.js',
            'perl pl                @shBrushPerl.js',
            'php                    @shBrushPhp.js',
            'text plain             @shBrushPlain.js',
            'py python              @shBrushPython.js',
            'powershell ps posh     @shBrushPowerShell.js',
            'ruby rails ror rb      @shBrushRuby.js',
            'sass scss              @shBrushSass.js',
            'scala                  @shBrushScala.js',
            'sql                    @shBrushSql.js',
            'vb vbnet               @shBrushVb.js',
            'xml xhtml xslt html    @shBrushXml.js'
        ));
        SyntaxHighlighter.all();
    },
    mainMenuEvents:function(){
        if($('.main-nav').length){
            var currentUrl=window.location.href;
            if(currentUrl.lastIndexOf('#')>0){
                currentUrl=currentUrl.substr(0,currentUrl.lastIndexOf('#'));
            }
            var $currentMenu=$('.main-nav a[href="'+currentUrl+'"]');
            if($currentMenu.length){
                $('.main-nav li.active').removeClass('active');
                $currentMenu.parent().addClass('active');
            }
        }
    },
    misc:function(){
        // BackToTop Button click event
        $('.totop-btn').click(function () {
            $("html, body").animate({scrollTop: 0}, 800);
            return false;
        });
        $('.go-to-comment').click(function(event) {
            $('html, body').stop().animate({scrollTop: $('.comment-wrap').offset().top}, 800);
        });
    },
    init: function () {
        ghostApp.reformatPost();
        ghostApp.isotopeSetup();
        ghostApp.infiniteScrollSetup();
        ghostApp.getRecentPosts();
        ghostApp.getFlickr();
        ghostApp.getInstagram();
        ghostApp.getDribbble();
        ghostApp.mailchimpSetup();
        ghostApp.updateCommentCount();
        ghostApp.fitVids();
        ghostApp.getAuthorInfo();
        ghostApp.syntaxHighlighter();
        ghostApp.mainMenuEvents();
        ghostApp.misc();
    }
};

/*================================================================*/
/*  2. Initialing
/*================================================================*/
$(document).ready(function() {
    ghostApp.init();
});