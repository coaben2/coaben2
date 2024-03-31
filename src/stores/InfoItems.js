const dbToolTip = (($) => {
    let mouseX = 0;
    let mouseY = 0;

    const showToolTip = function (type) {
        const base_url = 'https://www.gw2.fr/'
        const ttId = $(this).attr(`data-gw2-${type}`);
        const ttUrl = `${base_url}tooltip/${type}/${ttId}`;
        let toolTip = $(`div[data-gw2-${type}-id="${ttId}"]`);

        if (toolTip.html() === undefined) {
            toolTip = $("<div />");
            $("body").append(toolTip);
            toolTip.html('<div class="inner"><img src="' + base_url + 'img/item-tooltip-loading.gif" /></div>');
            toolTip.attr(`data-gw2-${type}-id`, ttId);
            toolTip.addClass("tooltip");

            $.getJSON(ttUrl, function (data) {
                toolTip.html(`<div class="inner">${data.html}</div>`);
                toolTip.addClass("loaded");
                $(this).dbToolTip_Pos(type, toolTip);
            });
        }

        $(toolTip).show();
    };

    const positionToolTip = function (type, toolTip) {
        const ttId = $(this).attr(`data-gw2-${type}`);
        if (!toolTip)
            toolTip = $(`div[data-gw2-${type}-id="${ttId}"]`);

        const screenRight = $(document).scrollLeft() + $(window).width();
        const leftMax = mouseX + 15;
        const leftMin = mouseX - toolTip.width() - 15;
        const leftDecal = leftMax + toolTip.width() + 15 < screenRight ? leftMax : leftMin;

        const screenBottom = $(document).scrollTop() + $(window).height();
        const topMax = mouseY + 15;
        const topMin = screenBottom - toolTip.height() - 15;
        const topDecal = topMax + toolTip.height() + 15 < screenBottom ? topMax : topMin;

        toolTip.css({
            top: topDecal,
            left: leftDecal
        });
    };

    $("body").on("mousemove", "*[data-gw2-item], *[data-gw2-recipe], *[data-gw2-mystic]", function (e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
        let type = "item";
        if ($(this).attr("data-gw2-recipe"))
            type = "recipe";
        else if ($(this).attr("data-gw2-mystic"))
            type = "mystic";
        positionToolTip.call(this, type);
    });

    $("body").on("mouseenter", "*[data-gw2-item], *[data-gw2-recipe], *[data-gw2-mystic]", function (e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
        let type = "item";
        if ($(this).attr("data-gw2-recipe"))
            type = "recipe";
        else if ($(this).attr("data-gw2-mystic"))
            type = "mystic";
        showToolTip.call(this, type);
    });

    $("body").on("mouseleave", "*[data-gw2-item], *[data-gw2-recipe], *[data-gw2-mystic]", function () {
        $(".tooltip").hide();
    });
    return { dbToolTip }
});
