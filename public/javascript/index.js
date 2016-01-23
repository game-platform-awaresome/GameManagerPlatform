$(function () {
    //console.log($("#right_part").width());
    $(window).resize(function(){
        console.log("windows size changed, new size is: " + $("#right_part").width());
        changeTabListAndMoreTabListWhenWidowsSizeChanged();
    });
    var username = getUrlParam('name');
    console.log("username: " + username);
    $("#userInfo .userLoginName").html(username);

    $("#headerNav .nav li").click(function () {
        $(this).siblings().removeClass("active").end().addClass("active");
        if ($(this).hasClass("nav_home")) {
            chooseTab($(this).find("a").attr("_href"), $(this).find("a").attr("page_title"));
        }
    });

    $("#displayArrow").click(function() {
          if($(this).hasClass("open"))
          {
              $(this).removeClass("open");
              $("#right_part").css("left", "0px");
              $("#left_part").css("left", "-200px");
          }else
          {
              $(this).addClass("open");
              $("#right_part").css("left", "200px");
              $("#left_part").css("left", "0");
          }
          console.log("Current size is: " + $("#right_part").width());
          changeTabListAndMoreTabListWhenWidowsSizeChanged();
    });

    $("#right_part .tabbed ul").on('click', 'span', function () {
        console.log("tablist span click.");
        var show_nav_list = $("#right_part .tabbed ul li"); 
        var index = show_nav_list.index($(this).parent());
        if ( -1 == index ) {
            return;
        }
        console.log("tab " + index + " click");
        show_nav_list.removeClass("active").eq(index).addClass("active");
        var iframe_box = $("#right_part .show_iframe");
        iframe_box.find(".iframe_content").hide().eq(index).show();
    });

    $("#right_part .more_tab ul").on('click', 'span', function () {
        console.log("more_tab span click.");
        var show_nav_list = $("#right_part .more_tab ul li");
        var index = show_nav_list.index($(this).parent());
        var tablistsize = $("#right_part .tabbed ul li").size();
        console.log("iframe_box: " + tablistsize + " display.");
        $("#right_part .show_iframe .iframe_content").hide().eq(tablistsize + index).show();
    });

    $("#right_part .tabbed ul").on('click', '.close', function () {
        var tabIndex = $(this).parent().index();
        var show_nav = $("#right_part .tabbed ul li");
        var iframe_box = $("#right_part .show_iframe");
        var isCurrentTabActive = $(this).parent().hasClass("active");
        console.log('tabIndex:' + tabIndex);
        $(this).parent().remove();
        iframe_box.find(".iframe_content").eq(tabIndex).remove();
        if (isCurrentTabActive) {
            show_nav.eq(tabIndex - 1).addClass("active");
            console.log("tab " + (tabIndex - 1) + " has add active class.");
            iframe_box.find(".iframe_content").eq(tabIndex - 1).show();
        }
        moveItemFromMoreTabListIntoTabList();
    });
    
    //更多菜单箭头
    $(".arrow_box").click(function () {
        console.log("arrow_box");
        if ($(this).hasClass("down")) {
            $(".arrow_box").removeClass("down");
            $(".arrow_box").addClass("up");
            $(".more_tab").slideDown("1000");
        } else if ($(this).hasClass("up")) {
            $(".arrow_box").removeClass("up");
            $(".arrow_box").addClass("down");
            $(".more_tab").slideUp("1000");
        }
    });
});
var spanWidthInit = 60;
var spanWidthChanged = 60;
var eachLiMarginLeft = 30;
var eachSpanMargin = 23;
var marginRight = 50;

function changeTabListAndMoreTabListWhenWidowsSizeChanged() {
    var windowSize = $("#right_part").width();
    var eachWidth = spanWidthInit + eachSpanMargin * 2 + eachLiMarginLeft;
    var maxTabNum = parseInt((windowSize - marginRight) / eachWidth); 
    var curTabNum = $("#right_part .tabbed ul").children().size();
    console.log("windowSize: " + windowSize + ", maxTabNum: " + maxTabNum + ", curTabNum: " + curTabNum);
    if (maxTabNum < curTabNum) {
        //减少时
        for (var index = 0; index < (curTabNum - maxTabNum); ++index) {
            moveItemFromTabListIntoMoreTabList();
            console.log("move once time.");
        }
    } else if (maxTabNum > curTabNum){
        //变大时
        for (var index = 0; index < (maxTabNum - curTabNum); ++index) {
            moveItemFromMoreTabListIntoTabList();
            console.log("move once time.");
        }
    }
}

function moveItemFromMoreTabListIntoTabList () {
    if (!($(".arrow_box").hasClass("down") || $(".arrow_box").hasClass("up"))) {
        return;
    }
    var tabList = $("#right_part .tabbed ul");
    var moreTabList = $(".more_tab ul li");
    var moreTabListFirstChild = moreTabList.eq(0);
    href = moreTabListFirstChild.find('span').attr('page_href');
    titleName = moreTabListFirstChild.find('span').text();
    if (href == "home.html") {
        tabList.append('<li><span class="title" page_href="' + href + '">' + titleName + '</span></li>');
    } else {
        tabList.append('<li><span class="title" page_href="' + href + '">' + titleName + '</span><span class="close"><span></li>');
    }
    moreTabListFirstChild.remove();
    if ($(".more_tab ul li").size() == 0) {
        $(".arrow_box").removeClass("down up");
        $(".more_tab").hide();
    }
}

function moveItemFromTabListIntoMoreTabList () {
    if (!($(".arrow_box").hasClass("down") || $(".arrow_box").hasClass("up"))) {
        $(".arrow_box").addClass("down");
    }
    var tabList = $("#right_part .tabbed ul li");
    var moreTabList = $(".more_tab ul li");
    var tabListLastChild = tabList.eq(tabList.size() - 1);
    href = tabListLastChild.find('span').attr('page_href');
    titleName = tabListLastChild.find('span').text();
    if (moreTabList.size() == 0) {
        $(".more_tab ul").append('<li><span class="title" page_href="' + href + '">' + titleName + '</span></li>');
    } else {
        var moreTabListFirstChild = $(".more_tab ul li:first-child");
        moreTabListFirstChild.before('<li><span class="title" page_href="' + href + '">' + titleName + '</span></li>');
    }    
    tabListLastChild.remove();
    
}

function isNeedShowMoreTabWhenAddTab () {
    var windowSize = $("#right_part").width();
    var eachWidth = spanWidthInit + eachSpanMargin * 2 + eachLiMarginLeft;
    var maxTabNum = parseInt((windowSize - marginRight) / eachWidth); 
    var curTabNum = $("#right_part .tabbed ul").children().size();
    console.log("windowSize: " + windowSize + ", eachWidth: " + eachWidth + ", maxTabNum: " + maxTabNum + ", curTabNum: " + curTabNum);
    if (maxTabNum >= curTabNum + 1) {
        return false;
    } else {
        return true;
    }
}

function isNeedHideMoreTabWhenCloseTab () {
    var moreTabListNum = $(".more_tab ul").children().size();
    if (moreTabListNum > 0) {
        return false;
    } else {
        return true;
    }
}

function getUrlParam(name){
    //构造一个含有目标参数的正则表达式对象  
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
    //匹配目标参数  
    var r = window.location.search.substr(1).match(reg);  
    //返回参数值  
    if (r!=null) return unescape(r[2]);  
    return null;  
} 

function leftmenu_click(href, title) {
    console.log("call parant func successed;");
    chooseTab(href, title);
}

function chooseTab (href, title) {
    var tab_list = $("#right_part .tabbed ul li"); //所有的tab里的标签；
    var more_tab_list = $("#right_part .more_tab ul li"); //所有的more_tab里的标签；
    var isFound = false; //查找结果
    var bStopIndex = 0; //所在位置
    tab_list.each(function () { //在tab里遍历
        if ($(this).find('span').attr("page_href") == href) {
            isFound = true;
            bStopIndex = tab_list.index($(this));
            console.log("find tad in tab list.");
            return false;
        }
    });

    if (!isFound) {
        more_tab_list.each(function () { //在more_tab里遍历
            if ($(this).find('span').attr('page_href') == href) {
                isFound = true;
                bStopIndex = more_tab_list.index($(this)) + tab_list.size();
                console.log("find tad in more tab list.");
                return false;
            }
        });
    };

    if (!isFound) {
        console.log("Ready to create a iframe.");
        createIframe(href, title);
    } else {
        tab_list.removeClass("active");
        if (tab_list.size() >= (bStopIndex + 1)) {
            tab_list.eq(bStopIndex).addClass("active");
        }
        var iframe_box = $("#right_part .show_iframe");
        iframe_box.find(".iframe_content").hide().eq(bStopIndex).show().find("iframe").attr("src", href);
    };
}

function createIframe (href, titleName) {
    var show_nav = $("#right_part .tabbed ul");
    show_nav.find('li').removeClass("active");
    if ($(".arrow_box").hasClass("down") || $(".arrow_box").hasClass("up") || isNeedShowMoreTabWhenAddTab()) {
        if (!($(".arrow_box").hasClass("down") || $(".arrow_box").hasClass("up"))) {
            $(".arrow_box").addClass("down");
            console.log("Show the arrow_box.");
        }
        console.log("Add item in more_tab.");
        $(".more_tab ul").append('<li><span class="title" page_href="' + href + '">' + titleName + '</span></li>');
    } else {
        //add to tab
        console.log("Add item in tab list.");
        show_nav.append('<li class="active"><span class="title" page_href="' + href + '">' + titleName + '</span><span class="close"><span></li>');
    }
    
    //新建iframe_box
    var iframe_box = $("#right_part .show_iframe");
    var iframebox = iframe_box.find(".iframe_content");
    iframebox.hide();
    iframe_box.append('<iframe class="iframe_content" name="iframe_content" src=' + href + ' width="100%" height="100%" frameborder="0" ></iframe>');   
    var showbox = iframebox.find(".iframe_content:visible");
    showbox.find("iframe").load();
}
